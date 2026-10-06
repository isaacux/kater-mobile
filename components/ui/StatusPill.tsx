import type { OrderStatus } from '@/data/types';
import { Tag } from './Tag';

const map: Record<OrderStatus, { label: string; tone: 'info' | 'success' | 'danger' }> = {
  upcoming: { label: 'Upcoming', tone: 'info' },
  delivered: { label: 'Delivered', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return <Tag label={map[status].label} tone={map[status].tone} />;
}
