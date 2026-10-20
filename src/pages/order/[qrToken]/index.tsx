import CustomerProvider from '@/modules/customer/CustomerProvider';
import Welcome from '@/modules/customer/Welcome';

export default function CustomerWelcomePage() {
  return (
    <CustomerProvider>
      <Welcome />
    </CustomerProvider>
  );
}
