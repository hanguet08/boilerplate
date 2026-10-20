import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Segmented, Switch } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from '@/components/messages/GMessage';
import { Table } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { createTable, updateTable } from '@/services/table.service';
import { getErrorMessage } from '@/ultils/format';

interface IProps {
  open: boolean;
  table?: Table | null;
  nextSortOrder: number;
  onClose: () => void;
}

type Mode = 'single' | 'bulk';

const pad = (n: number) => String(n).padStart(2, '0');

export default function TableFormModal({ open, table, nextSortOrder, onClose }: IProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const [mode, setMode] = useState<Mode>('single');
  const isEdit = Boolean(table);

  useEffect(() => {
    if (!open) return;
    setMode('single');
    form.setFieldsValue(
      table
        ? { name: table.name, sortOrder: table.sortOrder, active: table.status === 'ACTIVE' }
        : {
            name: `Bàn ${pad(nextSortOrder)}`,
            sortOrder: nextSortOrder,
            active: true,
            prefix: 'Bàn',
            from: nextSortOrder,
            count: 5,
          },
    );
  }, [open, table]);

  const save = useMutation(
    async (values: any) => {
      const rid = restaurantId as number;
      if (isEdit) {
        return updateTable(rid, (table as Table).id, {
          name: values.name.trim(),
          sortOrder: values.sortOrder,
          status: values.active ? 'ACTIVE' : 'INACTIVE',
        });
      }
      if (mode === 'bulk') {
        // Sequential so sortOrder/name stay in order on the server
        for (let i = 0; i < values.count; i++) {
          const n = values.from + i;
          await createTable(rid, { name: `${values.prefix.trim()} ${pad(n)}`, sortOrder: n });
        }
        return;
      }
      return createTable(rid, { name: values.name.trim(), sortOrder: values.sortOrder });
    },
    {
      onSuccess: () => {
        showMessage.success(isEdit ? 'Đã cập nhật bàn' : 'Đã thêm bàn');
        queryClient.invalidateQueries(['tables', restaurantId]);
        onClose();
      },
      onError: (err) => {
        showMessage.error(getErrorMessage(err));
        queryClient.invalidateQueries(['tables', restaurantId]);
      },
    },
  );

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa bàn' : 'Thêm bàn'}
      okText={isEdit ? 'Lưu' : 'Thêm'}
      cancelText="Huỷ"
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={save.isLoading}
      destroyOnClose
    >
      {!isEdit && (
        <Segmented
          block
          className="mb-4"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: 'single', label: 'Một bàn' },
            { value: 'bulk', label: 'Nhiều bàn' },
          ]}
        />
      )}
      <Form form={form} layout="vertical" requiredMark={false} onFinish={save.mutate}>
        {mode === 'single' ? (
          <>
            <Form.Item name="name" label="Tên bàn" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="Bàn 01" />
            </Form.Item>
            <Form.Item name="sortOrder" label="Thứ tự hiển thị">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            {isEdit && (
              <Form.Item
                name="active"
                label="Đang hoạt động"
                valuePropName="checked"
                extra="Tắt để khách không quét QR bàn này được"
              >
                <Switch />
              </Form.Item>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="prefix" label="Tiền tố" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="from" label="Bắt đầu từ" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="count" label="Số bàn" rules={[{ required: true }]}>
              <InputNumber min={1} max={50} className="w-full" />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
}
