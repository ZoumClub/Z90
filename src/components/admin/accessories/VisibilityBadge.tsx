import { Eye, EyeOff } from 'lucide-react';

interface VisibilityBadgeProps {
  isVisible: boolean;
  isUpdating: boolean;
  onClick: () => void;
}

export function VisibilityBadge({ isVisible, isUpdating, onClick }: VisibilityBadgeProps) {
  return (
    <button
      onClick={onClick}
      disabled={isUpdating}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
        transition-all duration-200
        ${isVisible
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }
        ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
      title={isVisible ? 'Click to hide from main page' : 'Click to show on main page'}
    >
      {isVisible ? (
        <>
          <Eye className="h-4 w-4" />
          <span>Visible</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4" />
          <span>Hidden</span>
        </>
      )}
    </button>
  );
}