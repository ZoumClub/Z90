
import { Pencil, Trash2 } from 'lucide-react';

interface ServiceActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ServiceActions({ onEdit, onDelete }: ServiceActionsProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-900 transition-colors"
        title="Edit service"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900 transition-colors"
        title="Delete service"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
