export function ServiceStatusBadge({ isAvailable }) {
  return (
    <span className={`
      px-2 inline-flex text-xs leading-5 font-semibold rounded-full
      ${isAvailable 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
      }
    `}>
      {isAvailable ? 'Available' : 'Unavailable'}
    </span>
  );
}