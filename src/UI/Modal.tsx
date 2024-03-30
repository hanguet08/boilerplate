import { ReactNode, MouseEvent } from 'react';
import { default as GModal } from 'antd/lib/modal';

interface IProps {
  open?: boolean;
  width?: string | number;
  closable?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
  title?: ReactNode;
  footer?: ReactNode;
  onOk?: (e: MouseEvent<HTMLElement>) => void;
  onCancel?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  children?: ReactNode;
}

export default function Modal({
  open,
  width,
  closable,
  centered,
  destroyOnClose,
  title,
  footer,
  onOk,
  onCancel,
  className = '',
  children,
}: IProps) {
  return (
    <GModal
      closable={closable}
      destroyOnClose={destroyOnClose}
      open={open}
      width={width}
      centered={centered}
      title={title}
      footer={footer}
      onOk={onOk}
      onCancel={onCancel}
      className={className}
    >
      {children}
    </GModal>
  );
}
