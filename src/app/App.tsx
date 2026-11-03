import { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link, useNavigate, useLocation, useParams } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ArrowLeft, Home, ShirtIcon, PlusCircle, Sparkles, BookMarked,
  Filter, TrendingUp, ShoppingBag, Info, Menu, X, Heart, Edit, Trash2,
  Search, Upload, Save, Plus, AlertTriangle, CheckCircle, XCircle,
  TrendingDown, AlertCircle, Shield, Database, Calendar, Settings,
  Moon, Sun, Eye, Type, User, Lock, Mail, LogOut, ChevronLeft,
  ChevronRight, Camera, Check
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { FormField } from '../components/FormField';
import { CategoryBadge } from '../components/CategoryBadge';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClothingItem {
  id: string; photoUrl: string; category: string; fabric: string;
  primaryColor: string; secondaryColor?: string; pattern?: string;
  tags: string[]; isFavorite: boolean; createdAt: string;
}
interface Look {
  id: string; name: string; occasion: string;
  items: string[]; createdAt: string; isFavorite: boolean;
}
interface UserProfile {
  name: string; email: string; personalStyle: string[];
  joinedAt: string; photoUrl?: string;
}
interface AppSettings {
  darkMode: boolean;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: number;
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const KEYS = {
  ITEMS: 'dreamcloset_items', LOOKS: 'dreamcloset_looks',
  USER: 'dreamcloset_user', AUTH: 'dreamcloset_auth',
  SETTINGS: 'dreamcloset_settings',
};
const storage = {
  getItems(): ClothingItem[] { const d = localStorage.getItem(KEYS.ITEMS); return d ? JSON.parse(d) : []; },
  saveItems(items: ClothingItem[]) { localStorage.setItem(KEYS.ITEMS, JSON.stringify(items)); },
  addItem(item: Omit<ClothingItem, 'id' | 'createdAt'>): ClothingItem {
    const items = this.getItems();
    const newItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    items.push(newItem); this.saveItems(items); return newItem;
  },
  updateItem(id: string, updates: Partial<ClothingItem>) {
    const items = this.getItems(); const i = items.findIndex(x => x.id === id);
    if (i !== -1) { items[i] = { ...items[i], ...updates }; this.saveItems(items); }
  },
  deleteItem(id: string) { this.saveItems(this.getItems().filter(x => x.id !== id)); },
  getLooks(): Look[] { const d = localStorage.getItem(KEYS.LOOKS); return d ? JSON.parse(d) : []; },
  saveLooks(looks: Look[]) { localStorage.setItem(KEYS.LOOKS, JSON.stringify(looks)); },
  addLook(look: Omit<Look, 'id' | 'createdAt'>): Look {
    const looks = this.getLooks();
    const newLook = { ...look, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    looks.push(newLook); this.saveLooks(looks); return newLook;
  },
  updateLook(id: string, updates: Partial<Look>) {
    const looks = this.getLooks(); const i = looks.findIndex(x => x.id === id);
    if (i !== -1) { looks[i] = { ...looks[i], ...updates }; this.saveLooks(looks); }
  },
  deleteLook(id: string) { this.saveLooks(this.getLooks().filter(x => x.id !== id)); },
  getUser(): UserProfile | null { const d = localStorage.getItem(KEYS.USER); return d ? JSON.parse(d) : null; },
  saveUser(user: UserProfile) { localStorage.setItem(KEYS.USER, JSON.stringify(user)); },
  isAuthenticated(): boolean { return localStorage.getItem(KEYS.AUTH) === 'true'; },
  setAuthenticated(value: boolean) { localStorage.setItem(KEYS.AUTH, value.toString()); },
  getSettings(): AppSettings {
    const d = localStorage.getItem(KEYS.SETTINGS);
    return d ? JSON.parse(d) : { darkMode: false, colorblindMode: 'none', fontSize: 16 };
  },
  saveSettings(s: AppSettings) { localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)); },
  clearAll() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); },
};

