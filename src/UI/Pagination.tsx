import { ReactNode } from 'react';
import { default as GPagination } from 'antd/lib/pagination';

interface IProps {
  hideOnSinglePage?: boolean;
  current?: number;
  pageSize?: number;
  total?: number;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: ReactNode,
  ) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
  className?: string;
}

export default function Pagination({
  hideOnSinglePage,
  current,
  pageSize = 10,
  total = 0,
  itemRender,
  onChange,
  className = '',
}: IProps) {
  return (
    <GPagination
      showSizeChanger={false}
      hideOnSinglePage={hideOnSinglePage}
      current={current}
      pageSize={pageSize}
      total={total}
      itemRender={itemRender}
      onChange={onChange}
      className={className}
    />
  );
}
