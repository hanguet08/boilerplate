import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Input, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import CustomerLayout from '@/layout/customer';
import FoodImage from '@/components/common/FoodImage';
import QuantityStepper from '@/components/common/QuantityStepper';
import { EmptyState } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { createPublicOrder } from '@/services/public.service';
import { formatMoney, getErrorMessage } from '@/ultils/format';
import { useCustomer } from './CustomerProvider';

export default function Cart() {
  const router = useRouter();
  const { qrToken, menu, refetchMenu, cart, saveOrderCode } = useCustomer();
  const [note, setNote] = useState('');

  // Items that turned "Hết món" since they were added
  const unavailableIds = useMemo(() => {
    const ids = new Set<number>();
    menu?.categories.forEach((c) => c.items.forEach((i) => !i.isAvailable && ids.add(i.id)));
    return ids;
  }, [menu]);

  const submit = useMutation(
    () =>
      createPublicOrder(qrToken, {
        items: cart.lines.map((line) => ({
          menuItemId: line.menuItemId,
          quantity: line.quantity,
          ...(line.note ? { note: line.note } : {}),
        })),
        ...(note.trim() ? { note: note.trim() } : {}),
      }),
    {
      onSuccess: (order) => {
        saveOrderCode(order.orderCode);
        cart.clear();
        router.replace(`/order/${qrToken}/success?code=${order.orderCode}`);
      },
      onError: (error: any) => {
        const ids: number[] = error?.data?.unavailableItemIds ?? [];
        if (ids.length) {
          const names = cart.lines.filter((l) => ids.includes(l.menuItemId)).map((l) => l.name);
          cart.removeItems(ids);
          refetchMenu();
          showMessage.warn(
            `Đã bỏ món hết/không còn bán khỏi giỏ: ${names.join(', ')}. Vui lòng kiểm tra lại.`,
          );
          return;
        }
        showMessage.error(
          error?.status === 429 ? 'Bạn gửi quá nhanh, vui lòng đợi một chút' : getErrorMessage(error),
        );
      },
    },
  );

  const hasUnavailable = cart.lines.some((line) => unavailableIds.has(line.menuItemId));

  return (
    <CustomerLayout
      pageTitle="Giỏ món"
      title={
        <span>
          Giỏ món {menu && <span className="text-gray-500 font-normal text-sm">({menu.table.name})</span>}
        </span>
      }
      backHref={`/order/${qrToken}/menu`}
      extra={
        cart.lines.length > 0 && (
          <Popconfirm
            title="Xoá tất cả món trong giỏ?"
            onConfirm={cart.clear}
            okText="Xoá"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xoá tất cả
            </Button>
          </Popconfirm>
        )
      }
      footer={
        cart.hydrated &&
        cart.lines.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng cộng ({cart.count} món)</span>
              <span className="text-xl font-bold">{formatMoney(cart.total)}</span>
            </div>
            <Button
              type="primary"
              size="large"
              block
              danger
              loading={submit.isLoading}
              disabled={hasUnavailable}
              onClick={() => submit.mutate()}
            >
              Gửi order
            </Button>
          </div>
        )
      }
    >
      {cart.hydrated && cart.lines.length === 0 ? (
        <EmptyState description="Giỏ món đang trống">
          <Link href={`/order/${qrToken}/menu`}>
            <Button type="primary">Xem menu</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="p-4 flex flex-col gap-1">
          {cart.lines.map((line) => {
            const soldOut = unavailableIds.has(line.menuItemId);
            return (
              <div key={line.key} className="flex gap-3 py-3 border-0 border-b border-solid border-gray-100">
                <FoodImage
                  src={line.imageUrl}
                  alt={line.name}
                  dimmed={soldOut}
                  className="w-16 h-16 rounded-xl"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{line.name}</span>
                    <span className="font-semibold whitespace-nowrap">
                      {formatMoney(line.price * line.quantity)}
                    </span>
                  </div>
                  {soldOut ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-rose-500">Món này vừa hết, vui lòng bỏ khỏi giỏ</span>
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => cart.setQuantity(line.key, 0)}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-gray-500">{formatMoney(line.price)}</span>
                      <Input
                        size="small"
                        bordered={false}
                        placeholder="Ghi chú (tuỳ chọn)"
                        value={line.note ?? ''}
                        maxLength={255}
                        onChange={(e) => cart.setNote(line.key, e.target.value)}
                        className="text-xs bg-gray-50 px-2"
                      />
                      <div className="flex justify-end mt-1">
                        <QuantityStepper
                          size="small"
                          value={line.quantity}
                          onChange={(value) => cart.setQuantity(line.key, value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {cart.lines.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-2">Ghi chú cho quán</div>
              <Input.TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho quán (nếu có)..."
                maxLength={500}
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </div>
          )}
        </div>
      )}
    </CustomerLayout>
  );
}
