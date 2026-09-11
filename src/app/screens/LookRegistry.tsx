import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { storage } from '../utils/storage';
import { Heart, Trash2, Search, Sparkles, Filter } from 'lucide-react';

export function LookRegistry() {
  const [looks, setLooks] = useState(() => storage.getLooks());
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('all');

  const allItems = storage.getItems();

  const occasions = useMemo(() => {
    const occ = new Set(looks.map(look => look.occasion));
    return ['all', ...Array.from(occ)];
  }, [looks]);

  const filteredLooks = useMemo(() => {
    return looks.filter(look => {
      const matchesSearch = look.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        look.occasion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOccasion = occasionFilter === 'all' || look.occasion === occasionFilter;

      return matchesSearch && matchesOccasion;
    });
  }, [looks, searchQuery, occasionFilter]);

  const toggleFavorite = (id: string) => {
    const look = looks.find(l => l.id === id);
    if (look) {
      storage.updateLook(id, { isFavorite: !look.isFavorite });
      setLooks(storage.getLooks());
    }
  };

  const deleteLook = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este look?')) {
      storage.deleteLook(id);
      setLooks(storage.getLooks());
    }
  };

  const getLookItems = (look: any) => {
    return look.items
      .map((itemId: string) => allItems.find(item => item.id === itemId))
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Meus Looks</h1>
          <p className="text-gray-500 mt-1">{filteredLooks.length} looks salvos</p>
        </div>
        <Link
          to="/app/look-builder"
          className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]"
        >
          <Sparkles size={20} aria-hidden="true" />
          Criar Novo Look
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar looks por nome ou ocasião..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
            aria-label="Buscar looks"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" aria-hidden="true" />
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
      </div>

      {filteredLooks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">
            {looks.length === 0 ? 'Nenhum look salvo ainda' : 'Nenhum look encontrado'}
          </p>
          <Link
            to="/app/look-builder"
            className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]"
          >
            <Sparkles size={20} aria-hidden="true" />
            Criar Primeiro Look
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map(look => {
            const lookItems = getLookItems(look);
            return (
              <article
                key={look.id}
                className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-[#FDE8EC] p-4 relative">
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {lookItems.slice(0, 3).map(item => (
                      <div key={item.id} className="bg-white rounded border border-pink-100 overflow-hidden">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.category}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {item.category}
                          </div>
                        )}
                      </div>
                    ))}
                    {lookItems.length > 3 && (
                      <div className="bg-[#733D26] text-white rounded flex items-center justify-center text-sm font-medium">
                        +{lookItems.length - 3}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(look.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={look.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-pressed={look.isFavorite}
                  >
                    <Heart
                      size={20}
                      className={look.isFavorite ? 'fill-[#FFB6C1] text-[#FFB6C1]' : 'text-gray-400'}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-[#733D26]">{look.name}</h2>
                    <span className="inline-block mt-2 bg-[#FDE8EC] text-[#733D26] text-xs px-3 py-1 rounded-full">
                      {look.occasion}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {lookItems.length} {lookItems.length === 1 ? 'peça' : 'peças'}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      to={`/app/look-builder?edit=${look.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-[#FDE8EC] transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => deleteLook(look.id)}
                      className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] flex items-center justify-center"
                      aria-label={`Excluir ${look.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
