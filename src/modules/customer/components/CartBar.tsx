import Link from 'next/link';
import { RightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { formatMoney } from '@/ultils/format';

interface IProps {
  href: string;
  count: number;
  total: number;
}

export default function CartBar({ href, count, total }: IProps) {
  if (!count) return null;

  return (
    <div className="sticky bottom-0 z-20 p-3 pb-safe bg-gradient-to-t from-white via-white to-white/0">
      <Link
        href={href}
        className="flex items-center gap-3 rounded-2xl bg-primary text-white px-4 py-3 shadow-lg active:opacity-90"
      >
        <span className="relative text-xl flex">
          <ShoppingCartOutlined />
          <span className="absolute -top-2 -right-3 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-xs font-bold flex items-center justify-center">
            {count}
          </span>
        </span>
        <span className="flex-1 ml-2 font-semibold">{formatMoney(total)}</span>
        <span className="font-medium flex items-center gap-1">
          Xem giỏ món <RightOutlined className="text-xs" />
        </span>
      </Link>
    </div>
  );
}
