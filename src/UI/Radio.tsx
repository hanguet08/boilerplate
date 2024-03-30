import { ReactNode } from 'react';
import { default as GRadio, RadioChangeEvent } from 'antd/lib/radio';

interface IProps {
  value?: any;
  onChange?: (e: RadioChangeEvent) => void;
  className?: string;
  children?: ReactNode;
}

export default function Radio({ value, onChange, className = '', children }: IProps) {
  return (
    <GRadio value={value} onChange={onChange} className={className}>
      {children}
    </GRadio>
  );
}

Radio.Group = GRadio.Group;
Radio.Button = GRadio.Button;
