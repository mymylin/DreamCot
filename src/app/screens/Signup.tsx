import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { storage } from '../utils/storage';
import { Shirt } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    storage.saveUser({
      name,
      email,
      personalStyle: [],
      joinedAt: new Date().toISOString(),
    });

    storage.setAuthenticated(true);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8B0CB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#FFB6C1]/30 mb-4">
            <Shirt className="text-[#733D26]" size={48} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
          <p className="text-gray-700 mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#733D26] mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
              placeholder="Seu nome"
              aria-required="true"
            />
          </div>

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
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-sm text-gray-700 mt-1">
              Mínimo de 8 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#733D26] mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
              placeholder="••••••••"
              aria-required="true"
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
            Criar Conta
          </button>

          <p className="text-center text-gray-700">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#733D26] font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
