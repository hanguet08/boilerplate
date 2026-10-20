import { Button, Result } from 'antd';
import CustomerLayout from '@/layout/customer';
import { getErrorMessage } from '@/ultils/format';

export default function InvalidQr({ error, onRetry }: { error: any; onRetry: () => void }) {
  const isNotFound = error?.status === 404;

  return (
    <CustomerLayout pageTitle="QOrder" className="justify-center">
      <Result
        status={isNotFound ? '404' : 'warning'}
        title={isNotFound ? 'QR không hợp lệ' : 'Không tải được menu'}
        subTitle={
          isNotFound
            ? 'Mã QR này đã hết hiệu lực hoặc bàn đang tạm ngưng. Vui lòng gọi nhân viên để được hỗ trợ.'
            : getErrorMessage(error)
        }
        extra={!isNotFound && <Button onClick={onRetry}>Thử lại</Button>}
      />
    </CustomerLayout>
  );
}
