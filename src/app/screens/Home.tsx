import { Link } from 'react-router';
import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import { storage } from '../utils/storage';
import { ShirtIcon, Sparkles, TrendingUp, Heart, Calendar } from 'lucide-react';
import { useMemo } from 'react';

export function Home() {
  const user = storage.getUser();
  const items = storage.getItems();
  const looks = storage.getLooks();

  const stats = useMemo(() => {
    const favoriteItems = items.filter(item => item.isFavorite).length;
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
        <StatCard
          value={stats.totalItems}
          title="Total de Peças"
          icon={<ShirtIcon className="text-[#733D26]" size={24} aria-hidden="true" />}
          link="/app/closet"
          linkText="Ver Guarda-Roupa →"
        />
        <StatCard
          value={stats.totalLooks}
          title="Looks Salvos"
          icon={<Sparkles className="text-[#733D26]" size={24} aria-hidden="true" />}
          link="/app/looks"
          linkText="Ver Looks →"
        />
        <StatCard
          value={stats.favoriteItems}
          title="Peças Favoritas"
          icon={<Heart className="text-[#733D26]" size={24} aria-hidden="true" />}
        />
        <StatCard
          value={stats.recentItems}
          title="Adicionado Esta Semana"
          icon={<Calendar className="text-[#733D26]" size={24} aria-hidden="true" />}
        />
        <StatCard
          value={stats.topCategory}
          title="Categoria Principal"
          icon={<TrendingUp className="text-[#733D26]" size={24} aria-hidden="true" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="Adicionar Nova Peça"
          description="Cadastre uma nova peça no seu guarda-roupa"
          link="/app/add-item"
          filled
        />
        <ActionCard
          title="Criar Look"
          description="Combine suas peças para criar novos outfits"
          link="/app/look-builder"
        />
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
