import { useRouter } from 'next/router';
import { Avatar, Dropdown } from 'antd';
import { LogoutOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/providers/AuthProvider';
import { useRealtime } from '@/providers/RealtimeProvider';

export default function SidebarFooter() {
  const router = useRouter();
  const { me, restaurant, role, memberships, signOut } = useAuth();
  const { connected } = useRealtime();

  const items = [
    ...(memberships.length > 1
      ? [
          {
            key: 'switch',
            icon: <SwapOutlined />,
            label: 'Đổi quán',
            onClick: () => router.push('/restaurants'),
          },
        ]
      : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Tài khoản',
      onClick: () => router.push('/settings?tab=account'),
    },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true, onClick: signOut },
  ];

  return (
    <div className="border-0 border-t border-solid border-white/10 p-3">
      <Dropdown menu={{ items }} trigger={['click']} placement="topLeft">
        <button
          type="button"
          className="w-full flex items-center gap-3 rounded-lg p-2 bg-transparent border-0 cursor-pointer hover:bg-white/5 text-left"
        >
          <Avatar src={restaurant?.logoUrl || undefined} className="bg-primary shrink-0">
            {restaurant?.name?.[0]}
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-medium truncate">{restaurant?.name}</div>
            <div className="text-xs text-gray-400 truncate flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-500'}`} />
              {me?.name} · {role === 'OWNER' ? 'Chủ quán' : 'Nhân viên'}
            </div>
          </div>
        </button>
      </Dropdown>
    </div>
  );
}
