import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Dropdown,
  Grid,
  Input,
  Modal,
  Pagination,
  Segmented,
  Select,
  Switch,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/layout/app';
import FoodImage from '@/components/common/FoodImage';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { showMessage } from '@/components/messages/GMessage';
import { Category, MenuItem } from '@/interfaces';
import { useAuth } from '@/providers/AuthProvider';
import {
  deleteCategory,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  MenuItemQuery,
  setMenuItemAvailability,
} from '@/services/menu.service';
import { formatMoney, getErrorMessage } from '@/ultils/format';
import lodash from '@/ultils/lodash';
import CategoryFormModal from './components/CategoryFormModal';
import MenuItemFormModal from './components/MenuItemFormModal';

type TabKey = 'items' | 'categories';
const PAGE_SIZE = 20;

function AvailabilitySwitch({ item }: { item: MenuItem }) {
  const queryClient = useQueryClient();
  const { restaurantId } = useAuth();
  const mutation = useMutation(
    (isAvailable: boolean) => setMenuItemAvailability(restaurantId as number, item.id, isAvailable),
    {
      onSuccess: (updated) => {
        showMessage.success(updated.isAvailable ? `${updated.name}: Đang bán` : `${updated.name}: Hết món`);
        queryClient.invalidateQueries(['menu', restaurantId]);
      },
      onError: (err) => showMessage.error(getErrorMessage(err)),
    },
  );

  return (
    <Switch
      checked={item.isAvailable}
      loading={mutation.isLoading}
      onChange={(checked) => mutation.mutate(checked)}
      checkedChildren="Đang bán"
      unCheckedChildren="Hết món"
    />
  );
}

