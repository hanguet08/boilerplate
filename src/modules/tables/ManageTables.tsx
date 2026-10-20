import { useState } from 'react';
import { Button, Dropdown, Grid, Modal, Switch, Table as AntTable, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/layout/app';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { TABLE_STATE } from '@/constants/order';
import { Table, TableOverview } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { deleteTable, getTablesOverview, updateTable } from '@/services/table.service';
import { getErrorMessage } from '@/ultils/format';
import TableFormModal from './components/TableFormModal';
import TableQrModal from './components/TableQrModal';

export default function ManageTables() {
  const queryClient = useQueryClient();
  const screens = Grid.useBreakpoint();
  const { restaurantId } = useAuth();
  const [editing, setEditing] = useState<Table | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [qrTable, setQrTable] = useState<Table | null>(null);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery(['tables', restaurantId, 'overview'], () => getTablesOverview(restaurantId as number), {
    enabled: Boolean(restaurantId),
  });

  const invalidate = () => queryClient.invalidateQueries(['tables', restaurantId]);

  const toggleStatus = useMutation(
    (table: Table) =>
      updateTable(restaurantId as number, table.id, {
        status: table.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      }),
    { onSuccess: invalidate, onError: (err) => showMessage.error(getErrorMessage(err)) },
  );

  const remove = useMutation((table: Table) => deleteTable(restaurantId as number, table.id), {
    onSuccess: () => {
      showMessage.success('Đã xoá bàn');
      invalidate();
    },
  });

  const confirmDelete = (table: Table) =>
    Modal.confirm({
      title: `Xoá ${table.name}?`,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () =>
        remove.mutateAsync(table).catch((err) => {
          if (err?.status === 409) {
            Modal.warning({
              title: 'Không thể xoá bàn đã có order',
              content: 'Bạn có thể tắt "Hoạt động" để ngưng sử dụng bàn này.',
            });
          } else showMessage.error(getErrorMessage(err));
        }),
    });

  const openEdit = (table: Table | null) => {
    setEditing(table);
    setFormOpen(true);
  };

  const rowMenu = (table: Table) => ({
    items: [
      { key: 'qr', icon: <QrcodeOutlined />, label: 'Xem / tải QR', onClick: () => setQrTable(table) },
      { key: 'edit', icon: <EditOutlined />, label: 'Sửa', onClick: () => openEdit(table) },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xoá',
        danger: true,
        onClick: () => confirmDelete(table),
      },
    ],
  });

  const nextSortOrder = data.reduce((max, t) => Math.max(max, t.sortOrder), 0) + 1;

  return (
    <AppLayout
      title="Quản lý bàn"
      ownerOnly
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit(null)}>
          <span className="hidden sm:inline">Thêm bàn</span>
        </Button>
      }
    >
      {isLoading && <PageLoading />}
      {error && <PageError error={error} onRetry={refetch} />}
      {!isLoading && !error && data.length === 0 && (
        <EmptyState description="Chưa có bàn nào. Thêm bàn để tạo mã QR cho khách gọi món.">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit(null)}>
            Thêm bàn
          </Button>
        </EmptyState>
      )}

      {data.length > 0 &&
        (screens.md ? (
          <AntTable<TableOverview>
            rowKey="id"
            dataSource={data}
            pagination={false}
            className="bg-white rounded-xl overflow-hidden"
            columns={[
              { title: 'Bàn', dataIndex: 'name', render: (name) => <b>{name}</b> },
              {
                title: 'Trạng thái',
                dataIndex: 'state',
                render: (state: TableOverview['state']) => (
                  <Tag color={state === 'EMPTY' ? 'green' : state === 'SERVING' ? 'orange' : 'red'}>
                    {TABLE_STATE[state].label}
                  </Tag>
                ),
              },
              { title: 'Thứ tự', dataIndex: 'sortOrder', width: 90 },
              {
                title: 'Hoạt động',
                dataIndex: 'status',
                width: 110,
                render: (_, table) => (
                  <Switch
                    size="small"
                    checked={table.status === 'ACTIVE'}
                    loading={toggleStatus.isLoading && toggleStatus.variables?.id === table.id}
                    onChange={() => toggleStatus.mutate(table)}
                  />
                ),
              },
              {
                title: 'QR',
                width: 100,
                render: (_, table) => (
                  <Button size="small" icon={<QrcodeOutlined />} onClick={() => setQrTable(table)}>
                    QR
                  </Button>
                ),
              },
              {
                title: '',
                width: 100,
                align: 'right',
                render: (_, table) => (
                  <div className="flex justify-end gap-1">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(table)} />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => confirmDelete(table)}
                    />
                  </div>
                ),
              },
            ]}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {data.map((table) => (
              <div
                key={table.id}
                className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-3"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${TABLE_STATE[table.state].dotClassName}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{table.name}</div>
                  <div className="text-xs text-gray-500">
                    {table.status === 'ACTIVE' ? TABLE_STATE[table.state].label : 'Ngưng hoạt động'}
                  </div>
                </div>
                <Switch
                  size="small"
                  checked={table.status === 'ACTIVE'}
                  onChange={() => toggleStatus.mutate(table)}
                />
                <Button icon={<QrcodeOutlined />} onClick={() => setQrTable(table)} />
                <Dropdown menu={rowMenu(table)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
            ))}
          </div>
        ))}

      <TableFormModal
        open={formOpen}
        table={editing}
        nextSortOrder={nextSortOrder}
        onClose={() => setFormOpen(false)}
      />
      <TableQrModal
        table={qrTable && (data.find((t) => t.id === qrTable.id) ?? qrTable)}
        onClose={() => setQrTable(null)}
      />
    </AppLayout>
  );
}
