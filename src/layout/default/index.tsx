import ScrollTopButton from '@/components/ScollToTop';
import { ReactNode, useRef } from 'react';

interface IProps {
  header: ReactNode;
  content: ReactNode;
}

export default function DefaultLayout({ header, content }: IProps) {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const handleGotoTop = () => {
    scrollContainer.current?.scrollTo({
      behavior: 'smooth',
      top: 0,
      left: 0,
    });
  };

  return (
    <>
      <div className="flex flex-col overflow-y-hidden">
        <div ref={scrollContainer} className="overflow-auto flex-1">
          {header}
          <div className="flex flex-col px-4">{content}</div>
        </div>
      </div>
      <div className="block relative w-full h-0">
        <ScrollTopButton ref={scrollContainer} onGotoTop={handleGotoTop} />
      </div>
    </>
  );
}
