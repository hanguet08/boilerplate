import { ReactNode } from 'react';
import {
  AppstoreOutlined,
  DashboardOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  QrcodeOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
  ownerOnly?: boolean;
  badge?: 'pending';
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Tổng quan', path: '/dashboard', icon: <DashboardOutlined />, ownerOnly: true },
  { key: 'tables', label: 'Sơ đồ bàn', path: '/tables', icon: <AppstoreOutlined /> },
  { key: 'orders', label: 'Order', path: '/orders', icon: <FileTextOutlined />, badge: 'pending' },
  { key: 'menu', label: 'Menu', path: '/menu', icon: <ReadOutlined /> },
  {
    key: 'manage-tables',
    label: 'Quản lý bàn & QR',
    path: '/manage/tables',
    icon: <QrcodeOutlined />,
    ownerOnly: true,
  },
  { key: 'staff', label: 'Nhân viên', path: '/staff', icon: <TeamOutlined />, ownerOnly: true },
  { key: 'settings', label: 'Cài đặt', path: '/settings', icon: <SettingOutlined /> },
];

export const BOTTOM_TABS: NavItem[] = [
  { key: 'tables', label: 'Bàn', path: '/tables', icon: <AppstoreOutlined /> },
  { key: 'orders', label: 'Order', path: '/orders', icon: <FileTextOutlined />, badge: 'pending' },
  { key: 'menu', label: 'Menu', path: '/menu', icon: <ReadOutlined /> },
  { key: 'more', label: 'Thêm', path: '/more', icon: <EllipsisOutlined /> },
];

// Pages only reachable from "Thêm" on mobile keep that tab highlighted
const MORE_PATHS = ['/more', '/dashboard', '/manage', '/staff', '/settings'];

export const isNavActive = (item: NavItem, pathname: string) => {
  if (item.key === 'more') return MORE_PATHS.some((p) => pathname.startsWith(p));
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
};
