import Link from 'next/link';
import { Button } from 'antd';
import CustomerLayout from '@/layout/customer';
import { PageLoading } from '@/components/common/PageState';
import { useCustomer } from './CustomerProvider';
import InvalidQr from './components/InvalidQr';
import RestaurantLogo from './components/RestaurantLogo';

export default function Welcome() {
  const { qrToken, menu, isLoadingMenu, menuError, refetchMenu, cart } = useCustomer();

  if (menuError) return <InvalidQr error={menuError} onRetry={refetchMenu} />;
  if (isLoadingMenu || !menu) {
    return (
      <CustomerLayout className="justify-center">
        <PageLoading />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout pageTitle={`${menu.restaurant.name} - ${menu.table.name}`}>
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-12 bg-gradient-to-b from-orange-50 via-white to-white">
        <div />
        <div className="flex flex-col items-center text-center">
          <RestaurantLogo restaurant={menu.restaurant} className="w-24 h-24 text-5xl" />
          <h1 className="text-2xl font-bold mt-6">{menu.restaurant.name}</h1>
          <div className="mt-2 inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-4 py-1 font-semibold">
            {menu.table.name}
          </div>
          {menu.restaurant.address && <p className="text-gray-500 text-sm mt-4">{menu.restaurant.address}</p>}
          <p className="text-gray-500 mt-6">Chào mừng bạn! Xem menu và gọi món ngay tại bàn.</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <Link href={`/order/${qrToken}/menu`}>
            <Button type="primary" size="large" block>
              {cart.count ? `Tiếp tục gọi món (${cart.count})` : 'Xem menu'}
            </Button>
          </Link>
          <Link href={`/order/${qrToken}/history`} className="text-center text-primary text-sm">
            Xem order của tôi
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}
