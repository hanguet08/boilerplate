import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Segmented } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';
import AppLayout from '@/layout/app';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { TABLE_STATE } from '@/constants/order';
import { TableBoardState, TableOverview } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { getTablesOverview } from '@/services/table.service';
import { formatMoney, formatTime } from '@/ultils/format';

const STATE_ICON: Record<TableBoardState, JSX.Element> = {
  EMPTY: <CheckCircleFilled className="text-emerald-500" />,
  SERVING: <ClockCircleFilled className="text-amber-500" />,
  NEW_ORDER: <ExclamationCircleFilled className="text-rose-500" />,
};

type Filter = 'ALL' | TableBoardState;
type View = 'grid' | 'list';

function TableTile({ table }: { table: TableOverview }) {
  const state = TABLE_STATE[table.state];
  return (
    <Link
      href={`/tables/${table.id}`}
      className={cx(
        'relative rounded-xl border border-solid p-3 flex flex-col items-center justify-center text-center gap-1 aspect-square sm:aspect-auto sm:h-32 transition-transform active:scale-95',
        state.className,
      )}
    >
      {table.pendingCount > 0 && <Badge count={table.pendingCount} className="!absolute top-2 right-2" />}
      <span className="text-2xl flex">{STATE_ICON[table.state]}</span>
      <span className="font-semibold text-gray-900">{table.name}</span>
      <span className="text-xs text-gray-500">{state.label}</span>
      {table.activeTotal > 0 && (
        <span className="text-xs font-medium text-gray-700">{formatMoney(table.activeTotal)}</span>
      )}
    </Link>
  );
}

function TableRow({ table }: { table: TableOverview }) {
  const state = TABLE_STATE[table.state];
  return (
    <Link
      href={`/tables/${table.id}`}
      className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-3"
    >
      <span className="text-xl flex">{STATE_ICON[table.state]}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{table.name}</div>
        <div className="text-xs text-gray-500">
          {state.label}
          {table.lastOrderAt && ` · order lúc ${formatTime(table.lastOrderAt)}`}
        </div>
      </div>
      {table.pendingCount > 0 && <Badge count={`${table.pendingCount} mới`} />}
      <span className="font-medium w-24 text-right">
        {table.activeTotal > 0 ? formatMoney(table.activeTotal) : '–'}
      </span>
    </Link>
  );
}

export default function TableBoard() {
  const { restaurantId, isOwner } = useAuth();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [view, setView] = useState<View>('grid');

  const { data, isLoading, error, refetch } = useQuery(
    ['tables', restaurantId, 'overview'],
    () => getTablesOverview(restaurantId as number),
    { enabled: Boolean(restaurantId), refetchInterval: 60 * 1000 },
  );

  const tables = (data ?? []).filter((t) => t.status === 'ACTIVE');
  const counts = tables.reduce<Record<TableBoardState, number>>(
    (acc, t) => ({ ...acc, [t.state]: acc[t.state] + 1 }),
    { EMPTY: 0, SERVING: 0, NEW_ORDER: 0 },
  );
  const visible = filter === 'ALL' ? tables : tables.filter((t) => t.state === filter);

  return (
    <AppLayout
      title="Sơ đồ bàn"
      extra={
        <Segmented
          size="small"
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { value: 'grid', label: 'Sơ đồ' },
            { value: 'list', label: 'Danh sách' },
          ]}
        />
      }
    >
      {isLoading && <PageLoading />}
      {error && <PageError error={error} onRetry={refetch} />}
      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(
              [
                ['ALL', `Tất cả (${tables.length})`],
                ['NEW_ORDER', `Có order mới (${counts.NEW_ORDER})`],
                ['SERVING', `Đang phục vụ (${counts.SERVING})`],
                ['EMPTY', `Trống (${counts.EMPTY})`],
              ] as [Filter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cx(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm border border-solid cursor-pointer',
                  filter === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tables.length === 0 ? (
            <EmptyState description="Quán chưa có bàn nào">
              {isOwner && (
                <Link href="/manage/tables">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Thêm bàn
                  </Button>
                </Link>
              )}
            </EmptyState>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
              {visible.map((table) => (
                <TableTile key={table.id} table={table} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {visible.map((table) => (
                <TableRow key={table.id} table={table} />
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
