import { Pencil, Trash2 } from 'lucide-react';

export function ServiceActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-900"
        title="Edit service"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900"
        title="Delete service"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}