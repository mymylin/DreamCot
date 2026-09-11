import { useState, useMemo } from 'react';
import { storage } from '../utils/storage';
import { Search, Sparkles } from 'lucide-react';

const PREDEFINED_LOOKS = [
  {
    id: 'casual-weekend',
    name: 'Fim de Semana Casual',
    occasion: 'Casual',
    description: 'Roupa confortável e relaxada para atividades de fim de semana',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'],
  },
  {
    id: 'business-professional',
    name: 'Profissional de Negócios',
    occasion: 'Trabalho',
    description: 'Look profissional clássico para o escritório',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Agasalho', 'Calçados'],
  },
  {
    id: 'date-night',
    name: 'Saída à Noite',
    occasion: 'Formal',
    description: 'Outfit elegante e estiloso para uma noite especial',
    requiredCategories: ['Vestido', 'Calçados', 'Acessórios'],
  },
  {
    id: 'athleisure',
    name: 'Athleisure',
    occasion: 'Casual',
    description: 'Estilo esportivo e casual para tarefas do dia a dia',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'],
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    occasion: 'Smart Casual',
    description: 'Equilíbrio entre profissional e relaxado',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'],
  },
  {
    id: 'summer-chic',
    name: 'Verão Chique',
    occasion: 'Casual',
    description: 'Look leve e fresco para dias quentes',
    requiredCategories: ['Vestido', 'Calçados', 'Acessórios'],
  },
  {
    id: 'winter-layers',
    name: 'Camadas de Inverno',
    occasion: 'Casual',
    description: 'Look quentinho em camadas para dias frios',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Agasalho', 'Calçados', 'Acessórios'],
  },
  {
    id: 'minimalist-modern',
    name: 'Minimalista Moderno',
    occasion: 'Dia a Dia',
    description: 'Linhas limpas e simples com cores neutras',
    requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'],
  },
];

export function PredefinedLooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const allItems = storage.getItems();

  const occasions = useMemo(() => {
    const occ = new Set(PREDEFINED_LOOKS.map(look => look.occasion));
    return ['all', ...Array.from(occ)];
  }, []);

  const filteredLooks = useMemo(() => {
    return PREDEFINED_LOOKS.filter(look => {
      const matchesSearch = look.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        look.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        look.occasion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOccasion = occasionFilter === 'all' || look.occasion === occasionFilter;

      return matchesSearch && matchesOccasion;
    });
  }, [searchQuery, occasionFilter]);

  const checkAvailability = (requiredCategories: string[]) => {
    const availableCategories = new Set(allItems.map(item => item.category));
    const missing = requiredCategories.filter(cat => !availableCategories.has(cat));
    return {
      canCreate: missing.length === 0,
      missing,
      available: requiredCategories.filter(cat => availableCategories.has(cat)),
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26]">Looks Predefinidos</h1>
        <p className="text-gray-500 mt-1">
          Combinações de looks para diferentes ocasiões
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar looks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
            aria-label="Buscar looks predefinidos"
          />
        </div>

        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
          aria-label="Filtrar por ocasião"
        >
          {occasions.map(occ => (
            <option key={occ} value={occ}>
              {occ === 'all' ? 'Todas as Ocasiões' : occ}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLooks.map(look => {
          const availability = checkAvailability(look.requiredCategories);
          return (
            <article
              key={look.id}
              className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-br from-[#FDE8EC] to-[#FFB6C1]/40 p-8 flex items-center justify-center aspect-video">
                <Sparkles className="text-[#FFB6C1]" size={48} aria-hidden="true" />
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-[#733D26] mb-1">{look.name}</h2>
                  <span className="inline-block bg-[#FDE8EC] text-[#733D26] text-xs px-3 py-1 rounded-full">
                    {look.occasion}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4">{look.description}</p>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#733D26] mb-2">Itens Necessários:</h3>
                  <ul className="space-y-1">
                    {look.requiredCategories.map(cat => {
                      const available = availability.available.includes(cat);
                      return (
                        <li
                          key={cat}
                          className={`text-sm flex items-center gap-2 ${
                            available ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          <span>{available ? '✓' : '✗'}</span>
                          {cat}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {availability.canCreate ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm font-medium">
                      ✓ Você pode criar este look!
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-3">
                    <p className="text-[#733D26] text-sm">
                      <strong>Faltando:</strong> {availability.missing.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filteredLooks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">Nenhum look encontrado para sua busca</p>
        </div>
      )}
    </div>
  );
}
