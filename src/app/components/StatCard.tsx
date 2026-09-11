import { Link } from 'react-router';
import type { ReactNode } from 'react';

type StatCardProps = {
  value: string | number;
  title: string;
  icon: ReactNode;
  link?: string;
  linkText?: string;
};

export function StatCard({ value, title, icon, link, linkText }: StatCardProps) {
  return (
    <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#FDE8EC] p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-[#733D26]">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>

      {link && (
        <Link
          to={link}
          className="text-[#733D26] hover:text-[#FFB6C1] text-sm font-medium inline-flex items-center min-h-[44px]"
        >
          {linkText || 'Ver mais →'}
        </Link>
      )}
    </div>
  );
}
