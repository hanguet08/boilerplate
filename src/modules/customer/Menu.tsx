import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Input } from 'antd';
import { HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import cx from 'classnames';
import CustomerLayout from '@/layout/customer';
import { EmptyState, PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { MenuItem } from '@/interfaces';
import { normalizeText } from '@/ultils/function';
import { useCustomer } from './CustomerProvider';
import InvalidQr from './components/InvalidQr';
import ItemSheet from './components/ItemSheet';
import MenuItemRow from './components/MenuItemRow';
import CartBar from './components/CartBar';

const ALL = 0;
const HEADER_OFFSET = 112;

export default function Menu() {
  const { qrToken, menu, isLoadingMenu, menuError, refetchMenu, cart } = useCustomer();
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const scrollingByClick = useRef(false);

  const categories = useMemo(() => {
    const search = normalizeText(keyword.trim());
    return (menu?.categories ?? [])
      .map((category) => ({
        ...category,
        items: search
          ? category.items.filter((item) => normalizeText(item.name).includes(search))
          : category.items,
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, keyword]);

  // Scroll-spy: highlight the category whose section is at the top of the viewport
  useEffect(() => {
    const onScroll = () => {
      if (scrollingByClick.current) return;
      const current = categories.filter((c) => {
        const el = sectionRefs.current[c.id];
        return el && el.getBoundingClientRect().top <= HEADER_OFFSET + 8;
      });
      setActiveCategory(current.length ? current[current.length - 1].id : ALL);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories]);

  const scrollToCategory = (id: number) => {
    setActiveCategory(id);
    scrollingByClick.current = true;
    const top = id === ALL ? 0 : (sectionRefs.current[id]?.offsetTop ?? 0) - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => (scrollingByClick.current = false), 600);
  };

  const handleAdd = (item: MenuItem, quantity = 1, note?: string) => {
    cart.addItem(item, quantity, note);
    showMessage.success(`Đã thêm ${quantity} × ${item.name}`);
  };

  if (menuError) return <InvalidQr error={menuError} onRetry={refetchMenu} />;

  return (
    <CustomerLayout
      pageTitle={menu ? `Menu - ${menu.restaurant.name}` : 'Menu'}
      title={menu?.restaurant.name ?? 'Menu'}
      subtitle={menu?.table.name}
      backHref={`/order/${qrToken}`}
      extra={
        <Link
          href={`/order/${qrToken}/history`}
          aria-label="Order của tôi"
          className="w-10 h-10 flex items-center justify-center text-lg text-gray-700"
        >
          <HistoryOutlined />
        </Link>
      }
    >
      {isLoadingMenu || !menu ? (
        <PageLoading />
      ) : (
        <>
          <div className="sticky top-14 z-10 bg-white px-4 pt-3 pb-2 shadow-[0_1px_0_#f3f4f6]">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm món..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-full bg-gray-50"
            />
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3">
              {[{ id: ALL, name: 'Tất cả' }, ...categories].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategory(category.id)}
                  className={cx(
                    'whitespace-nowrap rounded-full px-4 py-1.5 text-sm border border-solid cursor-pointer transition-colors',
                    activeCategory === category.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200',
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4 flex-1">
            {categories.length === 0 && (
              <EmptyState description={keyword ? 'Không tìm thấy món phù hợp' : 'Quán chưa có món nào'} />
            )}
            {categories.map((category) => (
              <section
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="pt-4"
              >
                <h2 className="text-base font-bold mb-1">{category.name}</h2>
                <div className="divide-y divide-solid divide-x-0 divide-gray-100">
                  {category.items.map((item) => (
                    <MenuItemRow
                      key={item.id}
                      item={item}
                      quantityInCart={cart.quantityByItem[item.id] ?? 0}
                      onOpen={setSelectedItem}
                      onQuickAdd={(menuItem) => handleAdd(menuItem)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <CartBar href={`/order/${qrToken}/cart`} count={cart.count} total={cart.total} />
        </>
      )}
      <ItemSheet item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAdd} />
    </CustomerLayout>
  );
}
