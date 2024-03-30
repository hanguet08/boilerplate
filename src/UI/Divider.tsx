import { default as GDivider } from 'antd/lib/divider';

interface IProps {
  className?: string;
}

export default function Divider({ className = '' }: IProps) {
  return <GDivider className={className} />;
}
