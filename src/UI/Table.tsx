import { default as GTable } from 'antd/lib/table';
import { ColumnsType } from 'antd/es/table';
import { GetRowKey } from './lib/table/interface';

interface IProps {
  rowKey?: string | GetRowKey<any>;
  bordered?: boolean;
  columns?: ColumnsType<any>;
  dataSource?: readonly any[];
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  };
  loading?: boolean;
  className?: string;
}

export default function Table({
  rowKey,
  bordered,
  columns,
  dataSource,
  scroll,
  loading,
  className = '',
}: IProps) {
  return (
    <GTable
      className={className}
      rowKey={rowKey}
      pagination={false}
      bordered={bordered}
      columns={columns}
      dataSource={dataSource}
      scroll={scroll}
      loading={loading}
    />
  );
}
