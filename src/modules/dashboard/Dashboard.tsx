import { useMemo } from 'react';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import cx from 'classnames';
import AppLayout from '@/layout/app';
import OrderStatusTag from '@/components/common/OrderStatusTag';
import { PageError, PageLoading } from '@/components/common/PageState';
import { Order } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { getAllOrders } from '@/services/order.service';
import { getTablesOverview } from '@/services/table.service';
import { formatMoney, formatTime, summarizeItems } from '@/ultils/format';

const OPEN_HOUR = 6;
const CLOSE_HOUR = 23;

const dayRange = (offset: number) => {
  const start = dayjs().add(offset, 'day').startOf('day');
  return { from: start.toISOString(), to: start.add(1, 'day').toISOString() };
};

// Cancelled orders don't count toward revenue
const billable = (orders: Order[]) => orders.filter((o) => o.status !== 'CANCELLED');
const sumTotal = (orders: Order[]) => billable(orders).reduce((sum, o) => sum + o.total, 0);

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return <span className="text-xs text-gray-400">Hôm qua: 0</span>;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span
      className={cx('text-xs font-medium flex items-center gap-1', up ? 'text-emerald-600' : 'text-rose-600')}
    >
      {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      {Math.abs(pct)}% so với hôm qua
    </span>
  );
}

function StatTile({
  label,
  value,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-solid border-gray-100 p-4 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-2xl font-bold truncate">{value}</span>
      {footer}
    </div>
  );
}

function RevenueByHour({ orders }: { orders: Order[] }) {
  const buckets = useMemo(() => {
    const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => ({
      hour: OPEN_HOUR + i,
      total: 0,
      count: 0,
    }));
    billable(orders).forEach((o) => {
      const h = dayjs(o.createdAt).hour();
      const bucket = hours.find((b) => b.hour === h) ?? (h < OPEN_HOUR ? hours[0] : hours[hours.length - 1]);
      bucket.total += o.total;
      bucket.count += 1;
    });
    return hours;
  }, [orders]);

  const max = Math.max(...buckets.map((b) => b.total), 1);

  return (
    <div className="bg-white rounded-xl border border-solid border-gray-100 p-4">
      <div className="font-semibold">Doanh thu theo giờ</div>
      <div className="text-xs text-gray-500 mb-4">Hôm nay, không tính order đã huỷ</div>
      <div
        className="flex items-end gap-[2px] h-48 border-0 border-b border-solid border-gray-200"
        role="img"
        aria-label="Doanh thu theo giờ hôm nay"
      >
        {buckets.map((b) => (
          <Tooltip
            key={b.hour}
            title={
              <div>
                <div className="font-medium">
                  {b.hour}:00 – {b.hour + 1}:00
                </div>
                <div>{formatMoney(b.total)}</div>
                <div className="text-xs opacity-80">{b.count} order</div>
              </div>
            }
          >
            {/* Full-height hit target; the visible bar sits at the bottom */}
            <div className="flex-1 h-full flex items-end cursor-default group">
              <div
                className="w-full max-w-[18px] mx-auto bg-primary rounded-t group-hover:bg-primary-dark transition-colors"
                style={{ height: b.total ? `${Math.max((b.total / max) * 100, 2)}%` : 0 }}
              />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-[2px] mt-1">
        {buckets.map((b) => (
          <span key={b.hour} className="flex-1 text-center text-[10px] text-gray-400">
            {b.hour % 2 === 0 ? `${b.hour}h` : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { restaurantId } = useAuth();

  const today = useQuery(
    ['orders', restaurantId, 'dashboard', 'today'],
    () => getAllOrders(restaurantId as number, dayRange(0)),
    { enabled: Boolean(restaurantId) },
  );
  const yesterday = useQuery(
    ['orders', restaurantId, 'dashboard', 'yesterday'],
    () => getAllOrders(restaurantId as number, dayRange(-1)),
    { enabled: Boolean(restaurantId), staleTime: 10 * 60 * 1000 },
  );
  const tables = useQuery(
    ['tables', restaurantId, 'overview'],
    () => getTablesOverview(restaurantId as number),
    {
      enabled: Boolean(restaurantId),
    },
  );

  const stats = useMemo(() => {
    const orders = today.data ?? [];
    const prev = yesterday.data ?? [];
    const itemCount = new Map<string, number>();
    billable(orders).forEach((o) =>
      (o.items ?? []).forEach((i) =>
        itemCount.set(i.itemName, (itemCount.get(i.itemName) ?? 0) + i.quantity),
      ),
    );
    const topItems = Array.from(itemCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const activeTables = (tables.data ?? []).filter((t) => t.status === 'ACTIVE');

    return {
      revenue: sumTotal(orders),
      prevRevenue: sumTotal(prev),
      orderCount: billable(orders).length,
      prevOrderCount: billable(prev).length,
      busyTables: activeTables.filter((t) => t.state !== 'EMPTY').length,
      totalTables: activeTables.length,
      topItems,
    };
  }, [today.data, yesterday.data, tables.data]);

  return (
    <AppLayout
      title="Tổng quan"
      ownerOnly
      extra={
        <span className="text-sm text-gray-500 hidden sm:inline">{dayjs().format('dddd, DD/MM/YYYY')}</span>
      }
    >
      {today.isLoading && <PageLoading />}
      {today.error && <PageError error={today.error} onRetry={today.refetch} />}
      {today.data && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile
              label="Doanh thu hôm nay"
              value={formatMoney(stats.revenue)}
              footer={<Delta current={stats.revenue} previous={stats.prevRevenue} />}
            />
            <StatTile
              label="Tổng order"
              value={stats.orderCount}
              footer={<Delta current={stats.orderCount} previous={stats.prevOrderCount} />}
            />
            <StatTile
              label="Bàn đang phục vụ"
              value={`${stats.busyTables} / ${stats.totalTables}`}
              footer={
                <Link href="/tables" className="text-xs text-primary">
                  Xem sơ đồ bàn
                </Link>
              }
            />
            <StatTile
              label="Món bán chạy"
              value={stats.topItems[0]?.[0] ?? '–'}
              footer={
                stats.topItems[0] && (
                  <span className="text-xs text-gray-500">{stats.topItems[0][1]} lượt</span>
                )
              }
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RevenueByHour orders={today.data} />
            </div>
            <div className="bg-white rounded-xl border border-solid border-gray-100 p-4">
              <div className="font-semibold mb-3">Top món hôm nay</div>
              {stats.topItems.length === 0 ? (
                <div className="text-sm text-gray-400">Chưa có dữ liệu</div>
              ) : (
                <ol className="m-0 p-0 list-none flex flex-col gap-3">
                  {stats.topItems.map(([name, qty], index) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1 truncate">{name}</span>
                      <span className="text-sm text-gray-500">{qty} phần</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-solid border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Order gần đây</span>
              <Link href="/orders?tab=history" className="text-sm text-primary">
                Xem tất cả
              </Link>
            </div>
            {today.data.length === 0 ? (
              <div className="text-sm text-gray-400">Hôm nay chưa có order</div>
            ) : (
              <div className="divide-y divide-x-0 divide-solid divide-gray-100">
                {today.data.slice(0, 8).map((o) => (
                  <div key={o.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="text-gray-500 w-12">{formatTime(o.createdAt)}</span>
                    <span className="font-medium w-20 truncate">{o.table?.name}</span>
                    <span className="flex-1 truncate text-gray-600 hidden sm:block">
                      {summarizeItems(o.items)}
                    </span>
                    <span className="font-medium w-24 text-right">{formatMoney(o.total)}</span>
                    <OrderStatusTag status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
