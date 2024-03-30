import { ReactNode } from 'react';
import { default as GCheckbox, CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IProps {
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  className?: string;
  children?: ReactNode;
}

export default function Checkbox({ value, checked, disabled, onChange, className = '', children }: IProps) {
  return (
    <GCheckbox value={value} checked={checked} disabled={disabled} onChange={onChange} className={className}>
      {children}
    </GCheckbox>
  );
}

Checkbox.Group = GCheckbox.Group;
