import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { storage } from '../utils/storage';
import { Upload, ArrowLeft, X } from 'lucide-react';

const CATEGORIES = ['Parte de Cima', 'Parte de Baixo', 'Vestido', 'Agasalho', 'Calçados', 'Acessórios', 'Outro'];
const FABRICS = ['Algodão', 'Poliéster', 'Lã', 'Seda', 'Jeans', 'Linho', 'Couro', 'Sintético', 'Outro'];
const PATTERNS = ['Liso', 'Listrado', 'Poá', 'Floral', 'Xadrez', 'Animal Print', 'Geométrico', 'Outro'];

export function ItemRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState('Parte de Cima');
  const [fabric, setFabric] = useState('Algodão');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [pattern, setPattern] = useState('Liso');
  const [customPattern, setCustomPattern] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const item = storage.getItems().find(i => i.id === id);
      if (item) {
        setPhotoUrl(item.photoUrl);
        setCategory(item.category);
        setFabric(item.fabric);
        setPrimaryColor(item.primaryColor);
        setSecondaryColor(item.secondaryColor || '');
        const itemPattern = item.pattern || 'Liso';
        if (!PATTERNS.includes(itemPattern)) {
          setPattern('Outro');
          setCustomPattern(itemPattern);
        } else {
          setPattern(itemPattern);
        }
        setTags(item.tags);
      }
    }
  }, [isEditing, id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPattern = pattern === 'Outro' ? customPattern : pattern;

    const itemData = {
      photoUrl,
      category,
      fabric,
      primaryColor,
      secondaryColor,
      pattern: finalPattern,
      tags,
      isFavorite: false,
    };

    if (isEditing && id) {
      storage.updateItem(id, itemData);
    } else {
      storage.addItem(itemData);
    }

    navigate('/app/closet');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-4 min-h-[44px]"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-[#733D26]">
          {isEditing ? 'Editar Peça' : 'Adicionar Nova Peça'}
        </h1>
        <p className="text-gray-500 mt-1">
          Preencha os detalhes sobre sua peça de roupa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-pink-100 rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-[#733D26] mb-2">
            Foto
          </label>
          <div className="space-y-4">
            {photoUrl && (
              <div className="relative w-full aspect-square max-w-sm bg-[#FDE8EC] rounded-lg overflow-hidden">
                <img
                  src={photoUrl}
                  alt="Prévia da peça"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remover foto"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-[#FFB6C1] rounded-lg hover:border-[#F4A7B9] cursor-pointer transition-colors min-h-[44px]">
              <Upload size={20} aria-hidden="true" />
              <span>{photoUrl ? 'Alterar Foto' : 'Enviar Foto'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
                aria-label="Enviar foto da peça"
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#733D26] mb-2">
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
            required
            aria-required="true"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="fabric" className="block text-sm font-medium text-[#733D26] mb-2">
            Tecido <span className="text-red-500">*</span>
          </label>
          <select
            id="fabric"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
            required
            aria-required="true"
          >
            {FABRICS.map(fab => (
              <option key={fab} value={fab}>{fab}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-[#733D26] mb-2">
              Cor Principal <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-8 border border-gray-200 rounded cursor-pointer"
                  required
                  aria-required="true"
                />
              </div>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
                placeholder="#000000"
                aria-label="Código hex da cor principal"
              />
            </div>
          </div>

          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-[#733D26] mb-2">
              Cor Secundária (Opcional)
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: secondaryColor || '#ffffff' }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  id="secondaryColor"
                  value={secondaryColor || '#ffffff'}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-8 border border-gray-200 rounded cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
                placeholder="#ffffff"
                aria-label="Código hex da cor secundária"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-[#733D26] mb-2">
            Estampa
          </label>
          <select
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
          >
            {PATTERNS.map(pat => (
              <option key={pat} value={pat}>{pat}</option>
            ))}
          </select>
          {pattern === 'Outro' && (
            <div className="mt-3">
              <label htmlFor="customPattern" className="block text-sm font-medium text-[#733D26] mb-2">
                Descreva a estampa
              </label>
              <input
                type="text"
                id="customPattern"
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
                placeholder="ex: Estampa tropical, Tie-dye, etc."
                aria-label="Estampa personalizada"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-[#733D26] mb-2">
            Tags (Opcional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px]"
              placeholder="ex: casual, verão, vintage"
              aria-label="Adicionar tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-3 bg-[#733D26] text-white rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]"
            >
              Adicionar
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 min-h-[24px] min-w-[24px] flex items-center justify-center"
                    aria-label={`Remover tag ${tag}`}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-[#FAF9F6] transition-colors min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#733D26] text-white rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] font-medium"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Peça'}
          </button>
        </div>
      </form>
    </div>
  );
}
