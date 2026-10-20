import { useState } from 'react';
import { Avatar, Button, Dropdown, Form, Input, Modal, Select, Tag } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/layout/app';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { Membership } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { addStaff, getStaff, removeStaff, StaffPayload, updateStaff } from '@/services/restaurant.service';
import { filterInvalidField } from '@/ultils/function';
import { getErrorMessage } from '@/ultils/format';

const ROLE_OPTIONS = [
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'OWNER', label: 'Chủ quán' },
];

function AddStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const [needAccount, setNeedAccount] = useState(false);

  const mutation = useMutation(
    (body: StaffPayload) => addStaff(restaurantId as number, filterInvalidField(body)),
    {
      onSuccess: () => {
        showMessage.success('Đã thêm nhân viên');
        queryClient.invalidateQueries(['staff', restaurantId]);
        form.resetFields();
        setNeedAccount(false);
        onClose();
      },
      onError: (err: any) => {
        if (err?.status === 409) return showMessage.error('Người này đã là thành viên của quán');
        // Email has no account yet → ask for name + password to create one
        if (err?.status === 400 && !needAccount) {
          setNeedAccount(true);
          return showMessage.info('Email chưa có tài khoản, hãy nhập tên và mật khẩu để tạo mới');
        }
        showMessage.error(getErrorMessage(err));
      },
    },
  );

  return (
    <Modal
      open={open}
      title="Thêm nhân viên"
      okText="Thêm"
      cancelText="Huỷ"
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={mutation.isLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ role: 'STAFF' }}
        onFinish={mutation.mutate}
      >
        <Form.Item
          name="email"
          label="Email"
          extra="Nếu email đã có tài khoản QOrder, chỉ cần nhập email."
          rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="nhanvien@email.com" />
        </Form.Item>
        <Form.Item name="role" label="Vai trò">
          <Select options={ROLE_OPTIONS} />
        </Form.Item>
        {needAccount ? (
          <>
            <Form.Item name="name" label="Họ tên" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, min: 6, max: 72, message: 'Mật khẩu 6–72 ký tự' }]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </>
        ) : (
          <Button type="link" className="px-0" onClick={() => setNeedAccount(true)}>
            Tạo tài khoản mới cho nhân viên
          </Button>
        )}
      </Form>
    </Modal>
  );
}

export default function StaffPage() {
  const queryClient = useQueryClient();
  const { restaurantId, me } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery(['staff', restaurantId], () => getStaff(restaurantId as number), {
    enabled: Boolean(restaurantId),
  });

  const onError = (err: unknown) => showMessage.error(getErrorMessage(err));
  const invalidate = () => queryClient.invalidateQueries(['staff', restaurantId]);

  const update = useMutation(
    ({ member, body }: { member: Membership; body: Parameters<typeof updateStaff>[2] }) =>
      updateStaff(restaurantId as number, member.id, body),
    { onSuccess: invalidate, onError },
  );
  const remove = useMutation((member: Membership) => removeStaff(restaurantId as number, member.id), {
    onSuccess: () => {
      showMessage.success('Đã xoá khỏi quán');
      invalidate();
    },
    onError,
  });

  const memberMenu = (member: Membership) => ({
    items: [
      {
        key: 'role',
        label: member.role === 'OWNER' ? 'Chuyển thành Nhân viên' : 'Chuyển thành Chủ quán',
        onClick: () => update.mutate({ member, body: { role: member.role === 'OWNER' ? 'STAFF' : 'OWNER' } }),
      },
      {
        key: 'status',
        label: member.status === 'ACTIVE' ? 'Tạm khoá' : 'Mở khoá',
        onClick: () =>
          update.mutate({ member, body: { status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } }),
      },
      {
        key: 'remove',
        label: 'Xoá khỏi quán',
        danger: true,
        onClick: () =>
          Modal.confirm({
            title: `Xoá ${member.user?.name} khỏi quán?`,
            okText: 'Xoá',
            okButtonProps: { danger: true },
            cancelText: 'Huỷ',
            onOk: () => remove.mutateAsync(member),
          }),
      },
    ],
  });

  return (
    <AppLayout
      title="Nhân viên"
      ownerOnly
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
          <span className="hidden sm:inline">Thêm nhân viên</span>
        </Button>
      }
    >
      {isLoading && <PageLoading />}
      {error && <PageError error={error} onRetry={refetch} />}
      {!isLoading && !error && data.length === 0 && <EmptyState description="Chưa có nhân viên" />}
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {data.map((member) => {
          const isMe = member.userId === me?.id;
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-3"
            >
              <Avatar size={44} src={member.user?.avatarUrl || undefined} className="bg-primary shrink-0">
                {member.user?.name?.[0]}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {member.user?.name} {isMe && <span className="text-gray-400 text-sm">(bạn)</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">{member.user?.email}</div>
                <div className="flex gap-1 mt-1">
                  <Tag color={member.role === 'OWNER' ? 'blue' : 'default'}>
                    {member.role === 'OWNER' ? 'Chủ quán' : 'Nhân viên'}
                  </Tag>
                  {member.status === 'INACTIVE' && <Tag color="red">Đã khoá</Tag>}
                </div>
              </div>
              {!isMe && (
                <Dropdown menu={memberMenu(member)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              )}
            </div>
          );
        })}
      </div>
      <AddStaffModal open={addOpen} onClose={() => setAddOpen(false)} />
    </AppLayout>
  );
}
