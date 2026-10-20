import { ReactNode } from 'react';
import { Button, Empty, Result, Spin } from 'antd';
import { getErrorMessage } from '@/ultils/format';

export function PageLoading({ className = 'py-20' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spin />
    </div>
  );
}

export function PageError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <Result
      status="warning"
      title="Không tải được dữ liệu"
      subTitle={getErrorMessage(error)}
      extra={onRetry && <Button onClick={onRetry}>Thử lại</Button>}
    />
  );
}

export function EmptyState({ description, children }: { description: ReactNode; children?: ReactNode }) {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} className="py-10">
      {children}
    </Empty>
  );
}
