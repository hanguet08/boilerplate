import { Modal as GModal } from '@/UI';
import { ReactNode } from 'react';
import { CloseIcon } from '@/components/icons/common';
import classNames from 'classnames';

interface IProps {
  children: ReactNode;
  visible?: boolean;
  width?: string;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  footer?: ReactNode;
  centered?: boolean;
  className?: string;
}

export default function Modal({
  children,
  title = 'Modal',
  visible,
  width,
  footer,
  onCancel,
  onOk,
  centered,
  className,
}: IProps) {
  const modalTitle = (
    <div className="relative text-white flex items-center justify-center">
      <CloseIcon className="absolute right-0 text-[18px] cursor-pointer" onClick={onCancel} />
      <p className="m-0 text-[18px] text-center">{title}</p>
    </div>
  );

  return (
    <GModal
      width={width}
      className={classNames('custom-modal', className)}
      // className="custom-modal"
      open={visible}
      footer={footer}
      title={modalTitle}
      closable={false}
      onCancel={onCancel}
      onOk={onOk}
      centered={centered}
    >
      {children}
    </GModal>
  );
}
