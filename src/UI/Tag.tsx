import { ReactNode, MouseEvent, MouseEventHandler } from 'react';
import { default as GTag } from 'antd/lib/tag';

interface IProps {
  color?: string;
  closable?: boolean;
  onClose?: (e: MouseEvent<HTMLElement>) => void;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  children?: ReactNode;
  className?: string;
}

export default function Tag({ closable, color, onClose, onClick, children, className = '' }: IProps) {
  return (
    <GTag className={className} closable={closable} color={color} onClose={onClose} onClick={onClick}>
      {children}
    </GTag>
  );
}

Tag.CheckableTag = GTag.CheckableTag;
