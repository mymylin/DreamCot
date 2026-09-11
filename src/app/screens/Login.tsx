import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { storage } from '../utils/storage';
import { Shirt } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    storage.setAuthenticated(true);

    if (!storage.getUser()) {
      storage.saveUser({
        name: email.split('@')[0],
        email,
        personalStyle: [],
        joinedAt: new Date().toISOString(),
      });
    }

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8B0CB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#FFB6C1]/30 mb-4">
            <Shirt className="text-[#733D26]" size={48} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
          <p className="text-gray-700 mt-2">Seu Guarda-Roupa Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#733D26] mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
              placeholder="seu@email.com"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#733D26] mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
              placeholder="••••••••"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#733D26] text-white py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] font-medium"
          >
            Entrar
          </button>

          <div className="space-y-3 text-center">
            <Link
              to="/forgot-password"
              className="block text-gray-700 hover:text-[#733D26] underline min-h-[44px] flex items-center justify-center"
            >
              Esqueceu a senha?
            </Link>
            <p className="text-gray-700">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-[#733D26] font-medium hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
