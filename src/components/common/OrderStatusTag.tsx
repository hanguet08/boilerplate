import { Tag } from 'antd';
import { ORDER_STATUS } from '@/constants/order';
import { OrderStatus } from '@/interfaces';

export default function OrderStatusTag({ status }: { status: OrderStatus }) {
  const { label, tagColor } = ORDER_STATUS[status];
  return <Tag color={tagColor}>{label}</Tag>;
}
