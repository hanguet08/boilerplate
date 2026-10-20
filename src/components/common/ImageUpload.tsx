import { useRef, useState } from 'react';
import { Button, Spin } from 'antd';
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { showMessage } from '@/components/messages/GMessage';
import { MAX_IMAGE_SIZE, uploadImage } from '@/services/upload.service';
import { getErrorMessage } from '@/ultils/format';
import FoodImage from './FoodImage';

interface IProps {
  restaurantId: number;
  value?: string | null;
  onChange?: (url: string | null) => void;
  className?: string;
}

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';

/** Form-compatible image field: uploads immediately and stores the returned URL. */
export default function ImageUpload({ restaurantId, value, onChange, className = 'w-24 h-24' }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      showMessage.error('Ảnh tối đa 5MB');
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadImage(restaurantId, file);
      onChange?.(url);
    } catch (error: any) {
      showMessage.error(error?.status === 413 ? 'Ảnh tối đa 5MB' : getErrorMessage(error));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Spin spinning={uploading}>
        <FoodImage
          src={value}
          alt="Ảnh"
          className={`${className} rounded-xl border border-solid border-gray-200`}
        />
      </Spin>
      <div className="flex flex-col gap-2">
        <Button icon={<CameraOutlined />} onClick={() => inputRef.current?.click()} disabled={uploading}>
          {value ? 'Đổi ảnh' : 'Tải ảnh lên'}
        </Button>
        {value && (
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onChange?.(null)}>
            Xoá ảnh
          </Button>
        )}
        <span className="text-xs text-gray-400">JPG, PNG, WEBP · tối đa 5MB</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
