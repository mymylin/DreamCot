import { useMemo } from 'react';
import { storage } from '../utils/storage';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const CURRENT_TRENDS = [
  {
    id: 'minimalist-neutral',
    name: 'Neutros Minimalistas',
    description: 'Linhas limpas e cores neutras (preto, branco, bege, cinza)',
    matchCriteria: {
      colors: ['#000000', '#FFFFFF', '#F5F5DC', '#808080', '#D3D3D3'],
      patterns: ['Liso'],
    },
  },
  {
    id: 'earth-tones',
    name: 'Tons Terrosos',
    description: 'Cores naturais inspiradas na natureza (marrom, oliva, terracota)',
    matchCriteria: {
      colors: ['#8B4513', '#556B2F', '#CD5C5C', '#D2691E'],
    },
  },
  {
    id: 'athleisure',
    name: 'Athleisure',
    description: 'Estilo esportivo e casual com tecidos confortáveis',
    matchCriteria: {
      categories: ['Parte de Cima', 'Parte de Baixo'],
      fabrics: ['Poliéster', 'Sintético'],
    },
  },
  {
    id: 'vintage-revival',
    name: 'Revival Vintage',
    description: 'Estampas retrô e silhuetas clássicas',
    matchCriteria: {
      patterns: ['Floral', 'Poá', 'Xadrez'],
    },
  },
  {
    id: 'monochrome',
    name: 'Monocromático',
    description: 'Looks em uma única cor para visual elegante',
    matchCriteria: {
      colors: ['#000000', '#FFFFFF', '#000080'],
    },
  },
  {
    id: 'sustainable-denim',
    name: 'Jeans Sustentável',
    description: 'Peças clássicas de jeans em estilos versáteis',
    matchCriteria: {
      fabrics: ['Jeans'],
    },
  },
  {
    id: 'bold-patterns',
    name: 'Estampas Marcantes',
    description: 'Peças destaque com estampas chamativas',
    matchCriteria: {
      patterns: ['Animal Print', 'Geométrico', 'Listrado'],
    },
  },
  {
    id: 'luxury-basics',
    name: 'Básicos de Luxo',
    description: 'Tecidos nobres em estilos atemporais',
    matchCriteria: {
      fabrics: ['Seda', 'Lã', 'Linho', 'Couro'],
    },
  },
];

export function TrendMatcher() {
  const items = storage.getItems();

  const trendMatches = useMemo(() => {
    return CURRENT_TRENDS.map(trend => {
      const matchingItems = items.filter(item => {
        let matches = true;

        if (trend.matchCriteria.colors) {
          const colorMatch = trend.matchCriteria.colors.some(trendColor => {
            return item.primaryColor.toLowerCase() === trendColor.toLowerCase() ||
              item.secondaryColor?.toLowerCase() === trendColor.toLowerCase();
          });
          if (!colorMatch) return false;
        }

        if (trend.matchCriteria.patterns) {
          if (!item.pattern || !trend.matchCriteria.patterns.includes(item.pattern)) {
            return false;
          }
        }

        if (trend.matchCriteria.fabrics) {
          if (!trend.matchCriteria.fabrics.includes(item.fabric)) {
            return false;
          }
        }

        if (trend.matchCriteria.categories) {
          if (!trend.matchCriteria.categories.includes(item.category)) {
            return false;
          }
        }

        return matches;
      });

      return {
        trend,
        matchingItems,
        matchCount: matchingItems.length,
        isMatching: matchingItems.length > 0,
      };
    });
  }, [items]);

  const matchingTrends = trendMatches.filter(t => t.isMatching);
  const potentialTrends = trendMatches.filter(t => !t.isMatching);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3">
          <TrendingUp className="text-[#FFB6C1]" aria-hidden="true" />
          Combinador de Tendências
        </h1>
        <p className="text-gray-500 mt-1">
          Veja quais tendências de moda correspondem ao seu guarda-roupa atual
        </p>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">Sobre Este Recurso</h2>
        <p className="text-gray-600">
          Esta ferramenta mostra quais tendências você já segue, provando que não é preciso comprar
          novos itens para estar na moda. Aproveite o que você já tem!
        </p>
      </div>

      {matchingTrends.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">
            Tendências que Você Está Arrasando ({matchingTrends.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchingTrends.map(({ trend, matchingItems }) => (
              <div
                key={trend.id}
                className="bg-white border-2 border-[#FFB6C1] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#FFB6C1] text-[#733D26] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={24} aria-hidden="true" />
                    <h3 className="text-xl font-semibold">{trend.name}</h3>
                  </div>
                  <p className="text-[#733D26]/80">{trend.description}</p>
                </div>

                <div className="p-6">
                  <p className="text-[#733D26] font-medium mb-4">
                    {matchingItems.length} {matchingItems.length === 1 ? 'peça correspondente' : 'peças correspondentes'} no seu guarda-roupa
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {matchingItems.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        className="aspect-square bg-[#FDE8EC] rounded border border-pink-100 overflow-hidden"
                      >
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.category}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                            {item.category}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {matchingItems.length > 6 && (
                    <p className="text-sm text-gray-500 mt-3">
                      +{matchingItems.length - 6} mais peças
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {potentialTrends.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">
            Tendências para Explorar ({potentialTrends.length})
          </h2>
          <p className="text-gray-500 mb-6">
            Essas tendências ainda não correspondem ao seu guarda-roupa. Antes de comprar novas peças,
            verifique se você consegue criar looks similares com o que já tem!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {potentialTrends.map(({ trend }) => (
              <div
                key={trend.id}
                className="bg-white border border-pink-100 rounded-lg overflow-hidden"
              >
                <div className="bg-[#FAF9F6] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="text-gray-300" size={24} aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-[#733D26]">{trend.name}</h3>
                  </div>
                  <p className="text-gray-500">{trend.description}</p>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    Nenhuma peça correspondente no seu guarda-roupa ainda.
                  </p>
                  {trend.matchCriteria.colors && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Cores Principais:</p>
                      <div className="flex gap-2 flex-wrap">
                        {trend.matchCriteria.colors.map(color => (
                          <span
                            key={color}
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            aria-label={`Cor ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {trend.matchCriteria.fabrics && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Tecidos Principais:</p>
                      <div className="flex gap-2 flex-wrap">
                        {trend.matchCriteria.fabrics.map(fabric => (
                          <span
                            key={fabric}
                            className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-xs"
                          >
                            {fabric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {trend.matchCriteria.patterns && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Estampas Principais:</p>
                      <div className="flex gap-2 flex-wrap">
                        {trend.matchCriteria.patterns.map(pattern => (
                          <span
                            key={pattern}
                            className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-xs"
                          >
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Lembrete de Moda Consciente</h2>
        <p className="text-gray-600">
          As tendências vêm e vão, mas seu estilo pessoal é atemporal. Antes de seguir uma nova tendência,
          avalie se ela realmente se alinha com seu guarda-roupa e estilo de vida. Muitas vezes você pode
          criar looks na moda combinando suas peças atuais de novas formas!
        </p>
      </div>
    </div>
  );
}
