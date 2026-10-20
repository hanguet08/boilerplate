import { useMemo } from 'react';
import { MenuItem } from '@/interfaces';
import { uid } from '@/ultils/function';
import useLocalStorage from './useLocalStorage';

export interface CartLine {
  key: string;
  menuItemId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  note?: string;
}

const MAX_QUANTITY = 99;

/** Cart persisted per table (qrToken). The same item with different notes is kept as separate lines. */
export default function useCart(qrToken?: string) {
  const [lines, setLines, hydrated] = useLocalStorage<CartLine[]>(qrToken ? `cart:${qrToken}` : null, []);

  const addItem = (item: MenuItem, quantity = 1, note?: string) => {
    const cleanNote = note?.trim() || undefined;
    setLines((prev) => {
      const existing = prev.find((line) => line.menuItemId === item.id && line.note === cleanNote);
      if (existing) {
        return prev.map((line) =>
          line.key === existing.key
            ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
            : line,
        );
      }
      return [
        ...prev,
        {
          key: uid(8),
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity,
          note: cleanNote,
        },
      ];
    });
  };

  const setQuantity = (key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.key !== key)
        : prev.map((line) =>
            line.key === key ? { ...line, quantity: Math.min(MAX_QUANTITY, quantity) } : line,
          ),
    );
  };

  const setNote = (key: string, note: string) => {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, note: note || undefined } : line)));
  };

  const removeItems = (menuItemIds: number[]) => {
    setLines((prev) => prev.filter((line) => !menuItemIds.includes(line.menuItemId)));
  };

  const clear = () => setLines([]);

  const summary = useMemo(
    () => ({
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.quantity * line.price, 0),
      quantityByItem: lines.reduce<Record<number, number>>((acc, line) => {
        acc[line.menuItemId] = (acc[line.menuItemId] ?? 0) + line.quantity;
        return acc;
      }, {}),
    }),
    [lines],
  );

  return { lines, hydrated, addItem, setQuantity, setNote, removeItems, clear, ...summary };
}
