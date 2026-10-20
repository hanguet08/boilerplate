import { useState } from 'react';
import cx from 'classnames';

interface IProps {
  src?: string | null;
  alt: string;
  className?: string;
  dimmed?: boolean;
}

/** Square-ish food thumbnail with an emoji placeholder when there is no image (or it fails to load). */
export default function FoodImage({ src, alt, className, dimmed }: IProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cx(
        'overflow-hidden bg-orange-50 flex items-center justify-center shrink-0',
        { 'grayscale opacity-60': dimmed },
        className,
      )}
    >
      {showImage ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="text-2xl select-none" aria-hidden>
          🍜
        </span>
      )}
    </div>
  );
}
