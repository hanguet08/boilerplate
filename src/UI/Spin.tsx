import { ReactNode } from 'react';
import { default as GSpin } from 'antd/lib/spin';

interface IProps {
  spinning?: boolean;
  size?: 'small' | 'default' | 'large';
  children?: ReactNode;
}

export default function Spin({ spinning, size = 'default', children }: IProps) {
  return (
    <GSpin spinning={spinning} size={size}>
      {children}
    </GSpin>
  );
}
