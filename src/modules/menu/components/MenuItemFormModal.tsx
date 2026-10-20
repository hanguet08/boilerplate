import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ImageUpload from '@/components/common/ImageUpload';
import { showMessage } from '@/components/messages/GMessage';
import { Category, MenuItem } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import { createMenuItem, MenuItemPayload, updateMenuItem } from '@/services/menu.service';
import { getErrorMessage } from '@/ultils/format';

interface IProps {
  open: boolean;
  item?: MenuItem | null;
  categories: Category[];
  defaultCategoryId?: number;
  onClose: () => void;
}

export const moneyFormatter = (value?: number | string) =>
  `${value ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const moneyParser = (value?: string) => Number((value ?? '').replace(/\D/g, '')) as any;

export default function MenuItemFormModal({ open, item, categories, defaultCategoryId, onClose }: IProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(
      item
        ? {
            categoryId: item.categoryId,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
            sortOrder: item.sortOrder,
          }
        : { categoryId: defaultCategoryId ?? categories[0]?.id, isAvailable: true, sortOrder: 0 },
    );
  }, [open, item]);

  const save = useMutation(
    (values: MenuItemPayload) => {
      const body: MenuItemPayload = {
        ...values,
        name: values.name?.trim(),
        // null clears the field on edit; omitted on create
        description: values.description?.trim() || (isEdit ? null : undefined),
        imageUrl: values.imageUrl || (isEdit ? null : undefined),
      };
      return isEdit
        ? updateMenuItem(restaurantId as number, (item as MenuItem).id, body)
        : createMenuItem(restaurantId as number, body);
    },
    {
      onSuccess: () => {
        showMessage.success(isEdit ? 'Đã cập nhật món' : 'Đã thêm món');
        queryClient.invalidateQueries(['menu', restaurantId]);
        queryClient.invalidateQueries(['categories', restaurantId]);
        onClose();
      },
      onError: (err) => showMessage.error(getErrorMessage(err)),
    },
  );

  return (
    <Modal
      open={open}
      title={isEdit ? 'Sửa món' : 'Thêm món'}
      okText={isEdit ? 'Lưu' : 'Thêm món'}
      cancelText="Huỷ"
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={save.isLoading}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={save.mutate}>
        <Form.Item name="imageUrl" label="Hình ảnh">
          <ImageUpload restaurantId={restaurantId as number} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên món"
          rules={[{ required: true, whitespace: true, message: 'Nhập tên món' }]}
        >
          <Input placeholder="Bún bò Huế" />
        </Form.Item>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            name="categoryId"
            label="Nhóm món"
            rules={[{ required: true, message: 'Chọn nhóm món' }]}
          >
            <Select
              placeholder="Chọn nhóm"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              notFoundContent="Hãy tạo nhóm món trước"
            />
          </Form.Item>
          <Form.Item name="price" label="Giá (đ)" rules={[{ required: true, message: 'Nhập giá' }]}>
            <InputNumber
              min={0}
              step={1000}
              className="w-full"
              formatter={moneyFormatter}
              parser={moneyParser}
              inputMode="numeric"
              addonAfter="đ"
            />
          </Form.Item>
        </div>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="Bún bò Huế đậm đà, thơm ngon" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="sortOrder" label="Thứ tự">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item name="isAvailable" label="Đang bán" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
