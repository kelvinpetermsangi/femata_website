import type { AdvertItem, AdvertSlots } from '@/types';

export function advertsForSlot(adverts: AdvertSlots | undefined, slotNumber: number): AdvertItem[] {
  return adverts?.[String(slotNumber)] ?? [];
}
