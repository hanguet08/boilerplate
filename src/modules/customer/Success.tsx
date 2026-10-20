import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import CustomerLayout from '@/layout/customer';
import { CUSTOMER_ORDER_STATUS } from '@/constants/order';
import { getPublicOrder } from '@/services/public.service';
import { formatMoney } from '@/ultils/format';
import { publicOrdersKey, useCustomer } from './CustomerProvider';
import useCustomerSocket from './useCustomerSocket';

export default function Success() {
  const router = useRouter();
  const { qrToken } = useCustomer();
  const code = typeof router.query.code === 'string' ? router.query.code : '';

  const { data: order } = useQuery([...publicOrdersKey(qrToken), code], () => getPublicOrder(qrToken, code), {
    enabled: Boolean(qrToken && code),
  });
  useCustomerSocket(qrToken);

  const confirmed = order && order.status !== 'PENDING';

  return (
    <CustomerLayout pageTitle="Đã gửi order">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
        <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-5xl shadow-lg shadow-emerald-200">
          <CheckOutlined />
        </div>
        <h1 className="text-2xl font-bold mt-6">Đã gửi order!</h1>
        <p className="text-gray-500 mt-2">
          Nhà hàng sẽ phục vụ sớm.
          <br />
          Cảm ơn bạn!
        </p>

        {order && (
          <div className="w-full mt-6 rounded-xl bg-gray-50 p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã order</span>
              <span className="font-mono font-semibold">{order.orderCode}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Tổng tiền</span>
              <span className="font-semibold">{formatMoney(order.total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-500">Trạng thái</span>
              <span className={confirmed ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {!confirmed && (
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
                )}
                {CUSTOMER_ORDER_STATUS[order.status]}
              </span>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-3 mt-8">
          <Link href={`/order/${qrToken}/menu`}>
            <Button size="large" block className="bg-primary-lightest text-primary border-0">
              Gọi thêm món
            </Button>
          </Link>
          <Link href={`/order/${qrToken}/history`} className="text-primary underline">
            Xem order của tôi
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}
