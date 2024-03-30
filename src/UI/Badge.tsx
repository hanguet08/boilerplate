import { default as GBadge } from 'antd/lib/badge';

interface IProps {
  status?: 'success' | 'processing' | 'error' | 'default' | 'warning';
}

export default function Badge({ status }: IProps) {
  return <GBadge status={status} />;
}
