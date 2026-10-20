import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button } from 'antd';
import {
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  QrcodeOutlined,
  RightOutlined,
  SettingOutlined,
  ShopOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AppLayout from '@/layout/app';
import { useAuth } from '@/providers/AuthProvider';
import { useRealtime } from '@/providers/RealtimeProvider';

export default function MorePage() {
  const router = useRouter();
  const { restaurant, me, isOwner, memberships, signOut } = useAuth();
  const { connected } = useRealtime();

  const links = [
    ...(isOwner
      ? [
          { href: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
          { href: '/manage/tables', icon: <QrcodeOutlined />, label: 'Quản lý bàn & QR' },
          { href: '/staff', icon: <TeamOutlined />, label: 'Nhân viên' },
          { href: '/settings?tab=restaurant', icon: <ShopOutlined />, label: 'Thông tin quán' },
        ]
      : []),
    { href: '/settings?tab=notifications', icon: <BellOutlined />, label: 'Thông báo' },
    { href: '/settings?tab=account', icon: <UserOutlined />, label: 'Tài khoản' },
    ...(memberships.length > 1 ? [{ href: '/restaurants', icon: <SwapOutlined />, label: 'Đổi quán' }] : []),
  ];

  return (
    <AppLayout
      title="Thêm"
      extra={<Button type="text" icon={<SettingOutlined />} onClick={() => router.push('/settings')} />}
    >
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        <div className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-4">
          <Avatar size={56} src={restaurant?.logoUrl || undefined} className="bg-primary shrink-0 text-xl">
            {restaurant?.name?.[0]}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-base truncate">{restaurant?.name}</div>
            <div className="text-sm text-gray-500 truncate">{me?.email}</div>
            <div className="text-xs flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              <span className={connected ? 'text-emerald-600' : 'text-gray-500'}>
                {connected ? 'Đang nhận order realtime' : 'Mất kết nối realtime'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-solid border-gray-100 divide-y divide-x-0 divide-solid divide-gray-100">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3.5 text-gray-800"
            >
              <span className="text-lg flex text-gray-500">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              <RightOutlined className="text-xs text-gray-400" />
            </Link>
          ))}
        </div>

        <Button
          danger
          size="large"
          block
          icon={<LogoutOutlined />}
          onClick={signOut}
          className="bg-rose-50 border-0"
        >
          Đăng xuất
        </Button>
      </div>
    </AppLayout>
  );
}
