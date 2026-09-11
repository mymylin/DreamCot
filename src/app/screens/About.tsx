import { Link } from 'react-router';
import { Shirt, Heart, TrendingDown, Sparkles, Shield, Database } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#FFB6C1]/30 mb-4">
          <Shirt className="text-[#733D26]" size={64} aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
        <p className="text-xl text-gray-500 mt-2">Guarda-Roupa Digital Inteligente e Sustentável</p>
        <p className="text-sm text-gray-400 mt-1">Versão 1.0.0</p>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4 flex items-center gap-2">
          <Heart className="text-[#FFB6C1]" size={28} aria-hidden="true" />
          Nossa Missão
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          O DREAMCLOSET te ajuda a fazer escolhas de moda mais conscientes, aproveitando ao máximo
          o seu guarda-roupa existente. Acreditamos que o look mais sustentável é aquele que você
          já possui. Ao organizar, registrar e combinar inteligentemente suas peças, você pode
          reduzir o consumo excessivo enquanto descobre infinitas possibilidades de estilo.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-[#733D26] mb-6">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <div className="bg-[#FDE8EC] p-3 rounded-lg w-fit mb-4">
              <Database className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#733D26] mb-2">Inventário Digital</h3>
            <p className="text-gray-500">
              Catalogue cada peça do seu guarda-roupa com fotos, categorias, tecidos, cores e
              estampas. Saiba exatamente o que você tem para evitar compras duplicadas.
            </p>
          </div>

          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <div className="bg-[#FDE8EC] p-3 rounded-lg w-fit mb-4">
              <Sparkles className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#733D26] mb-2">Criador de Look</h3>
            <p className="text-gray-500">
              Crie e salve looks completos combinando suas peças. Planeje outfits para diferentes
              ocasiões e descubra novas combinações que você ainda não havia pensado.
            </p>
          </div>

          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <div className="bg-[#FDE8EC] p-3 rounded-lg w-fit mb-4">
              <TrendingDown className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#733D26] mb-2">Combinador de Tendências</h3>
            <p className="text-gray-500">
              Veja quais tendências de moda já combinam com seu guarda-roupa. Fique estilosa sem
              comprar itens novos, aproveitando o que você já tem.
            </p>
          </div>

          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <div className="bg-[#FDE8EC] p-3 rounded-lg w-fit mb-4">
              <Shield className="text-[#733D26]" size={24} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#733D26] mb-2">Compra Consciente</h3>
            <p className="text-gray-500">
              Receba insights inteligentes sobre lacunas e excessos no seu guarda-roupa. Tome
              decisões informadas antes de comprar para evitar o consumo excessivo.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-pink-100 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Como Usar o DREAMCLOSET</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[#FFB6C1] text-[#733D26] rounded-full flex items-center justify-center font-semibold">
              1
            </span>
            <div>
              <h3 className="font-semibold text-[#733D26] mb-1">Catalogue seu Guarda-Roupa</h3>
              <p className="text-gray-500">
                Comece adicionando suas peças. Tire fotos, selecione categorias e registre
                tecido, cores e estampas de cada peça.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[#FFB6C1] text-[#733D26] rounded-full flex items-center justify-center font-semibold">
              2
            </span>
            <div>
              <h3 className="font-semibold text-[#733D26] mb-1">Crie Looks</h3>
              <p className="text-gray-500">
                Use o Criador de Look para arrastar e soltar peças em combinações de outfit.
                Salve seus looks favoritos para consulta rápida.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[#FFB6C1] text-[#733D26] rounded-full flex items-center justify-center font-semibold">
              3
            </span>
            <div>
              <h3 className="font-semibold text-[#733D26] mb-1">Marque Favoritos</h3>
              <p className="text-gray-500">
                Marque suas peças e looks favoritos para construir seu perfil de estilo pessoal.
                O Assistente de Estilo vai analisar suas preferências.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[#FFB6C1] text-[#733D26] rounded-full flex items-center justify-center font-semibold">
              4
            </span>
            <div>
              <h3 className="font-semibold text-[#733D26] mb-1">Compre Conscientemente</h3>
              <p className="text-gray-500">
                Antes de comprar itens novos, consulte o Assistente de Compra Consciente para
                saber se você realmente precisa ou se pode usar o que já tem.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="bg-[#733D26] text-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Privacidade e Dados</h2>
        <div className="space-y-3 text-gray-300">
          <p>✓ Todos os seus dados são armazenados localmente no seu dispositivo</p>
          <p>✓ Sem sincronização na nuvem ou armazenamento online</p>
          <p>✓ Sem redes sociais ou compartilhamento</p>
          <p>✓ Suas informações de guarda-roupa ficam completamente privadas</p>
        </div>
      </div>

      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3">💚 Impacto Ambiental</h2>
        <p className="text-gray-600 mb-4">
          A indústria da moda é uma das maiores poluidoras do mundo. Ao usar o DREAMCLOSET para
          aproveitar ao máximo seu guarda-roupa existente, você está:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li>• Reduzindo o descarte de têxteis em aterros sanitários</li>
          <li>• Diminuindo o consumo de água na produção de novas roupas</li>
          <li>• Reduzindo as emissões de carbono da fabricação e transporte</li>
          <li>• Apoiando uma economia de moda mais sustentável</li>
        </ul>
      </div>

      <div className="text-center py-8 space-y-4">
        <Link
          to="/app"
          className="inline-block bg-[#733D26] text-white px-8 py-4 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] text-lg font-medium"
        >
          Voltar ao Painel
        </Link>
        <p className="text-gray-400 text-sm">
          Feito com carinho para amantes da moda consciente
        </p>
      </div>
    </div>
  );
}
