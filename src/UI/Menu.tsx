import { default as GMenu } from 'antd/lib/menu';
import { MenuMode } from 'rc-menu/lib/interface';
import { ItemType } from './lib/menu/hooks/useItems';

interface IProps {
  mode?: MenuMode;
  items?: ItemType[];
  defaultOpenKeys?: string[];
  className?: string;
}

export default function Menu({ mode, items, defaultOpenKeys, className = '' }: IProps) {
  return <GMenu className={className} mode={mode} items={items} defaultOpenKeys={defaultOpenKeys} />;
}
