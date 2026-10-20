import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeftOutlined } from '@ant-design/icons';
import cx from 'classnames';

interface IProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  backHref?: string;
  extra?: ReactNode;
  footer?: ReactNode;
  pageTitle?: string;
  className?: string;
  children: ReactNode;
}

/** Phone-width shell for the customer QR pages; centered card on larger screens. */
export default function CustomerLayout({
  title,
  subtitle,
  backHref,
  extra,
  footer,
  pageTitle,
  className,
  children,
}: IProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {pageTitle && (
        <Head>
          <title>{pageTitle}</title>
        </Head>
      )}
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col relative shadow-sm">
        {(title || backHref) && (
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-0 border-b border-solid border-gray-100">
            <div className="flex items-center gap-2 h-14 px-2">
              {backHref ? (
                <button
                  type="button"
                  aria-label="Quay lại"
                  className="w-10 h-10 flex items-center justify-center bg-transparent border-0 cursor-pointer text-lg"
                  onClick={() => router.push(backHref)}
                >
                  <ArrowLeftOutlined />
                </button>
              ) : (
                <span className="w-2" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base truncate">{title}</div>
                {subtitle && <div className="text-xs text-gray-500 truncate">{subtitle}</div>}
              </div>
              {extra}
            </div>
          </header>
        )}
        <main className={cx('flex-1 flex flex-col', className)}>{children}</main>
        {footer && (
          <div className="sticky bottom-0 z-20 bg-white border-0 border-t border-solid border-gray-100 p-3 pb-safe">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
