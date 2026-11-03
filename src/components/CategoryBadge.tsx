interface CategoryBadgeProps {
  label: string;
  variant?: 'pink' | 'brown' | 'green' | 'gray';
  size?: 'sm' | 'md';
}

const variantClasses: Record<string, string> = {
  pink:  'bg-[#FDE8EC] text-[#733D26]',
  brown: 'bg-[#733D26] text-white',
  green: 'bg-green-100 text-green-800',
  gray:  'bg-gray-100 text-gray-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-3 py-1',
};

export function CategoryBadge({ label, variant = 'pink', size = 'md' }: CategoryBadgeProps) {
  return (
    <span className={`inline-block rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}
