import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/layout/app';
import OrderDetail from '@/modules/orders/components/OrderDetail';
import { useAuth } from '@/providers/AuthProvider';

// Target of Web Push notification clicks: /orders/:orderId?rid=:restaurantId
export default function OrderDetailPage() {
  const router = useRouter();
  const { memberships, restaurantId, selectRestaurant } = useAuth();
  const orderId = Number(router.query.orderId);
  const rid = Number(router.query.rid);

  useEffect(() => {
    if (rid && rid !== restaurantId && memberships.some((m) => m.restaurantId === rid)) selectRestaurant(rid);
  }, [rid, memberships]);

  return (
    <AppLayout title="Chi tiết order" backHref="/orders" hideTabBar>
      <div className="max-w-xl mx-auto bg-white rounded-xl border border-solid border-gray-100 p-4">
        {orderId > 0 && (!rid || rid === restaurantId) && <OrderDetail orderId={orderId} />}
      </div>
    </AppLayout>
  );
}
