import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Segmented, Switch } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/layout/app';
import ImageUpload from '@/components/common/ImageUpload';
import { showMessage } from '@/components/messages/GMessage';
import { ME_QUERY_KEY, useAuth } from '@/providers/AuthProvider';
import { changePassword, updateMe } from '@/services/auth.service';
import { sendTestPush } from '@/services/push.service';
import { RestaurantPayload, updateRestaurant } from '@/services/restaurant.service';
import { disablePush, enablePush, getPushSubscription, isPushSupported } from '@/ultils/push';
import { getErrorMessage } from '@/ultils/format';

type TabKey = 'restaurant' | 'account' | 'notifications';

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-solid border-gray-100 p-4 sm:p-6">
    <h2 className="text-base font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

function RestaurantSettings() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurant, restaurantId } = useAuth();

  useEffect(() => {
    if (restaurant) form.setFieldsValue({ ...restaurant, active: restaurant.status === 'ACTIVE' });
  }, [restaurant]);

  const mutation = useMutation(
    ({ active, ...values }: any) => {
      const body: RestaurantPayload = {
        name: values.name?.trim(),
        slug: values.slug?.trim(),
        phone: values.phone?.trim() || null,
        address: values.address?.trim() || null,
        logoUrl: values.logoUrl || null,
        status: active ? 'ACTIVE' : 'INACTIVE',
      };
      return updateRestaurant(restaurantId as number, body);
    },
    {
      onSuccess: () => {
        showMessage.success('Đã lưu thông tin quán');
        queryClient.invalidateQueries(ME_QUERY_KEY);
      },
      onError: (err: any) =>
        showMessage.error(err?.status === 409 ? 'Slug đã được dùng' : getErrorMessage(err)),
    },
  );

  return (
    <Card title="Thông tin quán">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={mutation.mutate}
        className="max-w-xl"
      >
        <Form.Item name="logoUrl" label="Logo">
          <ImageUpload restaurantId={restaurantId as number} className="w-20 h-20" />
        </Form.Item>
        <Form.Item name="name" label="Tên quán" rules={[{ required: true, whitespace: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, pattern: /^[a-z0-9-]+$/, message: 'Chỉ dùng chữ thường, số và dấu -' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input inputMode="tel" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          name="active"
          label="Đang hoạt động"
          valuePropName="checked"
          extra="Khi tắt, khách sẽ không quét QR gọi món được"
        >
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
          Lưu thay đổi
        </Button>
      </Form>
    </Card>
  );
}

function AccountSettings() {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { me } = useAuth();

  useEffect(() => {
    if (me) profileForm.setFieldsValue({ name: me.name, email: me.email });
  }, [me]);

  const profile = useMutation((values: { name: string }) => updateMe({ name: values.name.trim() }), {
    onSuccess: () => {
      showMessage.success('Đã cập nhật hồ sơ');
      queryClient.invalidateQueries(ME_QUERY_KEY);
    },
    onError: (err) => showMessage.error(getErrorMessage(err)),
  });

  const password = useMutation(
    (values: { currentPassword: string; newPassword: string }) =>
      changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    {
      onSuccess: () => {
        showMessage.success('Đã đổi mật khẩu');
        passwordForm.resetFields();
      },
      onError: (err: any) =>
        showMessage.error(err?.status === 401 ? 'Mật khẩu hiện tại không đúng' : getErrorMessage(err)),
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <Card title="Hồ sơ">
        <Form
          form={profileForm}
          layout="vertical"
          requiredMark={false}
          onFinish={profile.mutate}
          className="max-w-xl"
        >
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, whitespace: true, max: 100 }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={profile.isLoading}>
            Lưu
          </Button>
        </Form>
      </Card>
      <Card title="Đổi mật khẩu">
        <Form
          form={passwordForm}
          layout="vertical"
          requiredMark={false}
          onFinish={password.mutate}
          className="max-w-xl"
        >
          <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, min: 6, max: 72, message: 'Mật khẩu 6–72 ký tự' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Nhập lại mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  !value || getFieldValue('newPassword') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Mật khẩu không khớp')),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={password.isLoading}>
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const supported = isPushSupported();

  useEffect(() => {
    getPushSubscription().then((sub) => setEnabled(Boolean(sub)));
  }, []);

  const toggle = async (checked: boolean) => {
    setBusy(true);
    try {
      if (checked) await enablePush();
      else await disablePush();
      setEnabled(checked);
      showMessage.success(checked ? 'Đã bật thông báo trên thiết bị này' : 'Đã tắt thông báo');
    } catch (err: any) {
      if (err?.status === 503) setUnavailable(true);
      showMessage.error(err?.status === 503 ? 'Máy chủ chưa cấu hình Web Push' : getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const test = useMutation(sendTestPush, {
    onSuccess: ({ sent }) => showMessage.info(`Đã gửi thử tới ${sent} thiết bị (ẩn app để thấy thông báo)`),
    onError: (err) => showMessage.error(getErrorMessage(err)),
  });

  return (
    <Card title="Thông báo đơn mới">
      <div className="flex flex-col gap-4 max-w-xl">
        <p className="text-sm text-gray-500">
          Khi app đang mở, đơn mới sẽ hiện popup kèm âm báo/rung. Bật thông báo đẩy để nhận cả khi app chạy
          nền hoặc đã đóng.
        </p>
        {!supported || unavailable ? (
          <div className="text-sm bg-amber-50 text-amber-700 rounded-lg p-3">
            {unavailable
              ? 'Máy chủ chưa cấu hình Web Push.'
              : 'Trình duyệt này chưa hỗ trợ thông báo đẩy. Trên iPhone, hãy "Thêm vào màn hình chính" (iOS 16.4+) rồi mở app từ đó.'}
          </div>
        ) : (
          <>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium">Thông báo đẩy trên thiết bị này</span>
              <Switch checked={enabled} loading={busy} onChange={toggle} />
            </label>
            {enabled && (
              <Button className="self-start" loading={test.isLoading} onClick={() => test.mutate()}>
                Gửi thông báo thử
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { isOwner } = useAuth();
  const requested = router.query.tab as TabKey;
  const tab: TabKey =
    requested === 'account' || requested === 'notifications' ? requested : isOwner ? 'restaurant' : 'account';

  const options = [
    ...(isOwner ? [{ value: 'restaurant', label: 'Thông tin quán' }] : []),
    { value: 'account', label: 'Tài khoản' },
    { value: 'notifications', label: 'Thông báo' },
  ];

  return (
    <AppLayout title="Cài đặt">
      <div className="flex flex-col gap-4 max-w-3xl">
        <Segmented
          value={tab}
          options={options}
          onChange={(value) => router.replace({ query: { tab: value } }, undefined, { shallow: true })}
          className="self-start"
        />
        {tab === 'restaurant' && <RestaurantSettings />}
        {tab === 'account' && <AccountSettings />}
        {tab === 'notifications' && <NotificationSettings />}
      </div>
    </AppLayout>
  );
}
