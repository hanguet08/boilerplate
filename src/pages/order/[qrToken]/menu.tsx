import CustomerProvider from '@/modules/customer/CustomerProvider';
import Menu from '@/modules/customer/Menu';

export default function CustomerMenuPage() {
  return (
    <CustomerProvider>
      <Menu />
    </CustomerProvider>
  );
}
