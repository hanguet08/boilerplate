import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Switch } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImageUpload from '@/components/common/ImageUpload';
import { showMessage } from '@/components/messages/GMessage';
import { Category } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { createCategory, updateCategory } from '@/services/menu.service';
import { getErrorMessage } from '@/ultils/format';

interface IProps {
  open: boolean;
  category?: Category | null;
  nextSortOrder: number;
  onClose: () => void;
}

export default function CategoryFormModal({ open, category, nextSortOrder, onClose }: IProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const isEdit = Boolean(category);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(
      category
        ? {
            name: category.name,
            imageUrl: category.imageUrl,
            sortOrder: category.sortOrder,
            active: category.status === 'ACTIVE',
          }
        : { sortOrder: nextSortOrder, active: true },
    );
  }, [open, category]);

  const save = useMutation(
    ({ active, ...values }: any) => {
      const body = {
        name: values.name.trim(),
        imageUrl: values.imageUrl || (isEdit ? null : undefined),
        sortOrder: values.sortOrder,
        status: active ? 'ACTIVE' : 'INACTIVE',
      } as const;
      return isEdit
        ? updateCategory(restaurantId as number, (category as Category).id, body)
        : createCategory(restaurantId as number, body);
    },
    {
      onSuccess: () => {
        showMessage.success(isEdit ? 'Đã cập nhật nhóm món' : 'Đã thêm nhóm món');
        queryClient.invalidateQueries(['categories', restaurantId]);
        queryClient.invalidateQueries(['menu', restaurantId]);
        onClose();
      },
      onError: (err) => showMessage.error(getErrorMessage(err)),
    },
  );

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa nhóm món' : 'Thêm nhóm món'}
      okText={isEdit ? 'Lưu' : 'Thêm'}
      cancelText="Huỷ"
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={save.isLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={save.mutate}>
        <Form.Item
          name="name"
          label="Tên nhóm"
          rules={[{ required: true, whitespace: true, message: 'Nhập tên nhóm' }]}
        >
          <Input placeholder="Đồ ăn, Đồ uống..." />
        </Form.Item>
        <Form.Item name="imageUrl" label="Hình ảnh (tuỳ chọn)">
          <ImageUpload restaurantId={restaurantId as number} className="w-16 h-16" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="sortOrder" label="Thứ tự">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị cho khách" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
