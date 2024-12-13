import { Badge } from '../common/Badge';

interface ListingStatusProps {
  status: 'pending' | 'approved' | 'rejected';
}

export function ListingStatus({ status }: ListingStatusProps) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <Badge className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}