// ─── Settings Context ─────────────────────────────────────────────────────────
interface SettingsCtx {
  settings: AppSettings;
  toggleDark: () => void;
  setColorblindMode: (mode: AppSettings['colorblindMode']) => void;
  setFontSize: (size: number) => void;
}
const SettingsContext = createContext<SettingsCtx>({
  settings: { darkMode: false, colorblindMode: 'none', fontSize: 16 },
  toggleDark: () => {}, setColorblindMode: () => {}, setFontSize: () => {},
});
const useSettings = () => useContext(SettingsContext);

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark-mode', settings.darkMode);
    html.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorblindMode !== 'none') html.classList.add(settings.colorblindMode);
    html.style.setProperty('--font-size', `${settings.fontSize}px`);
    storage.saveSettings(settings);
  }, [settings]);

  const toggleDark = () => setSettings(s => ({ ...s, darkMode: !s.darkMode }));
  const setColorblindMode = (colorblindMode: AppSettings['colorblindMode']) => setSettings(s => ({ ...s, colorblindMode }));
  const setFontSize = (fontSize: number) => setSettings(s => ({ ...s, fontSize }));

  return (
    <SettingsContext.Provider value={{ settings, toggleDark, setColorblindMode, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Parte de Cima', 'Parte de Baixo', 'Vestido', 'Agasalho', 'Calçados', 'Acessórios', 'Outro'];
const FABRICS = ['Algodão', 'Poliéster', 'Lã', 'Seda', 'Jeans', 'Linho', 'Couro', 'Sintético', 'Outro'];
const PATTERNS = ['Liso', 'Listrado', 'Poá', 'Floral', 'Xadrez', 'Animal Print', 'Geométrico', 'Outro'];
const ITEM_TYPE = 'clothing_item';

const PREDEFINED_LOOKS = [
  { id: 'casual-weekend', name: 'Fim de Semana Casual', occasion: 'Casual', description: 'Roupa confortável e relaxada para atividades de fim de semana', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'] },
  { id: 'business', name: 'Profissional de Negócios', occasion: 'Trabalho', description: 'Look profissional clássico para o escritório', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Agasalho', 'Calçados'] },
  { id: 'date-night', name: 'Saída à Noite', occasion: 'Formal', description: 'Outfit elegante e estiloso para uma noite especial', requiredCategories: ['Vestido', 'Calçados', 'Acessórios'] },
  { id: 'athleisure', name: 'Athleisure', occasion: 'Casual', description: 'Estilo esportivo e casual para tarefas do dia a dia', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'] },
  { id: 'smart-casual', name: 'Smart Casual', occasion: 'Smart Casual', description: 'Equilíbrio entre profissional e relaxado', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'] },
  { id: 'summer-chic', name: 'Verão Chique', occasion: 'Casual', description: 'Look leve e fresco para dias quentes', requiredCategories: ['Vestido', 'Calçados', 'Acessórios'] },
  { id: 'winter-layers', name: 'Camadas de Inverno', occasion: 'Casual', description: 'Look quentinho em camadas para dias frios', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Agasalho', 'Calçados', 'Acessórios'] },
  { id: 'minimalist', name: 'Minimalista Moderno', occasion: 'Dia a Dia', description: 'Linhas limpas e simples com cores neutras', requiredCategories: ['Parte de Cima', 'Parte de Baixo', 'Calçados'] },
];

const CURRENT_TRENDS = [
  { id: 'minimalist-neutral', name: 'Neutros Minimalistas', description: 'Linhas limpas e cores neutras (preto, branco, bege, cinza)', matchCriteria: { colors: ['#000000', '#FFFFFF', '#F5F5DC', '#808080', '#D3D3D3'], patterns: ['Liso'] } },
  { id: 'earth-tones', name: 'Tons Terrosos', description: 'Cores naturais inspiradas na natureza (marrom, oliva, terracota)', matchCriteria: { colors: ['#8B4513', '#556B2F', '#CD5C5C', '#D2691E'] } },
  { id: 'athleisure', name: 'Athleisure', description: 'Estilo esportivo e casual com tecidos confortáveis', matchCriteria: { categories: ['Parte de Cima', 'Parte de Baixo'], fabrics: ['Poliéster', 'Sintético'] } },
  { id: 'vintage-revival', name: 'Revival Vintage', description: 'Estampas retrô e silhuetas clássicas', matchCriteria: { patterns: ['Floral', 'Poá', 'Xadrez'] } },
  { id: 'monochrome', name: 'Monocromático', description: 'Looks em uma única cor para visual elegante', matchCriteria: { colors: ['#000000', '#FFFFFF', '#000080'] } },
  { id: 'sustainable-denim', name: 'Jeans Sustentável', description: 'Peças clássicas de jeans em estilos versáteis', matchCriteria: { fabrics: ['Jeans'] } },
  { id: 'bold-patterns', name: 'Estampas Marcantes', description: 'Peças destaque com estampas chamativas', matchCriteria: { patterns: ['Animal Print', 'Geométrico', 'Listrado'] } },
  { id: 'luxury-basics', name: 'Básicos de Luxo', description: 'Tecidos nobres em estilos atemporais', matchCriteria: { fabrics: ['Seda', 'Lã', 'Linho', 'Couro'] } },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white';
const btnPrimary = 'bg-[#733D26] text-white py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] font-medium';

// ─── Splash ───────────────────────────────────────────────────────────────────
function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate(storage.isAuthenticated() ? '/app' : '/login'), 2000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full">
            <img src="/logo.png" alt="" aria-hidden="true" className="w-36 h-36 object-contain" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-[#733D26] mb-2 tracking-widest">DREAMCLOSET</h1>
        <p className="text-gray-500">Guarda-Roupa Digital Sustentável</p>
        <div className="mt-8">
          <div className="w-12 h-1 bg-[#FFB6C1]/30 rounded mx-auto overflow-hidden">
            <div className="h-full bg-[#FFB6C1] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auth header ──────────────────────────────────────────────────────────────
function AuthHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-3 rounded-full">
        <img src="/logo.png" alt="" aria-hidden="true" className="w-30 h30 object-contain" />
      </div>
      <h1 className="text-3xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
      <p className="text-gray-700 mt-2">{subtitle}</p>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email || !password) { setError('Por favor, preencha todos os campos'); return; }
    storage.setAuthenticated(true);
    if (!storage.getUser()) storage.saveUser({ name: email.split('@')[0], email, personalStyle: [], joinedAt: new Date().toISOString() });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8B0CB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthHeader subtitle="Seu Guarda-Roupa Digital" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField id="email" label="E-mail" type="email" value={email} onChange={setEmail}
            placeholder="seu@email.com" required hasError={!!error} autoComplete="email" />
          <FormField id="password" label="Senha" type="password" value={password} onChange={setPassword}
            placeholder="••••••••" required hasError={!!error} autoComplete="current-password" />
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <button type="submit" className={`w-full ${btnPrimary}`}>Entrar</button>
          <div className="space-y-3 text-center">
            <Link to="/forgot-password" className="block text-gray-700 hover:text-[#733D26] underline min-h-[44px] flex items-center justify-center">Esqueceu a senha?</Link>
            <p className="text-gray-700">Não tem uma conta? <Link to="/signup" className="text-[#733D26] font-medium hover:underline">Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Signup ───────────────────────────────────────────────────────────────────
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!name || !email || !password || !confirm) { setError('Por favor, preencha todos os campos'); return; }
    if (password !== confirm) { setError('As senhas não coincidem'); return; }
    if (password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres'); return; }
    storage.saveUser({ name, email, personalStyle: [], joinedAt: new Date().toISOString() });
    storage.setAuthenticated(true);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8B0CB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <AuthHeader subtitle="Crie sua conta" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField id="name" label="Nome" type="text" value={name} onChange={setName}
            placeholder="Seu nome" required autoComplete="name" />
          <FormField id="email" label="E-mail" type="email" value={email} onChange={setEmail}
            placeholder="seu@email.com" required autoComplete="email" />
          <FormField id="password" label="Senha" type="password" value={password} onChange={setPassword}
            placeholder="••••••••" required hint="Mínimo de 8 caracteres" autoComplete="new-password" />
          <FormField id="confirm" label="Confirmar Senha" type="password" value={confirm} onChange={setConfirm}
            placeholder="••••••••" required autoComplete="new-password" />
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <button type="submit" className={`w-full ${btnPrimary}`}>Criar Conta</button>
          <p className="text-center text-gray-700">Já tem uma conta? <Link to="/login" className="text-[#733D26] font-medium hover:underline">Entrar</Link></p>
        </form>
      </div>
    </div>
  );
}

// ─── ForgotPassword ───────────────────────────────────────────────────────────
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full">
            <img src="/logo.png" alt="" aria-hidden="true" className="w-40 h-40 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
          <p className="text-gray-500 mt-2">Redefinir sua senha</p>
        </div>
        {!submitted ? (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
            <FormField id="fp-email" label="Endereço de e-mail" type="email" value={email} onChange={setEmail}
              placeholder="seu@email.com" required hint="Enviaremos instruções para redefinir sua senha." autoComplete="email" />
            <button type="submit" className={`w-full ${btnPrimary}`}>Enviar link de redefinição</button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#733D26] min-h-[44px]">
              <ArrowLeft size={20} aria-hidden="true" />Voltar ao login
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
              <p className="text-[#733D26]">Instruções de redefinição foram enviadas para <strong>{email}</strong></p>
            </div>
            <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#733D26] min-h-[44px]">
              <ArrowLeft size={20} aria-hidden="true" />Voltar ao login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DeleteAccount ────────────────────────────────────────────────────────────
function DeleteAccount() {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (confirmation !== 'EXCLUIR') { setError('Por favor, digite EXCLUIR para confirmar'); return; }
    storage.clearAll(); navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-6 min-h-[44px]">
            <ArrowLeft size={20} aria-hidden="true" />Voltar
          </button>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={32} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-[#733D26]">Excluir Conta</h1>
          </div>
          <p className="text-gray-500">Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos deste dispositivo.</p>
        </div>
        <form onSubmit={handleDelete} className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="font-semibold text-red-900 mb-3">O que será excluído:</h2>
            <ul className="space-y-2 text-red-800">
              {['Todas as suas peças de roupa', 'Todos os looks e outfits salvos', 'Suas preferências de estilo pessoal', 'Informações da conta'].map(t => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="confirmation" className="block text-sm font-medium text-[#733D26] mb-2">Digite <strong>EXCLUIR</strong> para confirmar</label>
            <input type="text" id="confirmation" value={confirmation} onChange={e => setConfirmation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent min-h-[44px] bg-white"
              placeholder="EXCLUIR" required aria-required="true" />
            <p className="text-sm text-gray-500 mt-1">Deve ser digitado em letras maiúsculas</p>
          </div>
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors min-h-[44px] font-medium">
            Excluir conta permanentemente
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen() {
  const user = storage.getUser();
  const items = storage.getItems();
  const looks = storage.getLooks();

  const stats = useMemo(() => {
    const favoriteItems = items.filter(i => i.isFavorite).length;
    const recentItems = items.filter(i => (Date.now() - new Date(i.createdAt).getTime()) / 86400000 <= 7).length;
    const categories = items.reduce((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {} as Record<string, number>);
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    return { totalItems: items.length, totalLooks: looks.length, favoriteItems, recentItems, topCategory: topCategory ? `${topCategory[0]} (${topCategory[1]})` : 'Nenhuma' };
  }, [items, looks]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] mb-2">Bem-vindo(a) de volta, {user?.name || 'Usuário'}!</h1>
        <p className="text-gray-500">Aqui está o resumo do seu guarda-roupa</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={ShirtIcon} value={stats.totalItems} label="Total de Peças" link="/app/closet" linkLabel="Ver Guarda-Roupa →" />
        <StatCard icon={Sparkles} value={stats.totalLooks} label="Looks Salvos" link="/app/looks" linkLabel="Ver Looks →" />
        <StatCard icon={Heart} value={stats.favoriteItems} label="Peças Favoritas" />
        <StatCard icon={Calendar} value={stats.recentItems} label="Adicionado Esta Semana" />
        <StatCard icon={TrendingUp} value={stats.topCategory} label="Categoria Principal" largeValue />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/app/add-item" className="bg-[#733D26] text-white rounded-lg p-8 hover:bg-[#8B4A30] transition-colors block">
          <h2 className="text-xl font-bold mb-2">Adicionar Nova Peça</h2>
          <p className="text-gray-300">Cadastre uma nova peça no seu guarda-roupa</p>
        </Link>
        <Link to="/app/look-builder" className="bg-white border-2 border-[#FFB6C1] text-[#733D26] rounded-lg p-8 hover:bg-[#FDE8EC] transition-colors block">
          <h2 className="text-xl font-bold mb-2">Criar Look</h2>
          <p className="text-gray-500">Combine suas peças para criar novos outfits</p>
        </Link>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Moda Consciente</h2>
        <p className="text-gray-600">Você está fazendo a diferença! Ao cuidar do seu guarda-roupa existente, você reduz o desperdício da moda e faz escolhas mais sustentáveis.</p>
        <Link to="/app/conscious-buyer" className="text-[#733D26] hover:underline text-sm font-medium inline-flex items-center mt-3 min-h-[44px]">Ver Sugestões Inteligentes →</Link>
      </div>
    </div>
  );
}

// ─── ClothingInterface ────────────────────────────────────────────────────────
function ClothingInterface() {
  const [items, setItems] = useState(() => storage.getItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => ['all', ...Array.from(new Set(items.map(i => i.category)))], [items]);
  const filteredItems = useMemo(() => items.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.category.toLowerCase().includes(q) || item.fabric.toLowerCase().includes(q) ||
      item.primaryColor.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q));
    return matchesSearch && (categoryFilter === 'all' || item.category === categoryFilter);
  }), [items, searchQuery, categoryFilter]);

  const toggleFavorite = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) { storage.updateItem(id, { isFavorite: !item.isFavorite }); setItems(storage.getItems()); }
  };
  const deleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta peça?')) { storage.deleteItem(id); setItems(storage.getItems()); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Meu Guarda-Roupa</h1>
          <p className="text-gray-500 mt-1">{filteredItems.length} peças</p>
        </div>
        <Link to="/app/add-item" className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]">
          <PlusCircle size={20} aria-hidden="true" />Adicionar Peça
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input type="search" placeholder="Buscar por categoria, tecido, cor ou tags..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white"
            aria-label="Buscar peças de roupa" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white" aria-label="Filtrar por categoria">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Todas as Categorias' : c}</option>)}
        </select>
      </div>
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">{items.length === 0 ? 'Seu guarda-roupa está vazio' : 'Nenhuma peça encontrada'}</p>
          <Link to="/app/add-item" className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]">
            <PlusCircle size={20} aria-hidden="true" />Adicionar Primeira Peça
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <article key={item.id} className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-[#FDE8EC] relative">
                {item.photoUrl ? <img src={item.photoUrl} alt={`${item.category} - ${item.primaryColor}`} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>}
                <button onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={item.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={item.isFavorite}>
                  <Heart size={20} className={item.isFavorite ? 'fill-[#FFB6C1] text-[#FFB6C1]' : 'text-gray-400'} aria-hidden="true" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-3"><CategoryBadge label={item.category} /></div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">Tecido:</dt><dd className="text-[#733D26] font-medium">{item.fabric}</dd></div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cor:</dt>
                    <dd className="text-[#733D26] font-medium flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: item.primaryColor }} aria-hidden="true" />
                      {item.primaryColor}
                    </dd>
                  </div>
                  {item.pattern && <div className="flex justify-between"><dt className="text-gray-500">Estampa:</dt><dd className="text-[#733D26] font-medium">{item.pattern}</dd></div>}
                </dl>
                {item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => <span key={idx} className="text-xs text-gray-500 bg-[#FAF9F6] px-2 py-1 rounded">{tag}</span>)}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Link to={`/app/edit-item/${item.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-[#FDE8EC] transition-colors min-h-[44px]" aria-label={`Editar ${item.category}`}>
                    <Edit size={16} aria-hidden="true" />Editar
                  </Link>
                  <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]" aria-label={`Excluir ${item.category}`}>
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

// ─── ItemRegistration ─────────────────────────────────────────────────────────
function ItemRegistration() {
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
        setPhotoUrl(item.photoUrl); setCategory(item.category); setFabric(item.fabric);
        setPrimaryColor(item.primaryColor); setSecondaryColor(item.secondaryColor || '');
        const p = item.pattern || 'Liso';
        if (!PATTERNS.includes(p)) { setPattern('Outro'); setCustomPattern(p); } else { setPattern(p); }
        setTags(item.tags);
      }
    }
  }, [isEditing, id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onloadend = () => setPhotoUrl(r.result as string); r.readAsDataURL(file); }
  };

  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(''); } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPattern = pattern === 'Outro' ? customPattern : pattern;
    const itemData = { photoUrl, category, fabric, primaryColor, secondaryColor, pattern: finalPattern, tags, isFavorite: false };
    if (isEditing && id) { storage.updateItem(id, itemData); } else { storage.addItem(itemData); }
    navigate('/app/closet');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-4 min-h-[44px]">
          <ArrowLeft size={20} aria-hidden="true" />Voltar
        </button>
        <h1 className="text-3xl font-bold text-[#733D26]">{isEditing ? 'Editar Peça' : 'Adicionar Nova Peça'}</h1>
        <p className="text-gray-500 mt-1">Preencha os detalhes sobre sua peça de roupa</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-pink-100 rounded-lg p-6">
        {/* Foto */}
        <div>
          <label className="block text-sm font-medium text-[#733D26] mb-2">Foto</label>
          <div className="space-y-4">
            {photoUrl && (
              <div className="relative w-full aspect-square max-w-sm bg-[#FDE8EC] rounded-lg overflow-hidden">
                <img src={photoUrl} alt="Prévia da peça" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setPhotoUrl('')} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Remover foto">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-[#FFB6C1] rounded-lg hover:border-[#F4A7B9] cursor-pointer transition-colors min-h-[44px]">
              <Upload size={20} aria-hidden="true" />
              <span>{photoUrl ? 'Alterar Foto' : 'Enviar Foto'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" aria-label="Enviar foto da peça" />
            </label>
          </div>
        </div>
        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#733D26] mb-2">Categoria <span className="text-red-500">*</span></label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={inputCls} required aria-required="true">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {/* Tecido */}
        <div>
          <label htmlFor="fabric" className="block text-sm font-medium text-[#733D26] mb-2">Tecido <span className="text-red-500">*</span></label>
          <select id="fabric" value={fabric} onChange={e => setFabric(e.target.value)} className={inputCls} required aria-required="true">
            {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        {/* Cores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: 'primaryColor', label: 'Cor Principal', value: primaryColor, onChange: setPrimaryColor, required: true },
            { id: 'secondaryColor', label: 'Cor Secundária (Opcional)', value: secondaryColor, onChange: setSecondaryColor, required: false },
          ].map(({ id, label, value, onChange, required }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-[#733D26] mb-2">{label}{required && <span className="text-red-500"> *</span>}</label>
              <div className="flex gap-3 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm" style={{ backgroundColor: value || '#ffffff' }} aria-hidden="true" />
                  <input type="color" id={id} value={value || '#ffffff'} onChange={e => onChange(e.target.value)} className="w-12 h-8 border border-gray-200 rounded cursor-pointer" />
                </div>
                <input type="text" value={value} onChange={e => onChange(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px]"
                  placeholder={required ? '#000000' : '#ffffff'} aria-label={`Código hex da ${label.toLowerCase()}`} />
              </div>
            </div>
          ))}
        </div>
        {/* Estampa */}
        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-[#733D26] mb-2">Estampa</label>
          <select id="pattern" value={pattern} onChange={e => setPattern(e.target.value)} className={inputCls}>
            {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {pattern === 'Outro' && (
            <div className="mt-3">
              <label htmlFor="customPattern" className="block text-sm font-medium text-[#733D26] mb-2">Descreva a estampa</label>
              <input type="text" id="customPattern" value={customPattern} onChange={e => setCustomPattern(e.target.value)}
                className={inputCls} placeholder="ex: Estampa tropical, Tie-dye, etc." aria-label="Estampa personalizada" />
            </div>
          )}
        </div>
        {/* Tags */}
        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-[#733D26] mb-2">Tags (Opcional)</label>
          <div className="flex gap-2">
            <input type="text" id="tagInput" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px]"
              placeholder="ex: casual, verão, vintage" aria-label="Adicionar tag" />
            <button type="button" onClick={addTag} className="px-6 py-3 bg-[#733D26] text-white rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]">Adicionar</button>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-2 bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 min-h-[24px] min-w-[24px] flex items-center justify-center" aria-label={`Remover tag ${tag}`}>
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-[#FAF9F6] transition-colors min-h-[44px]">Cancelar</button>
          <button type="submit" className={`flex-1 ${btnPrimary}`}>{isEditing ? 'Salvar Alterações' : 'Adicionar Peça'}</button>
        </div>
      </form>
    </div>
  );
}

// ─── LookBuilder ──────────────────────────────────────────────────────────────
function DraggableCard({ item, onAdd }: { item: ClothingItem; onAdd: () => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE, item: { id: item.id },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }));
  return (
    <div ref={drag} className={`bg-white border border-pink-100 rounded-lg overflow-hidden cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}>
      <div className="aspect-square bg-[#FDE8EC]">
        {item.photoUrl ? <img src={item.photoUrl} alt={`${item.category} - ${item.primaryColor}`} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sem foto</div>}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-[#733D26] truncate">{item.category}</p>
        <button onClick={onAdd} className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#733D26] text-white rounded text-xs hover:bg-[#8B4A30] transition-colors min-h-[32px]">
          <Plus size={14} aria-hidden="true" />Adicionar
        </button>
      </div>
    </div>
  );
}

function CanvasCard({ item, onRemove }: { item: ClothingItem; onRemove: () => void }) {
  return (
    <div className="relative bg-white border-2 border-[#FFB6C1] rounded-lg overflow-hidden">
      <div className="aspect-square bg-[#FDE8EC]">
        {item.photoUrl ? <img src={item.photoUrl} alt={`${item.category} - ${item.primaryColor}`} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>}
      </div>
      <div className="p-2"><p className="text-sm font-medium text-[#733D26] truncate">{item.category}</p></div>
      <button onClick={onRemove} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center" aria-label={`Remover ${item.category}`}>
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function LookBuilderContent() {
  const navigate = useNavigate();
  const allItems = storage.getItems();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lookName, setLookName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => ['all', ...Array.from(new Set(allItems.map(i => i.category)))], [allItems]);
  const filteredItems = useMemo(() => categoryFilter === 'all' ? allItems : allItems.filter(i => i.category === categoryFilter), [allItems, categoryFilter]);
  const selectedItems = selectedIds.map(id => allItems.find(i => i.id === id)).filter(Boolean) as ClothingItem[];

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => { if (!selectedIds.includes(item.id)) setSelectedIds(prev => [...prev, item.id]); },
    collect: monitor => ({ isOver: monitor.isOver() }),
  }));

  const addItem = (id: string) => { if (!selectedIds.includes(id)) setSelectedIds(prev => [...prev, id]); };
  const removeItem = (id: string) => setSelectedIds(selectedIds.filter(x => x !== id));

  const saveLook = () => {
    if (!lookName.trim()) { alert('Por favor, insira um nome para este look'); return; }
    if (selectedIds.length === 0) { alert('Por favor, adicione pelo menos uma peça a este look'); return; }
    storage.addLook({ name: lookName, occasion: occasion || 'Dia a Dia', items: selectedIds, isFavorite: false });
    navigate('/app/looks');
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-4 min-h-[44px]">
          <ArrowLeft size={20} aria-hidden="true" />Voltar
        </button>
        <h1 className="text-3xl font-bold text-[#733D26]">Criador de Look</h1>
        <p className="text-gray-500 mt-1">Arraste peças do seu guarda-roupa ou clique em "Adicionar" para criar seu look</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div ref={drop} className={`min-h-[400px] bg-white border-2 border-dashed rounded-lg p-6 transition-colors ${isOver ? 'border-[#FFB6C1] bg-[#FDE8EC]/30' : 'border-pink-200'}`}>
            <h2 className="text-lg font-semibold text-[#733D26] mb-4">Canvas do Look</h2>
            {selectedItems.length === 0
              ? <div className="flex items-center justify-center h-[300px] text-gray-400">Arraste peças aqui ou clique em "Adicionar" para começar</div>
              : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{selectedItems.map(item => <CanvasCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />)}</div>
            }
          </div>
          <div className="bg-white border border-pink-100 rounded-lg p-6 space-y-4">
            <div>
              <label htmlFor="lookName" className="block text-sm font-medium text-[#733D26] mb-2">Nome do Look <span className="text-red-500">*</span></label>
              <input type="text" id="lookName" value={lookName} onChange={e => setLookName(e.target.value)}
                className={inputCls} placeholder="ex: Sexta Casual, Saída à Noite" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-[#733D26] mb-2">Ocasião</label>
              <input type="text" id="occasion" value={occasion} onChange={e => setOccasion(e.target.value)}
                className={inputCls} placeholder="ex: Trabalho, Casual, Formal" />
            </div>
            <button onClick={saveLook} className={`w-full flex items-center justify-center gap-2 ${btnPrimary}`}>
              <Save size={20} aria-hidden="true" />Salvar Look
            </button>
          </div>
        </div>
        <div className="bg-white border border-pink-100 rounded-lg p-4">
          <h2 className="font-semibold text-[#733D26] mb-3">Seu Guarda-Roupa</h2>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white mb-4" aria-label="Filtrar peças por categoria">
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Todas as Peças' : c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
            {filteredItems.map(item => <DraggableCard key={item.id} item={item} onAdd={() => addItem(item.id)} />)}
          </div>
          {filteredItems.length === 0 && <p className="text-center text-gray-400 text-sm py-8">Nenhuma peça nesta categoria</p>}
        </div>
      </div>
    </div>
  );
}

function LookBuilder() {
  return <DndProvider backend={HTML5Backend}><LookBuilderContent /></DndProvider>;
}

// ─── LookRegistry ─────────────────────────────────────────────────────────────
function LookRegistry() {
  const [looks, setLooks] = useState(() => storage.getLooks());
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const allItems = storage.getItems();

  const occasions = useMemo(() => ['all', ...Array.from(new Set(looks.map(l => l.occasion)))], [looks]);
  const filteredLooks = useMemo(() => looks.filter(look => {
    const q = searchQuery.toLowerCase();
    return (look.name.toLowerCase().includes(q) || look.occasion.toLowerCase().includes(q)) &&
      (occasionFilter === 'all' || look.occasion === occasionFilter);
  }), [looks, searchQuery, occasionFilter]);

  const toggleFavorite = (id: string) => {
    const look = looks.find(l => l.id === id);
    if (look) { storage.updateLook(id, { isFavorite: !look.isFavorite }); setLooks(storage.getLooks()); }
  };
  const deleteLook = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este look?')) { storage.deleteLook(id); setLooks(storage.getLooks()); }
  };
  const getLookItems = (look: Look) => look.items.map(id => allItems.find(i => i.id === id)).filter(Boolean) as ClothingItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Meus Looks</h1>
          <p className="text-gray-500 mt-1">{filteredLooks.length} looks salvos</p>
        </div>
        <Link to="/app/look-builder" className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]">
          <Sparkles size={20} aria-hidden="true" />Criar Novo Look
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input type="search" placeholder="Buscar looks por nome ou ocasião..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white" aria-label="Buscar looks" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" aria-hidden="true" />
          <select value={occasionFilter} onChange={e => setOccasionFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white" aria-label="Filtrar por ocasião">
            {occasions.map(o => <option key={o} value={o}>{o === 'all' ? 'Todas as Ocasiões' : o}</option>)}
          </select>
        </div>
      </div>
      {filteredLooks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">{looks.length === 0 ? 'Nenhum look salvo ainda' : 'Nenhum look encontrado'}</p>
          <Link to="/app/look-builder" className="inline-flex items-center gap-2 bg-[#733D26] text-white px-6 py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px]">
            <Sparkles size={20} aria-hidden="true" />Criar Primeiro Look
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map(look => {
            const lookItems = getLookItems(look);
            return (
              <article key={look.id} className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-[#FDE8EC] p-4 relative">
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {lookItems.slice(0, 3).map(item => (
                      <div key={item.id} className="bg-white rounded border border-pink-100 overflow-hidden">
                        {item.photoUrl ? <img src={item.photoUrl} alt={item.category} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{item.category}</div>}
                      </div>
                    ))}
                    {lookItems.length > 3 && (
                      <div className="bg-[#733D26] text-white rounded flex items-center justify-center text-sm font-medium">+{lookItems.length - 3}</div>
                    )}
                  </div>
                  <button onClick={() => toggleFavorite(look.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={look.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={look.isFavorite}>
                    <Heart size={20} className={look.isFavorite ? 'fill-[#FFB6C1] text-[#FFB6C1]' : 'text-gray-400'} aria-hidden="true" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-[#733D26]">{look.name}</h2>
                    <div className="mt-2"><CategoryBadge label={look.occasion} /></div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{lookItems.length} {lookItems.length === 1 ? 'peça' : 'peças'}</p>
                  <div className="flex gap-2">
                    <span className="flex-1 text-center px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 flex items-center justify-center">Ver Detalhes</span>
                    <button onClick={() => deleteLook(look.id)} className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] flex items-center justify-center" aria-label={`Excluir ${look.name}`}>
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

// ─── PredefinedLooks ──────────────────────────────────────────────────────────
function PredefinedLooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const allItems = storage.getItems();

  const occasions = useMemo(() => ['all', ...Array.from(new Set(PREDEFINED_LOOKS.map(l => l.occasion)))], []);
  const filteredLooks = useMemo(() => PREDEFINED_LOOKS.filter(look => {
    const q = searchQuery.toLowerCase();
    return (look.name.toLowerCase().includes(q) || look.description.toLowerCase().includes(q) || look.occasion.toLowerCase().includes(q)) &&
      (occasionFilter === 'all' || look.occasion === occasionFilter);
  }), [searchQuery, occasionFilter]);

  const checkAvailability = (required: string[]) => {
    const available = new Set(allItems.map(i => i.category));
    const missing = required.filter(c => !available.has(c));
    return { canCreate: missing.length === 0, missing, available: required.filter(c => available.has(c)) };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26]">Looks Predefinidos</h1>
        <p className="text-gray-500 mt-1">Combinações de looks para diferentes ocasiões</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
          <input type="search" placeholder="Buscar looks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white" aria-label="Buscar looks predefinidos" />
        </div>
        <select value={occasionFilter} onChange={e => setOccasionFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] min-h-[44px] bg-white" aria-label="Filtrar por ocasião">
          {occasions.map(o => <option key={o} value={o}>{o === 'all' ? 'Todas as Ocasiões' : o}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLooks.map(look => {
          const av = checkAvailability(look.requiredCategories);
          return (
            <article key={look.id} className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#FDE8EC] to-[#FFB6C1]/40 p-8 flex items-center justify-center aspect-video">
                <Sparkles className="text-[#FFB6C1]" size={48} aria-hidden="true" />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-[#733D26] mb-1">{look.name}</h2>
                  <CategoryBadge label={look.occasion} />
                </div>
                <p className="text-sm text-gray-500 mb-4">{look.description}</p>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#733D26] mb-2">Itens Necessários:</h3>
                  <ul className="space-y-1">
                    {look.requiredCategories.map(cat => (
                      <li key={cat} className={`text-sm flex items-center gap-2 ${av.available.includes(cat) ? 'text-green-600' : 'text-red-500'}`}>
                        <span>{av.available.includes(cat) ? '✓' : '✗'}</span>{cat}
                      </li>
                    ))}
                  </ul>
                </div>
                {av.canCreate
                  ? <div className="bg-green-50 border border-green-200 rounded-lg p-3"><p className="text-green-800 text-sm font-medium">✓ Você pode criar este look!</p></div>
                  : <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-3"><p className="text-[#733D26] text-sm"><strong>Faltando:</strong> {av.missing.join(', ')}</p></div>
                }
              </div>
            </article>
          );
        })}
      </div>
      {filteredLooks.length === 0 && <div className="text-center py-16"><p className="text-gray-500">Nenhum look encontrado para sua busca</p></div>}
    </div>
  );
}

// ─── Filters ──────────────────────────────────────────────────────────────────
function Filters() {
  const allItems = storage.getItems();
  const allLooks = storage.getLooks();
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selFabrics, setSelFabrics] = useState<string[]>([]);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [selPatterns, setSelPatterns] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(false);

  const filters = useMemo(() => ({
    categories: Array.from(new Set(allItems.map(i => i.category))).sort(),
    fabrics: Array.from(new Set(allItems.map(i => i.fabric))).sort(),
    colors: Array.from(new Set(allItems.map(i => i.primaryColor))).sort(),
    patterns: Array.from(new Set(allItems.map(i => i.pattern).filter(Boolean) as string[])).sort(),
  }), [allItems]);

  const filteredItems = useMemo(() => allItems.filter(item => {
    if (selCategories.length > 0 && !selCategories.includes(item.category)) return false;
    if (selFabrics.length > 0 && !selFabrics.includes(item.fabric)) return false;
    if (selColors.length > 0 && !selColors.includes(item.primaryColor)) return false;
    if (selPatterns.length > 0 && item.pattern && !selPatterns.includes(item.pattern)) return false;
    if (favOnly && !item.isFavorite) return false;
    return true;
  }), [allItems, selCategories, selFabrics, selColors, selPatterns, favOnly]);

  const filteredLooks = useMemo(() => allLooks.filter(look => {
    const lookItems = look.items.map(id => allItems.find(i => i.id === id)).filter(Boolean) as ClothingItem[];
    if (selCategories.length > 0 && !selCategories.every(cat => lookItems.some(i => i.category === cat))) return false;
    if (favOnly && !look.isFavorite) return false;
    return true;
  }), [allLooks, allItems, selCategories, favOnly]);

  const toggle = (arr: string[], set: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const hasActive = selCategories.length > 0 || selFabrics.length > 0 || selColors.length > 0 || selPatterns.length > 0 || favOnly;

  const CheckGroup = ({ label, items, selected, setSelected }: { label: string; items: string[]; selected: string[]; setSelected: React.Dispatch<React.SetStateAction<string[]>> }) => (
    <div>
      <h3 className="text-sm font-medium text-[#733D26] mb-3">{label}</h3>
      <div className="space-y-2">
        {items.map(val => (
          <label key={val} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={selected.includes(val)} onChange={() => toggle(selected, setSelected, val)}
              className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]" />
            <span className="text-sm text-gray-700">{val}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#733D26]">Filtros Avançados</h1>
          <p className="text-gray-500 mt-1">Filtre suas peças e looks por atributos</p>
        </div>
        {hasActive && (
          <button onClick={() => { setSelCategories([]); setSelFabrics([]); setSelColors([]); setSelPatterns([]); setFavOnly(false); }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-[#FDE8EC] transition-colors min-h-[44px]">
            <X size={20} aria-hidden="true" />Limpar Tudo
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-pink-100 rounded-lg p-6 space-y-6">
          <h2 className="font-semibold text-[#733D26] flex items-center gap-2"><Filter size={20} aria-hidden="true" />Opções de Filtro</h2>
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={favOnly} onChange={e => setFavOnly(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]" />
            <span className="text-sm font-medium text-[#733D26]">Somente Favoritos</span>
          </label>
          <CheckGroup label="Categorias" items={filters.categories} selected={selCategories} setSelected={setSelCategories} />
          <CheckGroup label="Tecidos" items={filters.fabrics} selected={selFabrics} setSelected={setSelFabrics} />
          <CheckGroup label="Estampas" items={filters.patterns} selected={selPatterns} setSelected={setSelPatterns} />
          <div>
            <h3 className="text-sm font-medium text-[#733D26] mb-3">Cores</h3>
            <div className="grid grid-cols-2 gap-2">
              {filters.colors.map(color => (
                <label key={color} className="flex items-center gap-2 p-2 border border-pink-100 rounded-lg cursor-pointer hover:bg-[#FDE8EC] transition-colors min-h-[44px]">
                  <input type="checkbox" checked={selColors.includes(color)} onChange={() => toggle(selColors, setSelColors, color)}
                    className="w-4 h-4 rounded border-gray-300 text-[#FFB6C1] focus:ring-[#FFB6C1]" />
                  <span className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: color }} aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">Peças Filtradas ({filteredItems.length})</h2>
            {filteredItems.length === 0
              ? <div className="bg-white border border-pink-100 rounded-lg p-12 text-center"><p className="text-gray-500">Nenhuma peça corresponde aos filtros</p></div>
              : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-white border border-pink-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-[#FDE8EC]">
                        {item.photoUrl ? <img src={item.photoUrl} alt={`${item.category} - ${item.primaryColor}`} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sem foto</div>}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-[#733D26] truncate">{item.category}</p>
                        <p className="text-xs text-gray-500 truncate">{item.fabric}</p>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">Looks Filtrados ({filteredLooks.length})</h2>
            {filteredLooks.length === 0
              ? <div className="bg-white border border-pink-100 rounded-lg p-12 text-center"><p className="text-gray-500">Nenhum look corresponde aos filtros</p></div>
              : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredLooks.map(look => (
                    <div key={look.id} className="bg-white border border-pink-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-[#733D26] mb-1">{look.name}</h3>
                      <p className="text-sm text-gray-500">{look.occasion}</p>
                      <p className="text-xs text-gray-400 mt-2">{look.items.length} peças</p>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StyleAssistant ───────────────────────────────────────────────────────────
function StyleAssistant() {
  const items = storage.getItems();
  const looks = storage.getLooks();

  const styleProfile = useMemo(() => {
    const favItems = items.filter(i => i.isFavorite);
    const favLooks = looks.filter(l => l.isFavorite);
    const count = (arr: any[], key: string) => arr.reduce((acc: Record<string, number>, x: any) => {
      if (x[key]) acc[x[key]] = (acc[x[key]] || 0) + 1; return acc;
    }, {});
    const top3 = (obj: Record<string, number>) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const catCount: Record<string, number> = {};
    favItems.forEach(i => { catCount[i.category] = (catCount[i.category] || 0) + 1; });
    return {
      topCategories: top3(catCount), topColors: top3(count(favItems, 'primaryColor')),
      topFabrics: top3(count(favItems, 'fabric')), topOccasions: top3(count(favLooks, 'occasion')),
      totalFavorites: favItems.length,
    };
  }, [items, looks]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (styleProfile.topCategories.length > 0) ins.push(`Você adora peças do tipo "${styleProfile.topCategories[0][0].toLowerCase()}" — elas representam uma grande parte dos seus favoritos.`);
    if (styleProfile.topColors.length > 0) ins.push(`${styleProfile.topColors[0][0]} é sua cor favorita, aparecendo frequentemente nas suas peças preferidas.`);
    if (styleProfile.topFabrics.length > 0) ins.push(`Você prefere tecidos de ${styleProfile.topFabrics[0][0].toLowerCase()} por conforto e estilo.`);
    if (styleProfile.topOccasions.length > 0) ins.push(`Sua ocasião preferida é "${styleProfile.topOccasions[0][0]}" — você tem ótimos looks prontos para ela!`);
    if (styleProfile.totalFavorites === 0) ins.push('Comece a marcar peças como favoritas para construir seu perfil de estilo pessoal!');
    return ins;
  }, [styleProfile]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (styleProfile.topColors.length >= 2) recs.push(`Experimente combinar ${styleProfile.topColors[0][0]} com ${styleProfile.topColors[1][0]} para um look harmonioso.`);
    if (!items.some(i => i.category === 'Acessórios')) recs.push('Considere adicionar acessórios para elevar seus outfits favoritos.');
    if (new Set(items.map(i => i.category)).size < 4) recs.push('Expandir as categorias do seu guarda-roupa pode criar combinações mais versáteis.');
    if (looks.length < 5) recs.push('Crie mais looks salvos para maximizar o potencial do seu guarda-roupa atual.');
    return recs;
  }, [styleProfile, items, looks]);

  const StatList = ({ title, items: list }: { title: string; items: [string, number][] }) => (
    <div>
      <h3 className="text-sm font-medium text-[#733D26] mb-2">{title}</h3>
      <ul className="space-y-2">
        {list.map(([label, count]) => (
          <li key={label} className="flex justify-between items-center">
            <span className="text-gray-700">{label}</span>
            <CategoryBadge label={String(count)} />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3"><Sparkles className="text-[#FFB6C1]" aria-hidden="true" />Assistente de Estilo</h1>
        <p className="text-gray-500 mt-1">Descubra seu estilo pessoal com base nos seus favoritos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-pink-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#733D26] mb-4 flex items-center gap-2"><Heart className="text-[#FFB6C1]" size={24} aria-hidden="true" />Seu Perfil de Estilo</h2>
          {styleProfile.totalFavorites === 0
            ? <p className="text-gray-500">Marque peças e looks como favoritos para gerar seu perfil de estilo personalizado.</p>
            : <div className="space-y-4">
                <StatList title="Categorias Principais" items={styleProfile.topCategories} />
                <div>
                  <h3 className="text-sm font-medium text-[#733D26] mb-2">Cores Favoritas</h3>
                  <div className="space-y-2">
                    {styleProfile.topColors.map(([color, count]) => (
                      <div key={color} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: color }} aria-hidden="true" />
                          <span className="text-gray-700">{color}</span>
                        </div>
                        <span className="bg-[#FDE8EC] text-[#733D26] px-3 py-1 rounded-full text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {styleProfile.topFabrics.length > 0 && <StatList title="Tecidos Preferidos" items={styleProfile.topFabrics} />}
                {styleProfile.topOccasions.length > 0 && <StatList title="Ocasiões Favoritas" items={styleProfile.topOccasions} />}
              </div>
          }
        </div>
        <div className="space-y-6">
          <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#733D26] mb-4 flex items-center gap-2"><TrendingUp className="text-[#733D26]" size={24} aria-hidden="true" />Insights de Estilo</h2>
            <ul className="space-y-3">
              {insights.map((ins, i) => <li key={i} className="flex gap-3"><span className="text-[#FFB6C1] font-bold">•</span><span className="text-gray-700">{ins}</span></li>)}
            </ul>
          </div>
          <div className="bg-white border border-pink-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#733D26] mb-4">Recomendações</h2>
            {recommendations.length === 0
              ? <p className="text-gray-500">Continue construindo seu guarda-roupa para receber recomendações personalizadas.</p>
              : <ul className="space-y-3">{recommendations.map((r, i) => <li key={i} className="flex gap-3"><span className="text-[#FFB6C1] font-bold">→</span><span className="text-gray-700">{r}</span></li>)}</ul>
            }
          </div>
        </div>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Dica de Estilo Sustentável</h2>
        <p className="text-gray-600">Entender seu estilo pessoal ajuda a fazer compras mais intencionais. Em vez de comprar peças da moda passageira, foque em peças que se alinhem com suas preferências estabelecidas — elas serão mais usadas e reduzirão o desperdício da moda.</p>
      </div>
    </div>
  );
}

// ─── TrendMatcher ─────────────────────────────────────────────────────────────
function TrendMatcher() {
  const items = storage.getItems();

  const trendMatches = useMemo(() => CURRENT_TRENDS.map(trend => {
    const matchingItems = items.filter(item => {
      if (trend.matchCriteria.colors && !trend.matchCriteria.colors.some(c =>
        item.primaryColor.toLowerCase() === c.toLowerCase() || item.secondaryColor?.toLowerCase() === c.toLowerCase())) return false;
      if (trend.matchCriteria.patterns && (!item.pattern || !trend.matchCriteria.patterns.includes(item.pattern))) return false;
      if (trend.matchCriteria.fabrics && !trend.matchCriteria.fabrics.includes(item.fabric)) return false;
      if (trend.matchCriteria.categories && !trend.matchCriteria.categories.includes(item.category)) return false;
      return true;
    });
    return { trend, matchingItems, isMatching: matchingItems.length > 0 };
  }), [items]);

  const matching = trendMatches.filter(t => t.isMatching);
  const potential = trendMatches.filter(t => !t.isMatching);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3"><TrendingUp className="text-[#FFB6C1]" aria-hidden="true" />Combinador de Tendências</h1>
        <p className="text-gray-500 mt-1">Veja quais tendências de moda correspondem ao seu guarda-roupa atual</p>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">Sobre Este Recurso</h2>
        <p className="text-gray-600">Esta ferramenta mostra quais tendências você já segue, provando que não é preciso comprar novos itens para estar na moda. Aproveite o que você já tem!</p>
      </div>
      {matching.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Tendências que Você Está Arrasando ({matching.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matching.map(({ trend, matchingItems }) => (
              <div key={trend.id} className="bg-white border-2 border-[#FFB6C1] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-[#FFB6C1] text-[#733D26] p-4">
                  <div className="flex items-center gap-3 mb-2"><CheckCircle size={24} aria-hidden="true" /><h3 className="text-xl font-semibold">{trend.name}</h3></div>
                  <p className="text-[#733D26]/80">{trend.description}</p>
                </div>
                <div className="p-6">
                  <p className="text-[#733D26] font-medium mb-4">{matchingItems.length} {matchingItems.length === 1 ? 'peça correspondente' : 'peças correspondentes'} no seu guarda-roupa</p>
                  <div className="grid grid-cols-3 gap-3">
                    {matchingItems.slice(0, 6).map(item => (
                      <div key={item.id} className="aspect-square bg-[#FDE8EC] rounded border border-pink-100 overflow-hidden">
                        {item.photoUrl ? <img src={item.photoUrl} alt={item.category} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">{item.category}</div>}
                      </div>
                    ))}
                  </div>
                  {matchingItems.length > 6 && <p className="text-sm text-gray-500 mt-3">+{matchingItems.length - 6} mais peças</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {potential.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Tendências para Explorar ({potential.length})</h2>
          <p className="text-gray-500 mb-6">Essas tendências ainda não correspondem ao seu guarda-roupa. Antes de comprar novas peças, verifique se você consegue criar looks similares com o que já tem!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {potential.map(({ trend }) => (
              <div key={trend.id} className="bg-white border border-pink-100 rounded-lg overflow-hidden">
                <div className="bg-[#FAF9F6] p-4">
                  <div className="flex items-center gap-3 mb-2"><XCircle className="text-gray-300" size={24} aria-hidden="true" /><h3 className="text-xl font-semibold text-[#733D26]">{trend.name}</h3></div>
                  <p className="text-gray-500">{trend.description}</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500">Nenhuma peça correspondente no seu guarda-roupa ainda.</p>
                  {trend.matchCriteria.colors && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Cores Principais:</p>
                      <div className="flex gap-2 flex-wrap">{trend.matchCriteria.colors.map(c => <span key={c} className="w-8 h-8 rounded border border-gray-200" style={{ backgroundColor: c }} aria-label={`Cor ${c}`} />)}</div>
                    </div>
                  )}
                  {trend.matchCriteria.fabrics && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Tecidos Principais:</p>
                      <div className="flex gap-2 flex-wrap">{trend.matchCriteria.fabrics.map(f => <CategoryBadge key={f} label={f} size="sm" />)}</div>
                    </div>
                  )}
                  {trend.matchCriteria.patterns && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-[#733D26] mb-2">Estampas Principais:</p>
                      <div className="flex gap-2 flex-wrap">{trend.matchCriteria.patterns.map(p => <CategoryBadge key={p} label={p} size="sm" />)}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-2">💚 Lembrete de Moda Consciente</h2>
        <p className="text-gray-600">As tendências vêm e vão, mas seu estilo pessoal é atemporal. Antes de seguir uma nova tendência, avalie se ela realmente se alinha com seu guarda-roupa e estilo de vida.</p>
      </div>
    </div>
  );
}

// ─── ConsciousBuyer ───────────────────────────────────────────────────────────
function ConsciousBuyer() {
  const items = storage.getItems();
  const looks = storage.getLooks();

  const analysis = useMemo(() => {
    const catCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};
    items.forEach(item => { catCount[item.category] = (catCount[item.category] || 0) + 1; colorCount[item.primaryColor] = (colorCount[item.primaryColor] || 0) + 1; });
    const allCats = ['Parte de Cima', 'Parte de Baixo', 'Vestido', 'Agasalho', 'Calçados', 'Acessórios'];
    return {
      missingCategories: allCats.filter(c => !catCount[c]),
      underrepresented: allCats.filter(c => catCount[c] === 1),
      overloaded: Object.entries(catCount).filter(([, c]) => c > 10).map(([cat, count]) => ({ cat, count })),
      versatileColors: Object.entries(colorCount).filter(([, c]) => c >= 3).map(([c]) => c),
      itemsPerLook: looks.length > 0 ? items.length / looks.length : 0,
      totalItems: items.length, totalLooks: looks.length,
    };
  }, [items, looks]);

  const recommendations = useMemo(() => {
    const recs: Array<{ type: 'warning' | 'success' | 'info'; title: string; message: string }> = [];
    analysis.overloaded.forEach(({ cat, count }) => recs.push({ type: 'warning', title: `Muitas Peças de ${cat}`, message: `Você tem ${count} peças de ${cat.toLowerCase()}. Avalie se realmente precisa de mais antes de comprar.` }));
    if (analysis.missingCategories.length > 0) recs.push({ type: 'info', title: `Categoria Faltando: ${analysis.missingCategories[0]}`, message: `Você não tem nenhuma peça de ${analysis.missingCategories[0].toLowerCase()}. Pode ser uma adição estratégica para ampliar suas combinações.` });
    if (analysis.underrepresented.length > 0) recs.push({ type: 'info', title: `Poucas Opções de ${analysis.underrepresented[0]}`, message: `Você tem apenas 1 peça de ${analysis.underrepresented[0].toLowerCase()}. Avalie se uma peça versátil a mais aumentaria significativamente suas combinações.` });
    if (analysis.versatileColors.length > 0) recs.push({ type: 'success', title: 'Ótima Coordenação de Cores!', message: 'Você tem várias peças em cores versáteis, facilitando a combinação. Priorize essas cores nas próximas compras.' });
    if (analysis.totalLooks < 5 && analysis.totalItems > 10) recs.push({ type: 'warning', title: 'Guarda-Roupa Subutilizado', message: `Você tem ${analysis.totalItems} peças mas apenas ${analysis.totalLooks} looks salvos. Tente criar mais combinações antes de comprar novos itens!` });
    if (analysis.totalItems > 50) recs.push({ type: 'warning', title: 'Guarda-Roupa Grande', message: `Com ${analysis.totalItems} peças, você provavelmente tem tudo que precisa. Foque em aproveitar o que já tem antes de adicionar mais.` });
    if (recs.length === 0) recs.push({ type: 'success', title: 'Guarda-Roupa Bem Equilibrado', message: 'Seu guarda-roupa parece bem equilibrado! Continue fazendo escolhas conscientes.' });
    return recs;
  }, [analysis]);

  const gapAnalysis = useMemo(() => {
    const gaps: Array<{ category: string; reason: string; impact: string }> = [];
    if (analysis.missingCategories.includes('Agasalho') && analysis.totalItems > 5) gaps.push({ category: 'Agasalho', reason: 'Falta agasalho versátil', impact: 'Uma jaqueta neutra pode completar 5+ novos looks' });
    if (analysis.missingCategories.includes('Acessórios') && analysis.totalItems > 10) gaps.push({ category: 'Acessórios', reason: 'Sem acessórios para elevar os looks', impact: 'Acessórios simples podem transformar os looks existentes' });
    return gaps;
  }, [analysis]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#733D26] flex items-center gap-3"><ShoppingBag className="text-[#FFB6C1]" aria-hidden="true" />Assistente de Compra Consciente</h1>
        <p className="text-gray-500 mt-1">Insights inteligentes para evitar o consumo excessivo e maximizar seu guarda-roupa</p>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3 flex items-center gap-2"><TrendingDown className="text-[#733D26]" size={24} aria-hidden="true" />Seu Impacto na Sustentabilidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#733D26]">
          {[{ v: analysis.totalItems, l: 'Peças no Guarda-Roupa' }, { v: analysis.totalLooks, l: 'Looks Salvos' }, { v: analysis.totalLooks > 0 ? Math.round(analysis.itemsPerLook * 10) / 10 : 0, l: 'Peças por Look' }].map(({ v, l }) => (
            <div key={l}><p className="text-2xl font-bold">{v}</p><p className="text-sm text-gray-600">{l}</p></div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Recomendações Inteligentes</h2>
        <div className="space-y-4">
          {recommendations.map((rec, idx) => {
            const Icon = rec.type === 'success' ? CheckCircle : AlertCircle;
            const bgColor = rec.type === 'warning' ? 'bg-orange-50 border-orange-200' : rec.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-[#FDE8EC] border-[#FFB6C1]';
            const textColor = rec.type === 'warning' ? 'text-orange-900' : rec.type === 'success' ? 'text-green-900' : 'text-[#733D26]';
            const iconColor = rec.type === 'warning' ? 'text-orange-600' : rec.type === 'success' ? 'text-green-600' : 'text-[#FFB6C1]';
            return (
              <div key={idx} className={`border rounded-lg p-6 ${bgColor}`}>
                <div className="flex gap-4">
                  <Icon className={iconColor} size={24} aria-hidden="true" />
                  <div><h3 className={`font-semibold mb-1 ${textColor}`}>{rec.title}</h3><p className={textColor}>{rec.message}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {gapAnalysis.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Análise Estratégica de Lacunas</h2>
          <p className="text-gray-500 mb-6">Se decidir comprar algo novo, estas peças teriam o maior impacto no seu guarda-roupa:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gapAnalysis.map((gap, idx) => (
              <div key={idx} className="bg-white border border-pink-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#733D26] mb-2">{gap.category}</h3>
                <p className="text-gray-700 mb-3">{gap.reason}</p>
                <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded p-3"><p className="text-sm text-[#733D26]"><strong>Impacto:</strong> {gap.impact}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white border-2 border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3">Antes de Comprar — Checklist</h2>
        <ul className="space-y-3">
          {['Consigo criar um look similar com peças que já tenho?', 'Esta peça combina com pelo menos 3 peças existentes no meu guarda-roupa?', 'Esta compra está alinhada com meu perfil de estilo pessoal?', 'Estou comprando porque realmente preciso, não apenas porque está na moda?', 'Esperei pelo menos 24 horas para refletir sobre esta compra?'].map(q => (
            <li key={q} className="flex gap-3"><span className="text-[#FFB6C1] font-bold">□</span><span className="text-gray-700">{q}</span></li>
          ))}
        </ul>
      </div>
      <div className="bg-[#733D26] text-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-3">Lembre-se</h2>
        <p className="text-lg text-gray-300">A peça mais sustentável é aquela que você já possui. Cada vez que escolhe estilizar o que tem em vez de comprar algo novo, você gera um impacto ambiental positivo e economiza dinheiro.</p>
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const features = [
    { icon: Database, title: 'Inventário Digital', desc: 'Catalogue cada peça do seu guarda-roupa com fotos, categorias, tecidos, cores e estampas.' },
    { icon: Sparkles, title: 'Criador de Look', desc: 'Crie e salve looks completos combinando suas peças para diferentes ocasiões.' },
    { icon: TrendingDown, title: 'Combinador de Tendências', desc: 'Veja quais tendências já combinam com seu guarda-roupa sem comprar novos itens.' },
    { icon: Shield, title: 'Compra Consciente', desc: 'Receba insights inteligentes sobre lacunas e excessos no seu guarda-roupa.' },
  ];

  const steps = [
    { n: 1, title: 'Catalogue seu Guarda-Roupa', desc: 'Comece adicionando suas peças com fotos, categorias, tecidos, cores e estampas.' },
    { n: 2, title: 'Crie Looks', desc: 'Use o Criador de Look para arrastar e soltar peças em combinações de outfit.' },
    { n: 3, title: 'Marque Favoritos', desc: 'Marque peças e looks favoritos para construir seu perfil de estilo pessoal.' },
    { n: 4, title: 'Compre Conscientemente', desc: 'Consulte o Assistente de Compra Consciente antes de adquirir novos itens.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full">
          <img src="/logo.png" alt="" aria-hidden="true" className="w-36 h-36 object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
        <p className="text-xl text-gray-500 mt-2">Guarda-Roupa Digital Inteligente e Sustentável</p>
        <p className="text-sm text-gray-400 mt-1">Versão 1.0.0</p>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4 flex items-center gap-2"><Heart className="text-[#FFB6C1]" size={28} aria-hidden="true" />Nossa Missão</h2>
        <p className="text-gray-700 text-lg leading-relaxed">O DREAMCLOSET te ajuda a fazer escolhas de moda mais conscientes, aproveitando ao máximo o seu guarda-roupa existente. Acreditamos que o look mais sustentável é aquele que você já possui.</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#733D26] mb-6">Funcionalidades Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-pink-100 rounded-lg p-6">
              <div className="bg-[#FDE8EC] p-3 rounded-lg w-fit mb-4"><Icon className="text-[#733D26]" size={24} aria-hidden="true" /></div>
              <h3 className="font-semibold text-[#733D26] mb-2">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-pink-100 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-[#733D26] mb-4">Como Usar o DREAMCLOSET</h2>
        <ol className="space-y-4">
          {steps.map(({ n, title, desc }) => (
            <li key={n} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-[#FFB6C1] text-[#733D26] rounded-full flex items-center justify-center font-semibold">{n}</span>
              <div><h3 className="font-semibold text-[#733D26] mb-1">{title}</h3><p className="text-gray-500">{desc}</p></div>
            </li>
          ))}
        </ol>
      </div>
      <div className="bg-[#733D26] text-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Privacidade e Dados</h2>
        <div className="space-y-3 text-gray-300">
          {['Todos os seus dados são armazenados localmente no seu dispositivo', 'Sem sincronização na nuvem ou armazenamento online', 'Sem redes sociais ou compartilhamento', 'Suas informações de guarda-roupa ficam completamente privadas'].map(t => <p key={t}>✓ {t}</p>)}
        </div>
      </div>
      <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
        <h2 className="font-semibold text-[#733D26] mb-3">💚 Impacto Ambiental</h2>
        <p className="text-gray-600 mb-4">A indústria da moda é uma das maiores poluidoras do mundo. Ao usar o DREAMCLOSET para aproveitar ao máximo seu guarda-roupa existente, você está:</p>
        <ul className="space-y-2 text-gray-600">
          {['Reduzindo o descarte de têxteis em aterros sanitários', 'Diminuindo o consumo de água na produção de novas roupas', 'Reduzindo as emissões de carbono da fabricação e transporte', 'Apoiando uma economia de moda mais sustentável'].map(t => <li key={t}>• {t}</li>)}
        </ul>
      </div>
      <div className="text-center py-8 space-y-4">
        <Link to="/app" className="inline-block bg-[#733D26] text-white px-8 py-4 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] text-lg font-medium">Voltar ao Painel</Link>
        <p className="text-gray-400 text-sm">Feito com carinho para amantes da moda consciente</p>
      </div>
    </div>
  );
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] ${checked ? 'bg-[#733D26]' : 'bg-gray-300'}`}
      aria-label={label}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen() {
  const { settings, toggleDark, setColorblindMode, setFontSize } = useSettings();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => storage.getUser());
  const [toast, setToast] = useState('');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Profile
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [emailError, setEmailError] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || '');
  const [photoError, setPhotoError] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('Formato inválido. Use PNG, JPG ou WebP.'); return; }
    if (file.size > 5 * 1024 * 1024) { setPhotoError('Arquivo muito grande. Máximo 5 MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPhotoPreview(url);
      const updated = { ...user!, photoUrl: url };
      storage.saveUser(updated);
      setUser(updated);
      showToast('Foto atualizada com sucesso!');
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    setNameError('');
    if (!nameInput.trim()) { setNameError('O nome não pode ficar vazio.'); return; }
    if (nameInput.trim().length < 2) { setNameError('Mínimo 2 caracteres.'); return; }
    const updated = { ...user!, name: nameInput.trim() };
    storage.saveUser(updated);
    setUser(updated);
    setEditingName(false);
    showToast('Nome atualizado com sucesso!');
  };

  const saveEmail = () => {
    setEmailError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) { setEmailError('E-mail inválido.'); return; }
    const updated = { ...user!, email: emailInput };
    storage.saveUser(updated);
    setUser(updated);
    setEditingEmail(false);
    showToast('E-mail atualizado com sucesso!');
  };

  const savePassword = () => {
    setPwError('');
    if (!currentPw) { setPwError('Informe a senha atual.'); return; }
    if (newPw.length < 8) { setPwError('A nova senha deve ter pelo menos 8 caracteres.'); return; }
    if (newPw !== confirmPw) { setPwError('As senhas não coincidem.'); return; }
    setShowPasswordForm(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    showToast('Senha alterada com sucesso!');
  };

  const handleLogout = () => {
    storage.setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const colorblindOptions: { key: AppSettings['colorblindMode']; label: string; desc: string }[] = [
    { key: 'none', label: 'Sem filtro', desc: 'Cores padrão do sistema' },
    { key: 'protanopia', label: 'Protanopia', desc: 'Dificuldade para distinguir vermelho' },
    { key: 'deuteranopia', label: 'Deuteranopia', desc: 'Dificuldade para distinguir verde' },
    { key: 'tritanopia', label: 'Tritanopia', desc: 'Dificuldade para distinguir azul' },
  ];

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-pink-100 rounded-lg overflow-hidden">
      <div className="bg-[#FDE8EC] px-6 py-3 border-b border-pink-100">
        <h2 className="font-semibold text-[#733D26] text-sm uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-pink-50">{children}</div>
    </div>
  );

  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="px-6 py-4">{children}</div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-[#733D26] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Check size={18} aria-hidden="true" />{toast}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-[#733D26]">Configurações</h1>
        <p className="text-gray-500 mt-1">Personalize sua experiência no DREAMCLOSET</p>
      </div>

      {/* ── Perfil ── */}
      <Section title="Perfil">
        {/* Foto */}
        <Row>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#FDE8EC] overflow-hidden border-2 border-[#FFB6C1] flex items-center justify-center">
                {photoPreview
                  ? <img src={photoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                  : <User className="text-[#733D26]" size={36} aria-hidden="true" />
                }
              </div>
              <button
                onClick={() => photoRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#733D26] text-white p-1.5 rounded-full hover:bg-[#8B4A30] transition-colors"
                aria-label="Alterar foto de perfil"
              >
                <Camera size={14} aria-hidden="true" />
              </button>
            </div>
            <div>
              <p className="font-medium text-[#733D26]">{user?.name || 'Usuário'}</p>
              <button onClick={() => photoRef.current?.click()}
                className="text-sm text-gray-500 hover:text-[#733D26] underline mt-1 transition-colors">
                Alterar foto
              </button>
              {photoError && <p className="text-red-500 text-xs mt-1">{photoError}</p>}
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" aria-label="Selecionar foto de perfil" />
          </div>
        </Row>

        {/* Nome */}
        <Row>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#733D26]">Nome de usuário</span>
            {!editingName && (
              <button onClick={() => { setEditingName(true); setNameInput(user?.name || ''); }}
                className="text-sm text-gray-500 hover:text-[#733D26] flex items-center gap-1 transition-colors min-h-[32px]">
                <Edit size={14} aria-hidden="true" />Editar
              </button>
            )}
          </div>
          {editingName ? (
            <div className="space-y-2">
              <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] text-sm bg-white"
                placeholder="Seu nome" autoFocus />
              {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
              <div className="flex gap-2">
                <button onClick={saveName} className="px-4 py-2 bg-[#733D26] text-white rounded-lg text-sm hover:bg-[#8B4A30] transition-colors min-h-[36px]">Salvar</button>
                <button onClick={() => { setEditingName(false); setNameError(''); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-[#FAF9F6] transition-colors min-h-[36px]">Cancelar</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{user?.name || '—'}</p>
          )}
        </Row>

        {/* Email */}
        <Row>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#733D26]">E-mail</span>
            {!editingEmail && (
              <button onClick={() => { setEditingEmail(true); setEmailInput(user?.email || ''); }}
                className="text-sm text-gray-500 hover:text-[#733D26] flex items-center gap-1 transition-colors min-h-[32px]">
                <Edit size={14} aria-hidden="true" />Editar
              </button>
            )}
          </div>
          {editingEmail ? (
            <div className="space-y-2">
              <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] text-sm bg-white"
                placeholder="seu@email.com" autoFocus />
              {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
              <div className="flex gap-2">
                <button onClick={saveEmail} className="px-4 py-2 bg-[#733D26] text-white rounded-lg text-sm hover:bg-[#8B4A30] transition-colors min-h-[36px]">Salvar</button>
                <button onClick={() => { setEditingEmail(false); setEmailError(''); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-[#FAF9F6] transition-colors min-h-[36px]">Cancelar</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{user?.email || '—'}</p>
          )}
        </Row>

        {/* Senha */}
        <Row>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#733D26]">Senha</span>
            {!showPasswordForm && (
              <button onClick={() => setShowPasswordForm(true)}
                className="text-sm text-gray-500 hover:text-[#733D26] flex items-center gap-1 transition-colors min-h-[32px]">
                <Lock size={14} aria-hidden="true" />Alterar
              </button>
            )}
          </div>
          {showPasswordForm ? (
            <div className="space-y-3">
              {[
                { id: 'cur-pw', label: 'Senha atual', value: currentPw, onChange: setCurrentPw },
                { id: 'new-pw', label: 'Nova senha', value: newPw, onChange: setNewPw },
                { id: 'conf-pw', label: 'Confirmar nova senha', value: confirmPw, onChange: setConfirmPw },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-xs text-gray-500 mb-1">{f.label}</label>
                  <input type="password" id={f.id} value={f.value} onChange={e => f.onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] text-sm bg-white" placeholder="••••••••" />
                </div>
              ))}
              {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
              <div className="flex gap-2">
                <button onClick={savePassword} className="px-4 py-2 bg-[#733D26] text-white rounded-lg text-sm hover:bg-[#8B4A30] transition-colors min-h-[36px]">Alterar senha</button>
                <button onClick={() => { setShowPasswordForm(false); setPwError(''); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-[#FAF9F6] transition-colors min-h-[36px]">Cancelar</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">••••••••</p>
          )}
        </Row>
      </Section>

      {/* ── Aparência ── */}
      <Section title="Aparência">
        <Row>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon size={20} className="text-[#733D26]" aria-hidden="true" /> : <Sun size={20} className="text-[#733D26]" aria-hidden="true" />}
              <div>
                <p className="font-medium text-[#733D26]">Modo escuro</p>
                <p className="text-xs text-gray-500">Interface com fundo escuro e cores adaptadas</p>
              </div>
            </div>
            <Toggle checked={settings.darkMode} onChange={toggleDark} label="Ativar modo escuro" />
          </div>
        </Row>
        <Row>
          <div className="flex items-start gap-3">
            <Eye size={20} className="text-[#733D26] mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-[#733D26] mb-3">Acessibilidade para daltonismo</p>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de daltonismo">
                {colorblindOptions.map(({ key, label, desc }) => (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={settings.colorblindMode === key}
                    onClick={() => setColorblindMode(key)}
                    className={`text-left p-3 rounded-lg border-2 transition-colors min-h-[44px] ${
                      settings.colorblindMode === key
                        ? 'border-[#733D26] bg-[#FDE8EC]'
                        : 'border-gray-200 hover:border-[#FFB6C1] hover:bg-[#FDE8EC]'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${settings.colorblindMode === key ? 'text-[#733D26]' : 'text-gray-700'}`}>{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div className="flex items-start gap-3">
            <Type size={20} className="text-[#733D26] mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-[#733D26] mb-4">Tamanho da fonte</p>
              <div className="space-y-3">
                <input
                  type="range"
                  min={12}
                  max={22}
                  step={1}
                  value={settings.fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  aria-label="Tamanho da fonte"
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#733D26]"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>A</span>
                  <span className="text-[#733D26] font-medium">Padrão (16px)</span>
                  <span className="text-lg leading-none">A</span>
                </div>
                <p className="text-xs text-gray-400">Atual: {settings.fontSize}px</p>
              </div>
            </div>
          </div>
        </Row>
      </Section>

      {/* ── Conta ── */}
      <Section title="Conta">
        <Row>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-500" aria-hidden="true" />
              <div>
                <p className="font-medium text-[#733D26]">Excluir conta</p>
                <p className="text-xs text-gray-500">Remove permanentemente todos os dados</p>
              </div>
            </div>
            <Link to="/delete-account" className="text-sm text-red-500 hover:text-red-700 underline min-h-[36px] flex items-center transition-colors">
              Excluir
            </Link>
          </div>
        </Row>
        <Row>
          <button onClick={() => setLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] font-medium">
            <LogOut size={20} aria-hidden="true" />
            Sair da conta
          </button>
        </Row>
      </Section>

      {/* ── Logout Confirmation Dialog ── */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLogoutConfirm(false)} aria-hidden="true" />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm z-10">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="text-red-500" size={28} aria-hidden="true" />
              <h2 id="logout-title" className="text-xl font-bold text-[#733D26]">Sair da conta?</h2>
            </div>
            <p className="text-gray-600 mb-6">Você será redirecionado para a tela de login. Suas configurações e dados ficam salvos no dispositivo.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-[#FAF9F6] transition-colors font-medium min-h-[44px]">
                Cancelar
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium min-h-[44px]">
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MainLayout ───────────────────────────────────────────────────────────────
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = storage.getUser();

  useEffect(() => {
    if (!storage.isAuthenticated()) navigate('/login', { replace: true });
  }, [navigate]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navItems = [
    { path: '/app', icon: Home, label: 'Painel' },
    { path: '/app/closet', icon: ShirtIcon, label: 'Meu Guarda-Roupa' },
    { path: '/app/add-item', icon: PlusCircle, label: 'Adicionar Peça' },
    { path: '/app/look-builder', icon: Sparkles, label: 'Criador de Look' },
    { path: '/app/looks', icon: BookMarked, label: 'Meus Looks' },
    { path: '/app/filters', icon: Filter, label: 'Filtros' },
    { path: '/app/trends', icon: TrendingUp, label: 'Tendências' },
    { path: '/app/conscious-buyer', icon: ShoppingBag, label: 'Compra Inteligente' },
    { path: '/app/about', icon: Info, label: 'Sobre' },
    { path: '/app/settings', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (path: string) => path === '/app' ? location.pathname === path : location.pathname.startsWith(path);

  const NavLink = ({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) => {
    const active = isActive(path);
    return (
      <li>
        <Link to={path}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-[44px] ${active ? 'bg-[#FFB6C1] text-[#733D26] font-medium' : 'text-gray-700 hover:bg-pink-50'} ${sidebarCollapsed ? 'justify-center' : ''}`}
          aria-current={active ? 'page' : undefined}
          title={sidebarCollapsed ? label : undefined}
        >
          <Icon size={20} aria-hidden="true" />
          {!sidebarCollapsed && <span className="truncate">{label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Header */}
      <header className="bg-[#733D26] text-white sticky top-0 z-50 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <img src="/logo.png" alt="" aria-hidden="true" className="w-20 h-20 object-contain brightness-0 invert" />
            {!sidebarCollapsed && <h1 className="text-lg font-semibold tracking-widest">DREAMCLOSET</h1>}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/settings" className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Configurações">
              <Settings size={20} aria-hidden="true" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user?.photoUrl
                ? <img src={user.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                : <User size={16} aria-hidden="true" />
              }
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <nav
          className={`
            fixed lg:relative inset-y-0 left-0 top-[52px] lg:top-0 z-40
            bg-[#FAF9F6] border-r border-pink-100
            flex flex-col transition-all duration-300
            ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
          `}
          aria-label="Navegação principal"
        >
          {/* Desktop collapse toggle */}
          <div className="hidden lg:flex justify-end p-2 border-b border-pink-100">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-[#FDE8EC] transition-colors text-gray-500"
              aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav links */}
          <ul className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item => <NavLink key={item.path} {...item} />)}
          </ul>

          {/* User footer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-pink-100">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-[#FDE8EC] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.photoUrl
                    ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                    : <User size={16} className="text-[#733D26]" aria-hidden="true" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#733D26] truncate">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  { path: '/', Component: Splash },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/delete-account', Component: DeleteAccount },
  {
    path: '/app', Component: MainLayout,
    children: [
      { index: true, Component: HomeScreen },
      { path: 'closet', Component: ClothingInterface },
      { path: 'add-item', Component: ItemRegistration },
      { path: 'edit-item/:id', Component: ItemRegistration },
      { path: 'look-builder', Component: LookBuilder },
      { path: 'looks', Component: LookRegistry },
      { path: 'predefined-looks', Component: PredefinedLooks },
      { path: 'filters', Component: Filters },
      { path: 'style-assistant', Component: StyleAssistant },
      { path: 'trends', Component: TrendMatcher },
      { path: 'conscious-buyer', Component: ConsciousBuyer },
      { path: 'about', Component: About },
      { path: 'settings', Component: SettingsScreen },
    ],
  },
]);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}
