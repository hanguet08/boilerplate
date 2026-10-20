import CustomerProvider from '@/modules/customer/CustomerProvider';
import History from '@/modules/customer/History';

export default function CustomerHistoryPage() {
  return (
    <CustomerProvider>
      <History />
    </CustomerProvider>
  );
}
