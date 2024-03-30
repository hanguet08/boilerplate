import { ReactNode } from 'react';
import { default as GResult } from 'antd/lib/result';
import { ResultStatusType } from 'antd/es/result';

interface IProps {
  status?: ResultStatusType;
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function Result({ status, title, subTitle, extra, className = '', children }: IProps) {
  return (
    <GResult status={status} title={title} subTitle={subTitle} extra={extra}>
      {children}
    </GResult>
  );
}
