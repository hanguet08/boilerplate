import { useEffect, useState } from 'react';
import { Button, Drawer, Input } from 'antd';
import { MenuItem } from '@/interfaces';
import FoodImage from '@/components/common/FoodImage';
import QuantityStepper from '@/components/common/QuantityStepper';
import { formatMoney } from '@/ultils/format';

interface IProps {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, quantity: number, note?: string) => void;
}

/** Bottom sheet "Chi tiết món": quantity + per-item note, then add to cart. */
export default function ItemSheet({ item, onClose, onAdd }: IProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setNote('');
  }, [item]);

  return (
    <Drawer
      open={Boolean(item)}
      onClose={onClose}
      placement="bottom"
      height="auto"
      closable={false}
      bodyStyle={{ padding: 0 }}
      contentWrapperStyle={{
        maxWidth: 448,
        margin: '0 auto',
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
      }}
    >
      {item && (
        <div className="flex flex-col">
          <FoodImage src={item.imageUrl} alt={item.name} className="w-full h-56" />
          <div className="p-4 pb-safe flex flex-col gap-3">
            <div>
              <h3 className="text-xl font-bold">{item.name}</h3>
              <div className="text-primary text-lg font-semibold mt-1">{formatMoney(item.price)}</div>
              {item.description && <p className="text-gray-500 mt-2 text-sm">{item.description}</p>}
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Ghi chú cho món</div>
              <Input.TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Ít cay, không hành..."
                maxLength={255}
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </div>
            <div className="flex items-center justify-center py-1">
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
            </div>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                onAdd(item, quantity, note);
                onClose();
              }}
            >
              Thêm vào giỏ · {formatMoney(item.price * quantity)}
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
