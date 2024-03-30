import { ReactNode } from 'react';
import { default as GForm } from 'antd/lib/form';
import { Store } from './lib/form/interface';
import { FormLayout } from './lib/form/Form';
import { FormInstance } from '.';

interface IProps {
  layout?: FormLayout;
  name?: string;
  form?: FormInstance<any>;
  preserve?: boolean;
  initialValues?: Store;
  onValuesChange?: (changedValues: any, values: any) => void;
  onFinish?: (values: any) => void;
  children?: ReactNode;
  className?: string;
}

export default function Form({
  layout,
  name,
  form,
  preserve,
  initialValues,
  onValuesChange,
  onFinish,
  children,
  className = '',
}: IProps) {
  return (
    <GForm
      className={className}
      layout={layout}
      name={name}
      form={form}
      preserve={preserve}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >
      {children}
    </GForm>
  );
}

Form.Item = GForm.Item;
Form.useForm = GForm.useForm;
