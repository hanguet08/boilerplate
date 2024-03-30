import { default as GButton } from 'antd/lib/button';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ReactNode } from 'react';

interface IProps {
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  size?: SizeType;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
  icon?: ReactNode;
  href?: string;
  target?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  value?: string | number | readonly string[];
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function Button({
  block,
  danger,
  disabled,
  size = 'middle',
  type = 'default',
  icon,
  href,
  target,
  htmlType,
  value,
  onClick,
  className = '',
  children,
}: IProps) {
  return (
    <GButton
      block={block}
      danger={danger}
      disabled={disabled}
      size={size}
      type={type}
      icon={icon}
      href={href}
      target={target}
      htmlType={htmlType}
      value={value}
      onClick={onClick}
      className={className}
    >
      {children}
    </GButton>
  );
}
