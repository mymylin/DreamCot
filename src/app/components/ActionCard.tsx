import { Link } from 'react-router';

type ActionCardProps = {
  title: string;
  description: string;
  link: string;
  filled?: boolean;
};

export function ActionCard({ title, description, link, filled = false }: ActionCardProps) {
  return (
    <Link
      to={link}
      className={
        filled
          ? 'bg-[#733D26] text-white rounded-lg p-8 hover:bg-[#8B4A30] transition-colors block'
          : 'bg-white border-2 border-[#FFB6C1] text-[#733D26] rounded-lg p-8 hover:bg-[#FDE8EC] transition-colors block'
      }
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className={filled ? 'text-gray-300' : 'text-gray-500'}>{description}</p>
    </Link>
  );
}
