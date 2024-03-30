import { ReactNode } from 'react';
import { default as GAvatar } from 'antd/lib/avatar';

interface IProps {
  src?: ReactNode;
  alt?: string;
  size?: any;
  className?: string;
}

export default function Avatar({ src, alt, size = 'default', className = '' }: IProps) {
  return <GAvatar src={src} alt={alt} size={size} className={className} />;
}