export default function MenuPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const screens = Grid.useBreakpoint();
  const { restaurantId, isOwner } = useAuth();
  const tab: TabKey = router.query.tab === 'categories' ? 'categories' : 'items';

  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [itemModal, setItemModal] = useState<{ open: boolean; item?: MenuItem | null }>({ open: false });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; category?: Category | null }>({
    open: false,
  });

  const [debouncedSearch] = useState(() =>
    lodash.debounce((value: string) => {
      setSearch(value.trim());
      setPage(1);
    }, 400),
  );

  const { data: categories = [], isLoading: loadingCategories } = useQuery(
    ['categories', restaurantId],
    () => getCategories(restaurantId as number),
    { enabled: Boolean(restaurantId) },
  );

  const query: MenuItemQuery = { categoryId, q: search || undefined, page, limit: PAGE_SIZE };
  const {
    data: items,
    isLoading,
    error,
    refetch,
  } = useQuery(['menu', restaurantId, 'items', query], () => getMenuItems(restaurantId as number, query), {
    enabled: Boolean(restaurantId) && tab === 'items',
    keepPreviousData: true,
  });

  const removeItem = useMutation((item: MenuItem) => deleteMenuItem(restaurantId as number, item.id), {
    onSuccess: () => {
      showMessage.success('Đã xoá món');
      queryClient.invalidateQueries(['menu', restaurantId]);
      queryClient.invalidateQueries(['categories', restaurantId]);
    },
    onError: (err) => showMessage.error(getErrorMessage(err)),
  });

  const removeCategory = useMutation(
    (category: Category) => deleteCategory(restaurantId as number, category.id),
    {
      onSuccess: () => {
        showMessage.success('Đã xoá nhóm món');
        queryClient.invalidateQueries(['categories', restaurantId]);
      },
      onError: (err: any) =>
        showMessage.error(
          err?.status === 409 ? 'Nhóm còn món, hãy chuyển/xoá món hoặc ẩn nhóm' : getErrorMessage(err),
        ),
    },
  );

  const confirmDeleteItem = (item: MenuItem) =>
    Modal.confirm({
      title: `Xoá món "${item.name}"?`,
      content: 'Order cũ vẫn giữ tên và giá món.',
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => removeItem.mutateAsync(item),
    });

  const confirmDeleteCategory = (category: Category) =>
    Modal.confirm({
      title: `Xoá nhóm "${category.name}"?`,
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => removeCategory.mutateAsync(category),
    });

  const changeTab = (value: TabKey) =>
    router.replace({ query: { ...router.query, tab: value } }, undefined, { shallow: true });

  const itemActions = (item: MenuItem) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Sửa',
        onClick: () => setItemModal({ open: true, item }),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xoá',
        danger: true,
        onClick: () => confirmDeleteItem(item),
      },
    ],
  });

  const addButton = isOwner && (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() =>
        tab === 'items'
          ? setItemModal({ open: true, item: null })
          : setCategoryModal({ open: true, category: null })
      }
    >
      <span className="hidden sm:inline">{tab === 'items' ? 'Thêm món' : 'Thêm nhóm'}</span>
    </Button>
  );

  const renderItems = () => {
    if (isLoading) return <PageLoading />;
    if (error) return <PageError error={error} onRetry={refetch} />;
    if (!items?.data.length) {
      return (
        <EmptyState description={search || categoryId ? 'Không tìm thấy món phù hợp' : 'Chưa có món nào'}>
          {isOwner && !categories.length && (
            <Button type="primary" onClick={() => changeTab('categories')}>
              Tạo nhóm món trước
            </Button>
          )}
        </EmptyState>
      );
    }

    return (
      <>
        {screens.md ? (
          <Table<MenuItem>
            rowKey="id"
            dataSource={items.data}
            pagination={false}
            className="bg-white rounded-xl overflow-hidden"
            columns={[
              {
                title: 'Món',
                render: (_, item) => (
                  <div className="flex items-center gap-3">
                    <FoodImage
                      src={item.imageUrl}
                      alt={item.name}
                      dimmed={!item.isAvailable}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="min-w-0">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{item.description}</div>
                      )}
                    </div>
                  </div>
                ),
              },
              { title: 'Nhóm món', render: (_, item) => item.category?.name },
              { title: 'Giá', dataIndex: 'price', render: (price) => formatMoney(price) },
              { title: 'Trạng thái', width: 140, render: (_, item) => <AvailabilitySwitch item={item} /> },
              ...(isOwner
                ? [
                    {
                      title: '',
                      width: 100,
                      align: 'right' as const,
                      render: (_: unknown, item: MenuItem) => (
                        <div className="flex justify-end gap-1">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setItemModal({ open: true, item })}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => confirmDeleteItem(item)}
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {items.data.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-3"
              >
                <FoodImage
                  src={item.imageUrl}
                  alt={item.name}
                  dimmed={!item.isAvailable}
                  className="w-14 h-14 rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-sm text-gray-500">{formatMoney(item.price)}</div>
                </div>
                <AvailabilitySwitch item={item} />
                {isOwner && (
                  <Dropdown menu={itemActions(item)} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                )}
              </div>
            ))}
          </div>
        )}
        {items.meta.totalPages > 1 && (
          <Pagination
            className="self-center mt-3"
            current={page}
            pageSize={PAGE_SIZE}
            total={items.meta.total}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
            showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} món`}
          />
        )}
      </>
    );
  };

  const renderCategories = () => {
    if (loadingCategories) return <PageLoading />;
    if (!categories.length) return <EmptyState description="Chưa có nhóm món nào (VD: Đồ ăn, Đồ uống)" />;

    return (
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-solid border-gray-100 p-3"
          >
            <FoodImage src={category.imageUrl} alt={category.name} className="w-12 h-12 rounded-lg" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{category.name}</div>
              <div className="text-xs text-gray-500">
                {category.itemCount} món · thứ tự {category.sortOrder}
              </div>
            </div>
            {category.status === 'INACTIVE' && <Tag>Đang ẩn</Tag>}
            {isOwner && (
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: 'edit',
                      icon: <EditOutlined />,
                      label: 'Sửa',
                      onClick: () => setCategoryModal({ open: true, category }),
                    },
                    {
                      key: 'delete',
                      icon: <DeleteOutlined />,
                      label: 'Xoá',
                      danger: true,
                      onClick: () => confirmDeleteCategory(category),
                    },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppLayout title="Menu" extra={addButton}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Segmented
            value={tab}
            onChange={(value) => changeTab(value as TabKey)}
            options={[
              { value: 'items', label: 'Danh sách món' },
              { value: 'categories', label: `Nhóm món (${categories.length})` },
            ]}
            className="self-start"
          />
          {tab === 'items' && (
            <div className="flex gap-2 md:ml-auto">
              <Select
                allowClear
                placeholder="Tất cả nhóm"
                value={categoryId}
                onChange={(value) => {
                  setCategoryId(value);
                  setPage(1);
                }}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                className="w-36 md:w-44"
              />
              <Input
                allowClear
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Tìm món..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="flex-1 md:w-56"
              />
            </div>
          )}
        </div>
        {tab === 'items' ? renderItems() : renderCategories()}
      </div>

      <MenuItemFormModal
        open={itemModal.open}
        item={itemModal.item}
        categories={categories}
        defaultCategoryId={categoryId}
        onClose={() => setItemModal({ open: false })}
      />
      <CategoryFormModal
        open={categoryModal.open}
        category={categoryModal.category}
        nextSortOrder={categories.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1}
        onClose={() => setCategoryModal({ open: false })}
      />
    </AppLayout>
  );
}
