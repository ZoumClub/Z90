import { useState } from 'react';
import { useRouter } from 'next/router';
import { ServiceRow } from './ServiceRow';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';

export function ServiceList({ services = [], updatingId, onToggleVisibility, onDelete }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);

  if (!services.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No services found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visibility
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              isUpdating={updatingId === service.id}
              onEdit={() => router.push(`/admin/dashboard/services/${service.id}`)}
              onDelete={() => setDeleteId(service.id)}
              onToggleVisibility={() => onToggleVisibility(service)}
            />
          ))}
        </tbody>
      </table>

      {deleteId && (
        <DeleteConfirmModal
          title="Delete Service"
          message="Are you sure you want to delete this service? This action cannot be undone."
          onConfirm={async () => {
            await onDelete(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}