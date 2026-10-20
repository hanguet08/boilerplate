import { createContext, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { PublicMenu } from '@/interfaces';
import { getPublicMenu } from '@/services/public.service';
import useCart from '@/hooks/useCart';
import useLocalStorage from '@/hooks/useLocalStorage';
import { PageLoading } from '@/components/common/PageState';

const MAX_SAVED_ORDERS = 20;

type ICustomerContext = {
  qrToken: string;
  menu?: PublicMenu;
  isLoadingMenu: boolean;
  menuError: any;
  refetchMenu: () => void;
  cart: ReturnType<typeof useCart>;
  orderCodes: string[];
  saveOrderCode: (code: string) => void;
};

const CustomerContext = createContext<ICustomerContext | null>(null);

export const publicMenuKey = (qrToken: string) => ['public-menu', qrToken];
export const publicOrdersKey = (qrToken: string) => ['public-orders', qrToken];

export default function CustomerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const qrToken = typeof router.query.qrToken === 'string' ? router.query.qrToken : '';

  const {
    data: menu,
    isLoading,
    error,
    refetch,
  } = useQuery(publicMenuKey(qrToken), () => getPublicMenu(qrToken), {
    enabled: Boolean(qrToken),
    staleTime: 60 * 1000,
    retry: (count, err: any) => err?.status !== 404 && count < 2,
  });

  const cart = useCart(qrToken || undefined);
  const [orderCodes, setOrderCodes] = useLocalStorage<string[]>(qrToken ? `orders:${qrToken}` : null, []);

  const saveOrderCode = (code: string) =>
    setOrderCodes((prev) => [code, ...prev.filter((c) => c !== code)].slice(0, MAX_SAVED_ORDERS));

  return (
    <CustomerContext.Provider
      value={{
        qrToken,
        menu,
        isLoadingMenu: !qrToken || isLoading,
        menuError: error,
        refetchMenu: refetch,
        cart,
        orderCodes,
        saveOrderCode,
      }}
    >
      {/* qrToken is unknown during static prerender — wait for the router */}
      {qrToken ? children : <PageLoading className="min-h-screen" />}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => useContext(CustomerContext) as ICustomerContext;
