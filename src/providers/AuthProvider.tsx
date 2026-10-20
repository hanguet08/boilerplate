import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import auth from '@/constants/auth';
import { Me, Membership, Restaurant, RestaurantRole } from '@/interfaces';
import { getMe } from '@/services/auth.service';
import { disablePush } from '@/ultils/push';

interface IAuthContext {
  token: string | null;
  ready: boolean;
  me?: Me;
  isLoadingMe: boolean;
  memberships: Membership[];
  restaurantId: number | null;
  restaurant?: Restaurant;
  role?: RestaurantRole;
  isOwner: boolean;
  signIn: (accessToken: string) => void;
  signOut: () => Promise<void>;
  selectRestaurant: (restaurantId: number | null) => void;
  refetchMe: () => Promise<unknown>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const ME_QUERY_KEY = ['me'];

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(auth.TOKEN));
    const storedRid = Number(localStorage.getItem(auth.RESTAURANT_ID));
    setRestaurantId(storedRid || null);
    setReady(true);
  }, []);

  const {
    data: me,
    isLoading,
    refetch,
  } = useQuery(ME_QUERY_KEY, getMe, { enabled: Boolean(token), staleTime: 5 * 60 * 1000 });

  const memberships = useMemo(
    () => (me?.memberships ?? []).filter((m) => m.status === 'ACTIVE' && m.restaurant),
    [me],
  );
  const membership = memberships.find((m) => m.restaurantId === restaurantId);

  // Drop a stored restaurant the user no longer belongs to
  useEffect(() => {
    if (!me || !restaurantId || membership) return;
    selectRestaurant(memberships.length === 1 ? memberships[0].restaurantId : null);
  }, [me, restaurantId, membership]);

  const signIn = useCallback(
    (accessToken: string) => {
      localStorage.setItem(auth.TOKEN, accessToken);
      queryClient.clear();
      setToken(accessToken);
    },
    [queryClient],
  );

  const selectRestaurant = useCallback((rid: number | null) => {
    if (rid) localStorage.setItem(auth.RESTAURANT_ID, String(rid));
    else localStorage.removeItem(auth.RESTAURANT_ID);
    setRestaurantId(rid);
  }, []);

  const signOut = useCallback(async () => {
    await disablePush().catch(() => undefined);
    localStorage.removeItem(auth.TOKEN);
    localStorage.removeItem(auth.RESTAURANT_ID);
    setToken(null);
    setRestaurantId(null);
    queryClient.clear();
    router.replace('/login');
  }, [queryClient, router]);

  const value = useMemo<IAuthContext>(
    () => ({
      token,
      ready,
      me,
      isLoadingMe: Boolean(token) && isLoading,
      memberships,
      restaurantId: membership ? restaurantId : null,
      restaurant: membership?.restaurant,
      role: membership?.role,
      isOwner: membership?.role === 'OWNER',
      signIn,
      signOut,
      selectRestaurant,
      refetchMe: refetch,
    }),
    [token, ready, me, isLoading, memberships, membership, restaurantId, signIn, signOut, selectRestaurant],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext) as IAuthContext;
