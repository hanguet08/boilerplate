import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import MenuIcon from '@/components/MenuIcon';
import { useAuth } from '@/configs/Auth/client';
import { hasPermission } from '@/ultils/function';

const NAV_ITEMS = [
  {
    name: 'Quản lý công việc',
    path: '/qlcv',
  },
  {
    name: 'Quản lý công việc2',
    path: '/home',
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const { userInfo } = useAuth();

  const [navItems, setNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    setNavItems((item) => item.filter((navItem) => hasPermission(navItem.path, userInfo)));
  }, [userInfo]);

  useEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (router.pathname.includes(item.path)) setActiveKey([item.path]);
    });
  }, [router.pathname]);

  return (
    <div
      className={cx(
        // eslint-disable-next-line max-len
        'w-[350px] shrink-0 h-screen max-h-full overflow-hidden transition-all sticky top-0 nav border-0 border-l border-solid border-gray-300',
        {
          'w-[44px]': collapsed,
        },
      )}
    >
      <div className="flex gap-3 items-center px-3 py-3 flex-shrink-0">
        <MenuIcon
          className="text-2xl hover:text-grey-300 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        />
        {!collapsed && <h4 className="text-xl font-medium mb-0">Công việc</h4>}
      </div>
      <div className="border-0 border-t border-solid border-gray-200">
        {!collapsed &&
          navItems.map((navItem) => {
            const isActiveItem = activeKey.includes(navItem.path);
            const navActive = isActiveItem ? 'bg-active-nav' : '';

            return (
              <Link href={navItem.path} key={navItem?.path}>
                <div className={`flex cursor-pointer nav-item p-3 whitespace-nowrap ${navActive}`}>
                  <p className="m-0">{navItem?.name}</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
