import React from 'react';
import { Button, Result, Typography } from '@/UI';
import { useRouter } from 'next/router';

interface Props {
  error: Error;
  setError: () => void;
}

const { Paragraph } = Typography;

const FallBackUI: React.FC<Props> = ({ error, setError }) => {
  const router = useRouter();

  return (
    <Result
      status="500"
      title="Có lỗi trong quá trình thực thi."
      subTitle="Nếu lỗi tiếp tục xảy ra, vui lòng gửi tệp
      báo cáo lỗi với các chi tiết bên dưới và các bước để tái tạo sự cố."
      className="w-[80%] mx-auto"
      extra={
        <div className="flex items-center justify-center gap-4">
          {/* <Button type="primary" target={'_blank'} href={'https://ghtk.me'}>
            Report problems
          </Button> */}
          <Button
            type="primary"
            onClick={() => {
              setError();
              router.push('/');
            }}
          >
            Quay lại trang chủ
          </Button>
        </div>
      }
    >
      <Paragraph>
        <pre>{error.stack.toString()}</pre>
      </Paragraph>
    </Result>
  );
};

export default FallBackUI;
