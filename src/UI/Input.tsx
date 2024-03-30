import { ChangeEvent, FocusEventHandler, KeyboardEventHandler, Ref } from 'react';
import { default as GInput, InputRef } from 'antd/lib/input';
import { SizeType } from './lib/config-provider/SizeContext';

interface IProps {
  ref?: Ref<InputRef>;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: SizeType;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
  className?: string;
}

export default function Input({
  ref,
  allowClear,
  disabled,
  placeholder,
  size,
  value,
  onChange,
  onBlur,
  onPressEnter,
  className = '',
}: IProps) {
  return (
    <GInput
      ref={ref}
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder}
      size={size}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onPressEnter={onPressEnter}
      className={className}
    />
  );
}
