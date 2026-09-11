import { useState } from 'react';
import { Link } from 'react-router';
import { Shirt, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#FFB6C1]/30 mb-4">
            <Shirt className="text-[#733D26]" size={48} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#733D26] tracking-widest">DREAMCLOSET</h1>
          <p className="text-gray-500 mt-2">Redefinir sua senha</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#733D26] mb-2">
                Endereço de e-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
                placeholder="seu@email.com"
                required
                aria-required="true"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enviaremos instruções para redefinir sua senha.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#733D26] text-white py-3 rounded-lg hover:bg-[#8B4A30] transition-colors min-h-[44px] font-medium"
            >
              Enviar link de redefinição
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#733D26] min-h-[44px]"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar ao login
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-[#FDE8EC] border border-[#FFB6C1] rounded-lg p-6">
              <p className="text-[#733D26]">
                Instruções de redefinição foram enviadas para <strong>{email}</strong>
              </p>
            </div>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#733D26] min-h-[44px]"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar ao login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
