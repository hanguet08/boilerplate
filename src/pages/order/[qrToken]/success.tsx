import CustomerProvider from '@/modules/customer/CustomerProvider';
import Success from '@/modules/customer/Success';

export default function CustomerSuccessPage() {
  return (
    <CustomerProvider>
      <Success />
    </CustomerProvider>
  );
}
