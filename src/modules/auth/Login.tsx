import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from '@/components/messages/GMessage';
import { login } from '@/services/auth.service';
import { useAuth } from '@/providers/AuthProvider';
import { getErrorMessage } from '@/ultils/format';
import AuthCard from './AuthCard';
import useAfterLogin from './useAfterLogin';

export default function Login() {
  const router = useRouter();
  const { ready, token } = useAuth();
  const afterLogin = useAfterLogin();

  // Already signed in → go to the app
  useEffect(() => {
    if (ready && token) router.replace('/tables');
  }, [ready]);

  const mutation = useMutation(login, {
    onSuccess: afterLogin,
    onError: (error: any) =>
      showMessage.error(
        error?.status === 401
          ? 'Sai email/mật khẩu hoặc tài khoản đã bị khoá'
          : error?.status === 429
          ? 'Bạn thử quá nhiều lần, vui lòng đợi 1 phút'
          : getErrorMessage(error),
      ),
  });

  return (
    <AuthCard title="Đăng nhập">
      <Form layout="vertical" requiredMark={false} onFinish={mutation.mutate} autoComplete="on">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="quan@email.com"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={mutation.isLoading}
          className="mt-2"
        >
          Đăng nhập
        </Button>
      </Form>
      <div className="text-center text-sm text-gray-500 mt-6">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-primary font-medium">
          Đăng ký quán mới
        </Link>
      </div>
    </AuthCard>
  );
}
