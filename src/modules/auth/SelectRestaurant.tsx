import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Avatar, Button, Form, Input, Tag } from 'antd';
import { LogoutOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { useAuth } from '@/providers/AuthProvider';
import { createRestaurant, RestaurantPayload } from '@/services/restaurant.service';
import { filterInvalidField } from '@/ultils/function';
import { getErrorMessage } from '@/ultils/format';

export default function SelectRestaurant() {
  const router = useRouter();
  const { ready, token, me, memberships, selectRestaurant, refetchMe, signOut } = useAuth();
  const [creating, setCreating] = useState(false);
  const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/tables';

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token]);

  const choose = (rid: number) => {
    selectRestaurant(rid);
    router.push(redirect);
  };

  const mutation = useMutation((body: RestaurantPayload) => createRestaurant(filterInvalidField(body)), {
    onSuccess: async (restaurant) => {
      await refetchMe();
      showMessage.success('Đã tạo quán');
      selectRestaurant(restaurant.id);
      // A brand-new restaurant has no tables/menu yet — owners start in settings
      router.push('/manage/tables');
    },
    onError: (error: any) =>
      showMessage.error(error?.status === 409 ? 'Slug này đã được dùng' : getErrorMessage(error)),
  });

  if (!me) return <PageLoading className="min-h-screen" />;

  const showCreate = creating || memberships.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <Head>
        <title>Chọn quán · QOrder</title>
      </Head>
      <div className="w-full max-w-md py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-gray-500 text-sm">Xin chào,</div>
            <div className="text-xl font-bold">{me.name}</div>
          </div>
          <Button icon={<LogoutOutlined />} onClick={signOut}>
            Đăng xuất
          </Button>
        </div>

        {memberships.length > 0 && (
          <>
            <h2 className="text-base font-semibold mb-3">Chọn quán</h2>
            <div className="flex flex-col gap-2">
              {memberships.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => choose(m.restaurantId)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-solid border-gray-100 cursor-pointer text-left hover:border-primary transition-colors"
                >
                  <Avatar size={44} src={m.restaurant?.logoUrl || undefined} className="bg-primary shrink-0">
                    {m.restaurant?.name?.[0]}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{m.restaurant?.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {m.restaurant?.address || m.restaurant?.slug}
                    </div>
                  </div>
                  <Tag color={m.role === 'OWNER' ? 'blue' : 'default'}>
                    {m.role === 'OWNER' ? 'Chủ quán' : 'Nhân viên'}
                  </Tag>
                  <RightOutlined className="text-gray-400" />
                </button>
              ))}
            </div>
          </>
        )}

        {showCreate ? (
          <div className="bg-white rounded-xl border border-solid border-gray-100 p-5 mt-6">
            <h2 className="text-base font-semibold mb-1">Tạo quán mới</h2>
            <p className="text-gray-500 text-sm mb-4">
              {memberships.length === 0
                ? 'Bạn chưa thuộc quán nào. Tạo quán của bạn, hoặc nhờ chủ quán thêm bạn làm nhân viên.'
                : 'Bạn sẽ là chủ quán (OWNER).'}
            </p>
            <Form layout="vertical" requiredMark={false} onFinish={mutation.mutate}>
              <Form.Item name="name" label="Tên quán" rules={[{ required: true, whitespace: true }]}>
                <Input placeholder="Quán Hương Quê" />
              </Form.Item>
              <Form.Item
                name="slug"
                label="Đường dẫn (slug)"
                extra="Bỏ trống để tự tạo từ tên quán"
                rules={[{ pattern: /^[a-z0-9-]*$/, message: 'Chỉ dùng chữ thường, số và dấu -' }]}
              >
                <Input placeholder="quan-huong-que" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="0900 000 000" inputMode="tel" />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Số nhà, đường, quận..." />
              </Form.Item>
              <div className="flex gap-2">
                {memberships.length > 0 && <Button onClick={() => setCreating(false)}>Huỷ</Button>}
                <Button type="primary" htmlType="submit" block loading={mutation.isLoading}>
                  Tạo quán
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            className="mt-4"
            onClick={() => setCreating(true)}
          >
            Tạo quán mới
          </Button>
        )}
      </div>
    </div>
  );
}
