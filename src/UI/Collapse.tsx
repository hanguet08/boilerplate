import { ReactNode } from 'react';
import { default as GCollapse } from 'antd/lib/collapse';
import { ExpandIconPosition } from 'antd/lib/collapse/Collapse';

interface IProps {
  activeKey?: string | number | (string | number)[];
  expandIconPosition?: ExpandIconPosition;
  onChange?: (key: string | string[]) => void;
  children?: ReactNode;
  className?: string;
}

export default function Collapse({
  activeKey,
  expandIconPosition,
  onChange,
  children,
  className = '',
}: IProps) {
  return (
    <GCollapse
      className={className}
      activeKey={activeKey}
      expandIconPosition={expandIconPosition}
      onChange={onChange}
    >
      {children}
    </GCollapse>
  );
}

Collapse.Panel = GCollapse.Panel;
