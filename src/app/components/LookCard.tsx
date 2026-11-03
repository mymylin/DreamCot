import { Sparkles } from 'lucide-react';

type PredefinedLook = {
  id: string;
  name: string;
  occasion: string;
  description: string;
  requiredCategories: string[];
};

type Availability = {
  canCreate: boolean;
  missing: string[];
  available: string[];
};

interface LookCardProps {
  look: PredefinedLook;
  availability: Availability;
}

/** Card reutilizável para apresentar um look predefinido e seus requisitos. */
export function LookCard({ look, availability }: LookCardProps) {
  return (
    <article className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-[#FDE8EC] to-[#FFB6C1]/40 p-8 flex items-center justify-center aspect-video">
        <Sparkles className="text-[#FFB6C1]" size={48} aria-hidden="true" />
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#733D26] mb-1">{look.name}</h2>
          <span className="inline-block bg-[#FDE8EC] text-[#733D26] text-xs px-3 py-1 rounded-full">{look.occasion}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{look.description}</p>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[#733D26] mb-2">Itens Necessários:</h3>
          <ul className="space-y-1">
            {look.requiredCategories.map(category => {
              const available = availability.available.includes(category);
              return (
                <li key={category} className={`text-sm flex items-center gap-2 ${available ? 'text-green-600' : 'text-red-500'}`}>
                  <span aria-hidden="true">{available ? '✓' : '✗'}</span>{category}
                </li>
              );
            })}
          </ul>
        </div>
        {availability.canCreate ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium">✓ Você pode criar este look!</p>
          </div>
        ) : (
          <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-3">
            <p className="text-[#733D26] text-sm"><strong>Faltando:</strong> {availability.missing.join(', ')}</p>
          </div>
        )}
      </div>
    </article>
  );
}
