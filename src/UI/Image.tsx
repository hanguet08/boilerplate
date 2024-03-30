import { default as GImage } from 'antd/lib/image';

interface IProps {
  width?: string | number;
  height?: string | number;
  src?: string;
  alt?: string;
  preview?: boolean;
  fallback?: string;
  className?: string;
}

export default function Image({ width, height, src, alt, preview, fallback, className = '' }: IProps) {
  return (
    <GImage
      className={className}
      width={width}
      height={height}
      src={src}
      alt={alt}
      preview={preview}
      fallback={fallback}
    />
  );
}
