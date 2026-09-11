import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { storage } from '../utils/storage';
import { Heart, Edit, Trash2, Search, PlusCircle } from 'lucide-react';

export function ClothingInterface() {
  const [items, setItems] = useState(() => storage.getItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['all', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryColor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  const toggleFavorite = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      storage.updateItem(id, { isFavorite: !item.isFavorite });
      setItems(storage.getItems());
    }
  };

  const deleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta peça?')) {
      storage.deleteItem(id);
      setItems(storage.getItems());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Meu Guarda-Roupa</h1>
          <p className="text-gray-500 mt-1">{filteredItems.length} peças</p>
        </div>
        <Link
          to="/app/add-item"
          className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]"
        >
          <PlusCircle size={20} aria-hidden="true" />
          Adicionar Peça
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar por categoria, tecido, cor ou tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
            aria-label="Buscar peças de roupa"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
          aria-label="Filtrar por categoria"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas as Categorias' : cat}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">
            {items.length === 0 ? 'Seu guarda-roupa está vazio' : 'Nenhuma peça encontrada'}
          </p>
          <Link
            to="/app/add-item"
            className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]"
          >
            <PlusCircle size={20} aria-hidden="true" />
            Adicionar Primeira Peça
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <article
              key={item.id}
              className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-[#FDE8EC] relative">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={`${item.category} - ${item.primaryColor}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem foto
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={item.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  aria-pressed={item.isFavorite}
                >
                  <Heart
                    size={20}
                    className={item.isFavorite ? 'fill-[#FFB6C1] text-[#FFB6C1]' : 'text-gray-400'}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <span className="inline-block bg-[#FDE8EC] text-[#733D26] text-xs px-3 py-1 rounded-full font-medium">
                    {item.category}
                  </span>
                </div>

                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tecido:</dt>
                    <dd className="text-[#733D26] font-medium">{item.fabric}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cor:</dt>
                    <dd className="text-[#733D26] font-medium flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.primaryColor }}
                        aria-hidden="true"
                      />
                      {item.primaryColor}
                    </dd>
                  </div>
                  {item.pattern && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Estampa:</dt>
                      <dd className="text-[#733D26] font-medium">{item.pattern}</dd>
                    </div>
                  )}
                </dl>

                {item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500 bg-[#FAF9F6] px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/app/edit-item/${item.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-[#FDE8EC] transition-colors min-h-[44px]"
                    aria-label={`Editar ${item.category}`}
                  >
                    <Edit size={16} aria-hidden="true" />
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]"
                    aria-label={`Excluir ${item.category}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
