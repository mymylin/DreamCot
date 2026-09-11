import { useState, useMemo } from 'react';
import { storage } from '../utils/storage';
import { Filter, X } from 'lucide-react';

export function Filters() {
  const allItems = storage.getItems();
  const allLooks = storage.getLooks();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);

  const filters = useMemo(() => {
    const categories = new Set(allItems.map(item => item.category));
    const fabrics = new Set(allItems.map(item => item.fabric));
    const colors = new Set(allItems.map(item => item.primaryColor));
    const patterns = new Set(allItems.map(item => item.pattern).filter(Boolean));

    return {
      categories: Array.from(categories).sort(),
      fabrics: Array.from(fabrics).sort(),
      colors: Array.from(colors).sort(),
      patterns: Array.from(patterns).sort(),
    };
  }, [allItems]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }
      if (selectedFabrics.length > 0 && !selectedFabrics.includes(item.fabric)) {
        return false;
      }
      if (selectedColors.length > 0 && !selectedColors.includes(item.primaryColor)) {
        return false;
      }
      if (selectedPatterns.length > 0 && item.pattern && !selectedPatterns.includes(item.pattern)) {
        return false;
      }
      if (isFavoriteOnly && !item.isFavorite) {
        return false;
      }
      return true;
    });
  }, [allItems, selectedCategories, selectedFabrics, selectedColors, selectedPatterns, isFavoriteOnly]);

  const filteredLooks = useMemo(() => {
    return allLooks.filter(look => {
      const lookItems = look.items
        .map(itemId => allItems.find(item => item.id === itemId))
        .filter(Boolean);

      if (selectedCategories.length > 0) {
        const hasRequiredCategories = selectedCategories.every(cat =>
          lookItems.some(item => item.category === cat)
        );
        if (!hasRequiredCategories) return false;
      }

      if (isFavoriteOnly && !look.isFavorite) {
        return false;
      }

      return true;
    });
  }, [allLooks, allItems, selectedCategories, isFavoriteOnly]);

  const toggleFilter = (
    filterArray: string[],
    setFilterArray: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(v => v !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedPatterns([]);
    setIsFavoriteOnly(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedFabrics.length > 0 ||
    selectedColors.length > 0 ||
    selectedPatterns.length > 0 ||
    isFavoriteOnly;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Filtros Avançados</h1>
          <p className="text-gray-500 mt-1">Filtre suas peças e looks por atributos</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-[#FDE8EC] transition-colors min-h-[44px]"
          >
            <X size={20} aria-hidden="true" />
            Limpar Tudo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-pink-100 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-[#733D26] mb-3 flex items-center gap-2">
                <Filter size={20} aria-hidden="true" />
                Opções de Filtro
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={isFavoriteOnly}
                      onChange={(e) => setIsFavoriteOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]"
                    />
                    <span className="text-sm font-medium text-[#733D26]">Somente Favoritos</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#733D26] mb-3">Categorias</h3>
              <div className="space-y-2">
                {filters.categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#733D26] mb-3">Tecidos</h3>
              <div className="space-y-2">
                {filters.fabrics.map(fabric => (
                  <label key={fabric} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(fabric)}
                      onChange={() => toggleFilter(selectedFabrics, setSelectedFabrics, fabric)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]"
                    />
                    <span className="text-sm text-gray-700">{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#733D26] mb-3">Estampas</h3>
              <div className="space-y-2">
                {filters.patterns.map(pattern => (
                  <label key={pattern} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={selectedPatterns.includes(pattern)}
                      onChange={() => toggleFilter(selectedPatterns, setSelectedPatterns, pattern)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]"
                    />
                    <span className="text-sm text-gray-700">{pattern}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#733D26] mb-3">Cores</h3>
              <div className="grid grid-cols-2 gap-2">
                {filters.colors.map(color => (
                  <label
                    key={color}
                    className="flex items-center gap-2 p-2 border border-pink-100 rounded-lg cursor-pointer hover:bg-[#FDE8EC] transition-colors min-h-[44px]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleFilter(selectedColors, setSelectedColors, color)}
                      className="w-4 h-4 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]"
                    />
                    <span
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">
              Peças Filtradas ({filteredItems.length})
            </h2>
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-pink-100 rounded-lg p-12 text-center">
                <p className="text-gray-500">Nenhuma peça corresponde aos filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-[#FDE8EC]">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={`${item.category} - ${item.primaryColor}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          Sem foto
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-[#733D26] truncate">{item.category}</p>
                      <p className="text-xs text-gray-500 truncate">{item.fabric}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">
              Looks Filtrados ({filteredLooks.length})
            </h2>
            {filteredLooks.length === 0 ? (
              <div className="bg-white border border-pink-100 rounded-lg p-12 text-center">
                <p className="text-gray-500">Nenhum look corresponde aos filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredLooks.map(look => (
                  <div
                    key={look.id}
                    className="bg-white border border-pink-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-[#733D26] mb-1">{look.name}</h3>
                    <p className="text-sm text-gray-500">{look.occasion}</p>
                    <p className="text-xs text-gray-400 mt-2">{look.items.length} peças</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
