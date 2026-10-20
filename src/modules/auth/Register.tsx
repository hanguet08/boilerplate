import Link from 'next/link';
import { Button, Form, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from '@/components/messages/GMessage';
import { register } from '@/services/auth.service';
import { getErrorMessage } from '@/ultils/format';
import AuthCard from './AuthCard';
import useAfterLogin from './useAfterLogin';

export default function Register() {
  const afterLogin = useAfterLogin();

  const mutation = useMutation(register, {
    onSuccess: afterLogin,
    onError: (error: any) =>
      showMessage.error(error?.status === 409 ? 'Email này đã được đăng ký' : getErrorMessage(error)),
  });

  return (
    <AuthCard title="Tạo tài khoản" subtitle="Sau khi đăng ký, bạn có thể tạo quán và mời nhân viên.">
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={({ name, email, password }) => mutation.mutate({ name, email, password })}
      >
        <Form.Item name="name" label="Họ tên" rules={[{ required: true, whitespace: true, max: 100 }]}>
          <Input placeholder="Nguyễn Văn A" autoComplete="name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="quan@email.com" autoComplete="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, min: 6, max: 72, message: 'Mật khẩu từ 6–72 ký tự' }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Nhập lại mật khẩu"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu' },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Mật khẩu không khớp')),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={mutation.isLoading}>
          Đăng ký
        </Button>
      </Form>
      <div className="text-center text-sm text-gray-500 mt-6">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary font-medium">
          Đăng nhập
        </Link>
      </div>
    </AuthCard>
  );
}
