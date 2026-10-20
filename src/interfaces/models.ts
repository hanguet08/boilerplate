export type ActiveStatus = 'ACTIVE' | 'INACTIVE';
export type RestaurantRole = 'OWNER' | 'STAFF';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type TableBoardState = 'EMPTY' | 'NEW_ORDER' | 'SERVING';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  phone: string | null;
  address: string | null;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: number;
  restaurantId: number;
  userId: number;
  role: RestaurantRole;
  status: ActiveStatus;
  createdAt: string;
  user?: User;
  restaurant?: Restaurant;
}

export interface Me extends User {
  memberships: Membership[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Table {
  id: number;
  restaurantId: number;
  name: string;
  qrToken: string;
  status: ActiveStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TableOverview extends Table {
  state: TableBoardState;
  pendingCount: number;
  confirmedCount: number;
  activeTotal: number;
  lastOrderAt: string | null;
}

export interface TableDetail extends Table {
  orders: Order[];
  total: number;
}

export interface Category {
  id: number;
  restaurantId: number;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number | null;
  itemName: string;
  itemPrice: number;
  quantity: number;
  note: string | null;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: OrderStatus;
  createdById: number | null;
  createdBy: User | null;
  createdAt: string;
}

export interface Order {
  id: number;
  restaurantId: number;
  tableId: number;
  orderCode: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  table?: Table;
  statusHistory?: OrderStatusHistory[];
}

export interface PublicMenu {
  restaurant: Pick<Restaurant, 'id' | 'name' | 'slug' | 'logoUrl' | 'phone' | 'address'>;
  table: Pick<Table, 'id' | 'name'>;
  categories: (Category & { items: MenuItem[] })[];
}

export interface CreateOrderPayload {
  items: { menuItemId: number; quantity: number; note?: string }[];
  note?: string;
}

export interface PushPayload {
  type: 'order.created' | 'test';
  title: string;
  body: string;
  tag?: string;
  data?: { restaurantId: number; tableId: number; orderId: number; orderCode: string };
}
