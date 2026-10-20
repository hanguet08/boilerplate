import { Button, Modal, Popconfirm, QRCode, Typography } from 'antd';
import { CopyOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { Table } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { downloadTableQrPng, getTableQr, regenerateQr } from '@/services/table.service';
import { normalizeText } from '@/ultils/function';
import { getErrorMessage } from '@/ultils/format';

interface IProps {
  table: Table | null;
  onClose: () => void;
}

export default function TableQrModal({ table, onClose }: IProps) {
  const queryClient = useQueryClient();
  const { restaurantId, restaurant } = useAuth();

  const { data, isLoading } = useQuery(
    ['tables', restaurantId, 'qr', table?.id, table?.qrToken],
    () => getTableQr(restaurantId as number, (table as Table).id),
    { enabled: Boolean(restaurantId && table) },
  );

  const regenerate = useMutation(() => regenerateQr(restaurantId as number, (table as Table).id), {
    onSuccess: () => {
      showMessage.success('Đã tạo QR mới. QR cũ đã hết hiệu lực.');
      queryClient.invalidateQueries(['tables', restaurantId]);
    },
    onError: (err) => showMessage.error(getErrorMessage(err)),
  });

  const download = useMutation(
    () =>
      downloadTableQrPng(
        restaurantId as number,
        (table as Table).id,
        `${normalizeText(table?.name ?? 'qr').replace(/\s+/g, '-')}.png`,
      ),
    { onError: (err) => showMessage.error(getErrorMessage(err)) },
  );

  const copyLink = async () => {
    if (!data?.url) return;
    try {
      await navigator.clipboard.writeText(data.url);
      showMessage.success('Đã sao chép link');
    } catch {
      showMessage.error('Không sao chép được, hãy copy thủ công');
    }
  };

  return (
    <Modal
      open={Boolean(table)}
      onCancel={onClose}
      footer={null}
      title={`QR ${table?.name ?? ''}`}
      width={400}
      destroyOnClose
    >
      {isLoading || !data ? (
        <PageLoading />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full rounded-2xl bg-gradient-to-b from-orange-50 to-white border border-solid border-orange-100 p-5 flex flex-col items-center">
            <div className="font-semibold text-gray-700">{restaurant?.name}</div>
            <QRCode value={data.url} size={200} bordered={false} className="my-3 bg-white" />
            <div className="text-2xl font-bold">{table?.name?.toUpperCase()}</div>
            <div className="text-gray-500 text-sm">Quét để gọi món</div>
          </div>
          <Typography.Text type="secondary" className="text-xs break-all text-center">
            {data.url}
          </Typography.Text>
          <div className="w-full flex flex-col gap-2">
            <Button
              type="primary"
              size="large"
              block
              icon={<DownloadOutlined />}
              loading={download.isLoading}
              onClick={() => download.mutate()}
            >
              Tải QR (PNG)
            </Button>
            <div className="flex gap-2">
              <Button block icon={<CopyOutlined />} onClick={copyLink}>
                Sao chép link
              </Button>
              <Popconfirm
                title="Tạo lại QR?"
                description="QR cũ đã in sẽ mất hiệu lực ngay."
                okText="Tạo lại"
                cancelText="Huỷ"
                onConfirm={() => regenerate.mutateAsync()}
              >
                <Button block danger icon={<ReloadOutlined />} loading={regenerate.isLoading}>
                  Tạo lại QR
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
