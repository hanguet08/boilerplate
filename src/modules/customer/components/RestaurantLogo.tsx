import cx from 'classnames';
import { Restaurant } from '@/interfaces';

interface IProps {
  restaurant: Pick<Restaurant, 'name' | 'logoUrl'>;
  className?: string;
}

export default function RestaurantLogo({ restaurant, className }: IProps) {
  return (
    <div
      className={cx(
        'rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0',
        className,
      )}
    >
      {restaurant.logoUrl ? (
        <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
      ) : (
        <span aria-hidden>🍲</span>
      )}
    </div>
  );
}
