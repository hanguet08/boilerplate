import { default as GInputNumber } from 'antd/lib/input-number';
import { HTMLInputTypeAttribute, ReactNode } from 'react';

interface IProps {
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  controls?: boolean | { upIcon?: ReactNode; downIcon?: ReactNode };
  min?: number;
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
}

export default function InputNumber({
  type,
  disabled,
  placeholder,
  controls,
  min,
  value,
  onChange,
  className = '',
}: IProps) {
  return (
    <GInputNumber
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      controls={controls}
      min={min}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
