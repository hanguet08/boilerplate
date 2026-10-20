import CustomerProvider from '@/modules/customer/CustomerProvider';
import Cart from '@/modules/customer/Cart';

export default function CustomerCartPage() {
  return (
    <CustomerProvider>
      <Cart />
    </CustomerProvider>
  );
}
