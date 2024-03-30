import { ReactNode } from 'react';
import { default as GPopconfirm } from 'antd/lib/popconfirm';
import { TooltipPlacement } from 'antd/es/tooltip';

interface IProps {
  showCancel?: boolean;
  title?: ReactNode;
  placement?: TooltipPlacement;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function Popconfirm({
  showCancel,
  title,
  placement = 'top',
  okText,
  cancelText,
  onConfirm,
  className = '',
  children,
}: IProps) {
  return (
    <GPopconfirm
      showCancel={showCancel}
      title={title}
      placement={placement}
      okText={okText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      className={className}
    >
      {children}
    </GPopconfirm>
  );
}
