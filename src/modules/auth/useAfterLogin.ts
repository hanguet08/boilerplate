import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { AuthResponse } from '@/interfaces';
import { getMe } from '@/services/auth.service';
import { ME_QUERY_KEY, useAuth } from '@/providers/AuthProvider';

/** Stores the token, then routes: 1 restaurant → straight in, otherwise → choose/create restaurant. */
export default function useAfterLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signIn, selectRestaurant, restaurantId } = useAuth();

  return async ({ accessToken }: AuthResponse) => {
    signIn(accessToken);
    const me = await getMe();
    queryClient.setQueryData(ME_QUERY_KEY, me);

    const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/tables';
    const active = me.memberships.filter((m) => m.status === 'ACTIVE');
    const keep = active.find((m) => m.restaurantId === restaurantId);

    if (keep || active.length === 1) {
      selectRestaurant((keep ?? active[0]).restaurantId);
      router.replace(redirect);
      return;
    }
    router.replace(`/restaurants?redirect=${encodeURIComponent(redirect)}`);
  };
}
