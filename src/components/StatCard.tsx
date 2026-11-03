import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  link?: string;
  linkLabel?: string;
  largeValue?: boolean;
}

export function StatCard({ icon: Icon, value, label, link, linkLabel, largeValue = false }: StatCardProps) {
  return (
    <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#FDE8EC] p-3 rounded-lg">
          <Icon className="text-[#733D26]" size={24} aria-hidden="true" />
        </div>
        <div>
          <p className={`${largeValue ? 'text-lg' : 'text-3xl'} font-bold text-[#733D26]`}>{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
      {link && linkLabel && (
        <Link
          to={link}
          className="text-[#733D26] hover:text-[#FFB6C1] text-sm font-medium inline-flex items-center min-h-[44px] transition-colors"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
