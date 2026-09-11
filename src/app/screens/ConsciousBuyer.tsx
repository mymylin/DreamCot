import { useMemo } from 'react';
import { storage } from '../utils/storage';
import { ShoppingBag, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

export function ConsciousBuyer() {
  const items = storage.getItems();
  const looks = storage.getLooks();

  const analysis = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};
    const fabricCount: Record<string, number> = {};

    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      colorCount[item.primaryColor] = (colorCount[item.primaryColor] || 0) + 1;
      fabricCount[item.fabric] = (fabricCount[item.fabric] || 0) + 1;
    });

    const allCategories = ['Parte de Cima', 'Parte de Baixo', 'Vestido', 'Agasalho', 'Calçados', 'Acessórios'];
    const missingCategories = allCategories.filter(cat => !categoryCount[cat]);
    const underrepresentedCategories = allCategories.filter(
      cat => categoryCount[cat] === 1
    );

    const overloadedCategories = Object.entries(categoryCount)
      .filter(([_, count]) => count > 10)
      .map(([category, count]) => ({ category, count }));

    const versatileColors = Object.entries(colorCount)
      .filter(([_, count]) => count >= 3)
      .map(([color]) => color);

    const itemsPerLook = looks.length > 0 ? items.length / looks.length : 0;

    return {
      missingCategories,
      underrepresentedCategories,
      overloadedCategories,
      versatileColors,
      itemsPerLook,
      totalItems: items.length,
      totalLooks: looks.length,
    };
  }, [items, looks]);

  const recommendations = useMemo(() => {
    const recs: Array<{
      type: 'warning' | 'success' | 'info';
      title: string;
      message: string;
    }> = [];

    if (analysis.overloadedCategories.length > 0) {
      analysis.overloadedCategories.forEach(({ category, count }) => {
        recs.push({
          type: 'warning',
          title: `Muitas Peças de ${category}`,
          message: `Você tem ${count} peças de ${category.toLowerCase()}. Avalie se realmente precisa de mais antes de comprar.`,
        });
      });
    }

    if (analysis.missingCategories.length > 0) {
      const category = analysis.missingCategories[0];
      recs.push({
        type: 'info',
        title: `Categoria Faltando: ${category}`,
        message: `Você não tem nenhuma peça de ${category.toLowerCase()}. Pode ser uma adição estratégica para ampliar suas combinações de looks.`,
      });
    }

    if (analysis.underrepresentedCategories.length > 0) {
      const category = analysis.underrepresentedCategories[0];
      recs.push({
        type: 'info',
        title: `Poucas Opções de ${category}`,
        message: `Você tem apenas 1 peça de ${category.toLowerCase()}. Avalie se uma peça versátil a mais aumentaria significativamente suas combinações.`,
      });
    }

    if (analysis.versatileColors.length > 0) {
      recs.push({
        type: 'success',
        title: 'Ótima Coordenação de Cores!',
        message: `Você tem várias peças em cores versáteis, facilitando a combinação. Priorize essas cores nas próximas compras.`,
      });
    }

    if (analysis.totalLooks < 5 && analysis.totalItems > 10) {
      recs.push({
        type: 'warning',
        title: 'Guarda-Roupa Subutilizado',
        message: `Você tem ${analysis.totalItems} peças mas apenas ${analysis.totalLooks} looks salvos. Tente criar mais combinações antes de comprar novos itens!`,
      });
    }

    if (analysis.totalItems > 50) {
      recs.push({
        type: 'warning',
        title: 'Guarda-Roupa Grande',
        message: `Com ${analysis.totalItems} peças, você provavelmente tem tudo que precisa. Foque em aproveitar o que já tem antes de adicionar mais.`,
      });
    }

    if (recs.length === 0) {
      recs.push({
        type: 'success',
        title: 'Guarda-Roupa Bem Equilibrado',
        message: 'Seu guarda-roupa parece bem equilibrado! Continue fazendo escolhas conscientes.',
      });
    }

    return recs;
  }, [analysis]);

  const gapAnalysis = useMemo(() => {
    const gaps: Array<{
      category: string;
      reason: string;
      impact: string;
    }> = [];

    if (analysis.missingCategories.includes('Agasalho') && analysis.totalItems > 5) {
      gaps.push({
        category: 'Agasalho',
        reason: 'Falta agasalho versátil',
        impact: 'Uma jaqueta neutra pode completar 5+ novos looks',
      });
    }

    if (analysis.missingCategories.includes('Acessórios') && analysis.totalItems > 10) {
      gaps.push({
        category: 'Acessórios',
        reason: 'Sem acessórios para elevar os looks',
        impact: 'Acessórios simples podem transformar os looks existentes',
      });
    }

    return gaps;
  }, [analysis]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3">
          <ShoppingBag className="text-[#FFB6C1]" aria-hidden="true" />
          Assistente de Compra Consciente
        </h1>
        <p className="text-gray-500 mt-1">
          Insights inteligentes para evitar o consumo excessivo e maximizar seu guarda-roupa
        </p>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3 flex items-center gap-2">
          <TrendingDown className="text-[#733D26]" size={24} aria-hidden="true" />
          Seu Impacto na Sustentabilidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#733D26]">
          <div>
            <p className="text-2xl font-bold">{analysis.totalItems}</p>
            <p className="text-sm text-gray-600">Peças no Guarda-Roupa</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{analysis.totalLooks}</p>
            <p className="text-sm text-gray-600">Looks Salvos</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {analysis.totalLooks > 0 ? Math.round(analysis.itemsPerLook * 10) / 10 : 0}
            </p>
            <p className="text-sm text-gray-600">Peças por Look</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Recomendações Inteligentes</h2>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => {
            const Icon = rec.type === 'warning' ? AlertCircle : rec.type === 'success' ? CheckCircle : AlertCircle;
            const bgColor = rec.type === 'warning' ? 'bg-orange-50 border-orange-200' :
              rec.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-[#FDE8EC] border-[#FFB6C1]';
            const textColor = rec.type === 'warning' ? 'text-orange-900' :
              rec.type === 'success' ? 'text-green-900' : 'text-[#733D26]';
            const iconColor = rec.type === 'warning' ? 'text-orange-600' :
              rec.type === 'success' ? 'text-green-600' : 'text-[#FFB6C1]';

            return (
              <div key={idx} className={`border rounded-lg p-6 ${bgColor}`}>
                <div className="flex gap-4">
                  <Icon className={iconColor} size={24} aria-hidden="true" />
                  <div>
                    <h3 className={`font-semibold mb-1 ${textColor}`}>{rec.title}</h3>
                    <p className={textColor}>{rec.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {gapAnalysis.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Análise Estratégica de Lacunas</h2>
          <p className="text-gray-500 mb-6">
            Se decidir comprar algo novo, estas peças teriam o maior impacto no seu guarda-roupa:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gapAnalysis.map((gap, idx) => (
              <div
                key={idx}
                className="bg-white border border-pink-100 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-[#733D26] mb-2">{gap.category}</h3>
                <p className="text-gray-700 mb-3">{gap.reason}</p>
                <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded p-3">
                  <p className="text-sm text-[#733D26]">
                    <strong>Impacto:</strong> {gap.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3">Antes de Comprar — Checklist</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-[#FFB6C1] font-bold">□</span>
            <span className="text-gray-700">
              Consigo criar um look similar com peças que já tenho?
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFB6C1] font-bold">□</span>
            <span className="text-gray-700">
              Esta peça combina com pelo menos 3 peças existentes no meu guarda-roupa?
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFB6C1] font-bold">□</span>
            <span className="text-gray-700">
              Esta compra está alinhada com meu perfil de estilo pessoal?
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFB6C1] font-bold">□</span>
            <span className="text-gray-700">
              Estou comprando porque realmente preciso, não apenas porque está na moda?
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFB6C1] font-bold">□</span>
            <span className="text-gray-700">
              Esperei pelo menos 24 horas para refletir sobre esta compra?
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-[#733D26] text-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-3">Lembre-se</h2>
        <p className="text-lg text-gray-300">
          A peça mais sustentável é aquela que você já possui. Cada vez que escolhe estilizar
          o que tem em vez de comprar algo novo, você gera um impacto ambiental positivo e
          economiza dinheiro.
        </p>
      </div>
    </div>
  );
}
