import { useMemo } from 'react';
import { storage } from '../utils/storage';
import { Heart, Sparkles, TrendingUp } from 'lucide-react';

export function StyleAssistant() {
  const items = storage.getItems();
  const looks = storage.getLooks();

  const styleProfile = useMemo(() => {
    const favoriteItems = items.filter(item => item.isFavorite);
    const favoriteLooks = looks.filter(look => look.isFavorite);

    const categoryCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};
    const fabricCount: Record<string, number> = {};
    const patternCount: Record<string, number> = {};

    favoriteItems.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      colorCount[item.primaryColor] = (colorCount[item.primaryColor] || 0) + 1;
      fabricCount[item.fabric] = (fabricCount[item.fabric] || 0) + 1;
      if (item.pattern) {
        patternCount[item.pattern] = (patternCount[item.pattern] || 0) + 1;
      }
    });

    const sortByCount = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const topCategories = sortByCount(categoryCount);
    const topColors = sortByCount(colorCount);
    const topFabrics = sortByCount(fabricCount);
    const topPatterns = sortByCount(patternCount);

    const occasionCount: Record<string, number> = {};
    favoriteLooks.forEach(look => {
      occasionCount[look.occasion] = (occasionCount[look.occasion] || 0) + 1;
    });
    const topOccasions = sortByCount(occasionCount);

    return {
      topCategories,
      topColors,
      topFabrics,
      topPatterns,
      topOccasions,
      totalFavorites: favoriteItems.length,
    };
  }, [items, looks]);

  const styleInsights = useMemo(() => {
    const insights: string[] = [];

    if (styleProfile.topCategories.length > 0) {
      const topCat = styleProfile.topCategories[0][0];
      insights.push(`Você adora peças do tipo "${topCat.toLowerCase()}" — elas representam uma grande parte dos seus favoritos.`);
    }

    if (styleProfile.topColors.length > 0) {
      const topColor = styleProfile.topColors[0][0];
      insights.push(`${topColor} é sua cor favorita, aparecendo frequentemente nas suas peças preferidas.`);
    }

    if (styleProfile.topFabrics.length > 0) {
      const topFabric = styleProfile.topFabrics[0][0];
      insights.push(`Você prefere tecidos de ${topFabric.toLowerCase()} por conforto e estilo.`);
    }

    if (styleProfile.topOccasions.length > 0) {
      const topOccasion = styleProfile.topOccasions[0][0];
      insights.push(`Sua ocasião preferida é "${topOccasion}" — você tem ótimos looks prontos para ela!`);
    }

    if (styleProfile.totalFavorites === 0) {
      insights.push('Comece a marcar peças como favoritas para construir seu perfil de estilo pessoal!');
    }

    return insights;
  }, [styleProfile]);

  const styleRecommendations = useMemo(() => {
    const recommendations: string[] = [];

    if (styleProfile.topColors.length >= 2) {
      const color1 = styleProfile.topColors[0][0];
      const color2 = styleProfile.topColors[1][0];
      recommendations.push(`Experimente combinar ${color1} com ${color2} para um look harmonioso com base nas suas cores favoritas.`);
    }

    if (styleProfile.topCategories.length > 0) {
      const hasAccessories = items.some(item => item.category === 'Acessórios');
      if (!hasAccessories) {
        recommendations.push('Considere adicionar acessórios para elevar seus outfits favoritos.');
      }
    }

    const categoryVariety = new Set(items.map(item => item.category)).size;
    if (categoryVariety < 4) {
      recommendations.push('Expandir as categorias do seu guarda-roupa pode criar combinações de looks mais versáteis.');
    }

    if (looks.length < 5) {
      recommendations.push('Crie mais looks salvos para maximizar o potencial do seu guarda-roupa atual.');
    }

    return recommendations;
  }, [styleProfile, items, looks]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3">
          <Sparkles className="text-[#FFB6C1]" aria-hidden="true" />
          Assistente de Estilo
        </h1>
        <p className="text-gray-500 mt-1">Descubra seu estilo pessoal com base nos seus favoritos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-pink-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#733D26] mb-4 flex items-center gap-2">
            <Heart className="text-[#FFB6C1]" size={24} aria-hidden="true" />
            Seu Perfil de Estilo
          </h2>
          <div className="space-y-4">
            {styleProfile.totalFavorites === 0 ? (
              <p className="text-gray-500">
                Marque peças e looks como favoritos para gerar seu perfil de estilo personalizado.
              </p>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium text-[#733D26] mb-2">Categorias Principais</h3>
                  <ul className="space-y-2">
                    {styleProfile.topCategories.map(([category, count]) => (
                      <li key={category} className="flex justify-between items-center">
                        <span className="text-gray-700">{category}</span>
                        <span className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm font-medium">
                          {count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#733D26] mb-2">Cores Favoritas</h3>
                  <div className="space-y-2">
                    {styleProfile.topColors.map(([color, count]) => (
                      <div key={color} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                          />
                          <span className="text-gray-700">{color}</span>
                        </div>
                        <span className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm font-medium">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {styleProfile.topFabrics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#733D26] mb-2">Tecidos Preferidos</h3>
                    <ul className="space-y-2">
                      {styleProfile.topFabrics.map(([fabric, count]) => (
                        <li key={fabric} className="flex justify-between items-center">
                          <span className="text-gray-700">{fabric}</span>
                          <span className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm font-medium">
                            {count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {styleProfile.topOccasions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#733D26] mb-2">Ocasiões Favoritas</h3>
                    <ul className="space-y-2">
                      {styleProfile.topOccasions.map(([occasion, count]) => (
                        <li key={occasion} className="flex justify-between items-center">
                          <span className="text-gray-700">{occasion}</span>
                          <span className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm font-medium">
                            {count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#733D26] mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#733D26]" size={24} aria-hidden="true" />
              Insights de Estilo
            </h2>
            {styleInsights.length === 0 ? (
              <p className="text-gray-600">
                Adicione mais favoritos para desbloquear insights de estilo personalizados.
              </p>
            ) : (
              <ul className="space-y-3">
                {styleInsights.map((insight, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-[#FFB6C1] font-bold">•</span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">Recomendações</h2>
            {styleRecommendations.length === 0 ? (
              <p className="text-gray-500">
                Continue construindo seu guarda-roupa para receber recomendações personalizadas.
              </p>
            ) : (
              <ul className="space-y-3">
                {styleRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-[#FFB6C1] font-bold">→</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Dica de Estilo Sustentável</h2>
        <p className="text-gray-600">
          Entender seu estilo pessoal ajuda a fazer compras mais intencionais. Em vez de comprar
          peças da moda passageira, foque em peças que se alinhem com suas preferências estabelecidas
          — elas serão mais usadas e reduzirão o desperdício da moda.
        </p>
      </div>
    </div>
  );
}
