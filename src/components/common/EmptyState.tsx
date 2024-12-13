interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}