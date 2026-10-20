import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import cx from 'classnames';

interface IProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'small' | 'middle';
}

export default function QuantityStepper({ value, onChange, min = 0, max = 99, size = 'middle' }: IProps) {
  const btn = cx(
    'flex items-center justify-center rounded-full border border-solid border-gray-300 bg-white cursor-pointer',
    'disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-100',
    size === 'small' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm',
  );

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label="Giảm"
        className={btn}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusOutlined />
      </button>
      <span
        className={cx('min-w-[20px] text-center font-semibold', size === 'small' ? 'text-sm' : 'text-base')}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Tăng"
        className={btn}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusOutlined />
      </button>
    </div>
  );
}
