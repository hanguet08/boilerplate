import { PlusOutlined } from '@ant-design/icons';
import { MenuItem } from '@/interfaces';
import FoodImage from '@/components/common/FoodImage';
import { formatMoney } from '@/ultils/format';

interface IProps {
  item: MenuItem;
  quantityInCart: number;
  onOpen: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export default function MenuItemRow({ item, quantityInCart, onOpen, onQuickAdd }: IProps) {
  const soldOut = !item.isAvailable;

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex gap-3 py-3 cursor-pointer"
      onClick={() => !soldOut && onOpen(item)}
      onKeyDown={(e) => e.key === 'Enter' && !soldOut && onOpen(item)}
    >
      <FoodImage src={item.imageUrl} alt={item.name} dimmed={soldOut} className="w-20 h-20 rounded-xl" />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className={soldOut ? 'text-gray-400 font-medium' : 'font-medium'}>{item.name}</div>
        {item.description && (
          <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</div>
        )}
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className={soldOut ? 'text-gray-400' : 'font-semibold'}>{formatMoney(item.price)}</span>
          {soldOut ? (
            <span className="text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1">Hết món</span>
          ) : (
            <button
              type="button"
              aria-label={`Thêm ${item.name}`}
              className="relative w-8 h-8 rounded-lg bg-primary text-white border-0 flex items-center justify-center cursor-pointer active:opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(item);
              }}
            >
              <PlusOutlined />
              {quantityInCart > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[11px] font-bold flex items-center justify-center">
                  {quantityInCart}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
