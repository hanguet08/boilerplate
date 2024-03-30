import { ReactNode } from 'react';
import { default as GTimeline } from 'antd/lib/timeline';

interface IProps {
  children: ReactNode;
}

export default function Timeline({ children }: IProps) {
  return <GTimeline>{children}</GTimeline>;
}

Timeline.Item = GTimeline.Item;
