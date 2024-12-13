interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
}