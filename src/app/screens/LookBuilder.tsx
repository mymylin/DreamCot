import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { storage } from '../utils/storage';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';

const ItemTypes = {
  CLOTHING_ITEM: 'clothing_item',
};

interface ClothingItemCardProps {
  item: any;
  onAdd: () => void;
}

function ClothingItemCard({ item, onAdd }: ClothingItemCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CLOTHING_ITEM,
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white border border-pink-100 rounded-lg overflow-hidden cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
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
      <div className="p-2">
        <p className="text-xs font-medium text-[#733D26] truncate">{item.category}</p>
        <button
          onClick={onAdd}
          className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#733D26] text-white rounded text-xs hover:bg-[#8B4A30] transition-colors min-h-[32px]"
        >
          <Plus size={14} aria-hidden="true" />
          Adicionar
        </button>
      </div>
    </div>
  );
}

interface CanvasItemProps {
  item: any;
  onRemove: () => void;
}

function CanvasItem({ item, onRemove }: CanvasItemProps) {
  return (
    <div className="relative bg-white border-2 border-[#FFB6C1] rounded-lg overflow-hidden">
      <div className="aspect-square bg-[#FDE8EC]">
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
      </div>
      <div className="p-2">
        <p className="text-sm font-medium text-[#733D26] truncate">{item.category}</p>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
        aria-label={`Remover ${item.category}`}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function LookBuilderContent() {
  const navigate = useNavigate();
  const allItems = storage.getItems();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [lookName, setLookName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(allItems.map(item => item.category));
    return ['all', ...Array.from(cats)];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return allItems;
    return allItems.filter(item => item.category === categoryFilter);
  }, [allItems, categoryFilter]);

  const selectedItems = selectedItemIds
    .map(id => allItems.find(item => item.id === id))
    .filter(Boolean);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CLOTHING_ITEM,
    drop: (item: { id: string }) => {
      if (!selectedItemIds.includes(item.id)) {
        setSelectedItemIds([...selectedItemIds, item.id]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addItem = (itemId: string) => {
    if (!selectedItemIds.includes(itemId)) {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
  };

  const saveLook = () => {
    if (!lookName.trim()) {
      alert('Por favor, insira um nome para este look');
      return;
    }

    if (selectedItemIds.length === 0) {
      alert('Por favor, adicione pelo menos uma peça a este look');
      return;
    }

    storage.addLook({
      name: lookName,
      occasion: occasion || 'Dia a Dia',
      items: selectedItemIds,
      isFavorite: false,
    });

    navigate('/app/looks');
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-4 min-h-[44px]"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-[#733D26]">Criador de Look</h1>
        <p className="text-gray-500 mt-1">
          Arraste peças do seu guarda-roupa ou clique em "Adicionar" para criar seu look
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div
            ref={drop}
            className={`min-h-[400px] bg-white border-2 border-dashed rounded-lg p-6 transition-colors ${
              isOver ? 'border-[#FFB6C1] bg-[#FDE8EC]/30' : 'border-pink-200'
            }`}
          >
            <h2 className="text-lg font-semibold text-[#733D26] mb-4">Canvas do Look</h2>
            {selectedItems.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                Arraste peças aqui ou clique em "Adicionar" para começar
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedItems.map(item => (
                  <CanvasItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-pink-100 rounded-lg p-6 space-y-4">
            <div>
              <label htmlFor="lookName" className="block text-sm font-medium text-[#733D26] mb-2">
                Nome do Look <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lookName"
                value={lookName}
                onChange={(e) => setLookName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
                placeholder="ex: Sexta Casual, Saída à Noite"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-[#733D26] mb-2">
                Ocasião
              </label>
              <input
                type="text"
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
                placeholder="ex: Trabalho, Casual, Formal"
              />
            </div>

            <button
              onClick={saveLook}
              className="w-full flex items-center justify-center gap-2 bg-[#733D26] text-white py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] font-medium"
            >
              <Save size={20} aria-hidden="true" />
              Salvar Look
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-pink-100 rounded-lg p-4">
            <h2 className="font-semibold text-[#733D26] mb-3">Seu Guarda-Roupa</h2>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white mb-4"
              aria-label="Filtrar peças por categoria"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas as Peças' : cat}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {filteredItems.map(item => (
                <ClothingItemCard
                  key={item.id}
                  item={item}
                  onAdd={() => addItem(item.id)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">
                Nenhuma peça nesta categoria
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LookBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LookBuilderContent />
    </DndProvider>
  );
}
