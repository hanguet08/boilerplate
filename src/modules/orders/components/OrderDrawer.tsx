import { Drawer, Grid } from 'antd';
import OrderDetail from './OrderDetail';

interface IProps {
  orderId: number | null;
  onClose: () => void;
}

export default function OrderDrawer({ orderId, onClose }: IProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Drawer
      open={Boolean(orderId)}
      onClose={onClose}
      title="Chi tiết order"
      placement={isMobile ? 'bottom' : 'right'}
      height={isMobile ? '85vh' : undefined}
      width={isMobile ? undefined : 480}
      destroyOnClose
      contentWrapperStyle={isMobile ? { borderRadius: '16px 16px 0 0', overflow: 'hidden' } : undefined}
    >
      {orderId && <OrderDetail orderId={orderId} />}
    </Drawer>
  );
}
