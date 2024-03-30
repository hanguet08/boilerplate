import { Result, Spin } from '@/UI';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/configs/Auth/client';
import { hasPermission } from '@/ultils/function';
import Sidebar from '@/layout/component/Sidebar';

interface Props {
  renderContent: ReactNode;
}

const Author: React.FC<Props> = ({ renderContent }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>();
  const router = useRouter();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (!userInfo?.id) return;
    setIsAllowed(hasPermission(router.pathname, userInfo));
  }, [router, userInfo]);

  if (typeof isAllowed === 'undefined')
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <div className="flex overflow-hidden h-[100vh]">
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {!isAllowed ? (
          <div className="flex-1 flex items-center justify-center">
            <Result status="403" title="403" subTitle="Xin lỗi, bạn không có quyền truy cập trang web này." />
          </div>
        ) : (
          renderContent
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default Author;
