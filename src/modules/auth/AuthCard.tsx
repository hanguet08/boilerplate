import { ReactNode } from 'react';
import Head from 'next/head';

interface IProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: IProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-lightest to-white p-4">
      <Head>
        <title>{`${title} · QOrder`}</title>
      </Head>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-solid border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-md shadow-blue-200">
            🍽️
          </div>
          <div className="text-2xl font-bold mt-4">QOrder</div>
          <div className="text-gray-500 text-sm mt-1">Dành cho nhà hàng</div>
        </div>
        <h1 className="text-lg font-semibold mb-1">{title}</h1>
        {subtitle && <div className="text-gray-500 text-sm mb-4">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}
