import { Link } from 'react-router';
import { storage } from '../utils/storage';
import { ShirtIcon, Sparkles, TrendingUp, Heart, Calendar } from 'lucide-react';
import { useMemo } from 'react';

export function Home() {
  const user = storage.getUser();
  const items = storage.getItems();
  const looks = storage.getLooks();

  const stats = useMemo(() => {
    const favoriteItems = items.filter(item => item.isFavorite).length;
    const favoriteLooks = looks.filter(look => look.isFavorite).length;
    const recentItems = items.filter(item => {
      const daysSinceAdded = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceAdded <= 7;
    }).length;

    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    return {
      totalItems: items.length,
      totalLooks: looks.length,
      favoriteItems,
      favoriteLooks,
      recentItems,
      topCategory: topCategory ? `${topCategory[0]} (${topCategory[1]})` : 'Nenhuma',
    };
  }, [items, looks]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] mb-2">
          Bem-vindo(a) de volta, {user?.name || 'Usuário'}!
        </h1>
        <p className="text-gray-500">Aqui está o resumo do seu guarda-roupa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FDE8EC] p-3 rounded-lg">
              <ShirtIcon className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#733D26]">{stats.totalItems}</p>
              <p className="text-sm text-gray-500">Total de Peças</p>
            </div>
          </div>
          <Link
            to="/app/closet"
            className="text-[#733D26] hover:text-[#FFB6C1] text-sm font-medium inline-flex items-center min-h-[44px]"
          >
            Ver Guarda-Roupa →
          </Link>
        </div>

        <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FDE8EC] p-3 rounded-lg">
              <Sparkles className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#733D26]">{stats.totalLooks}</p>
              <p className="text-sm text-gray-500">Looks Salvos</p>
            </div>
          </div>
          <Link
            to="/app/looks"
            className="text-[#733D26] hover:text-[#FFB6C1] text-sm font-medium inline-flex items-center min-h-[44px]"
          >
            Ver Looks →
          </Link>
        </div>

        <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FDE8EC] p-3 rounded-lg">
              <Heart className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#733D26]">{stats.favoriteItems}</p>
              <p className="text-sm text-gray-500">Peças Favoritas</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FDE8EC] p-3 rounded-lg">
              <Calendar className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#733D26]">{stats.recentItems}</p>
              <p className="text-sm text-gray-500">Adicionado Esta Semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#FDE8EC] p-3 rounded-lg">
              <TrendingUp className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#733D26]">{stats.topCategory}</p>
              <p className="text-sm text-gray-500">Categoria Principal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/app/add-item"
          className="bg-[#733D26] text-white rounded-lg p-8 hover:bg-[#8B4A30] transition-colors block"
        >
          <h2 className="text-xl font-bold mb-2">Adicionar Nova Peça</h2>
          <p className="text-gray-300">Cadastre uma nova peça no seu guarda-roupa</p>
        </Link>

        <Link
          to="/app/look-builder"
          className="bg-white border-2 border-[#FFB6C1] text-[#733D26] rounded-lg p-8 hover:bg-[#FDE8EC] transition-colors block"
        >
          <h2 className="text-xl font-bold mb-2">Criar Look</h2>
          <p className="text-gray-500">Combine suas peças para criar novos outfits</p>
        </Link>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Moda Consciente</h2>
        <p className="text-gray-600">
          Você está fazendo a diferença! Ao cuidar do seu guarda-roupa existente, você reduz
          o desperdício da moda e faz escolhas mais sustentáveis.
        </p>
        <Link
          to="/app/conscious-buyer"
          className="text-[#733D26] hover:underline text-sm font-medium inline-flex items-center mt-3 min-h-[44px]"
        >
          Ver Sugestões Inteligentes →
        </Link>
      </div>
    </div>
  );
}
