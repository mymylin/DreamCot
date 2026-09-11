import { useState } from 'react';
import { useNavigate } from 'react-router';
import { storage } from '../utils/storage';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export function DeleteAccount() {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmation !== 'EXCLUIR') {
      setError('Por favor, digite EXCLUIR para confirmar');
      return;
    }

    storage.clearAll();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#733D26] mb-6 min-h-[44px]"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Voltar
          </button>

          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" size={32} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-[#733D26]">Excluir Conta</h1>
          </div>
          <p className="text-gray-500">
            Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos deste dispositivo.
          </p>
        </div>

        <form onSubmit={handleDelete} className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="font-semibold text-red-900 mb-3">O que será excluído:</h2>
            <ul className="space-y-2 text-red-800">
              <li>• Todas as suas peças de roupa</li>
              <li>• Todos os looks e outfits salvos</li>
              <li>• Suas preferências de estilo pessoal</li>
              <li>• Informações da conta</li>
            </ul>
          </div>

          <div>
            <label htmlFor="confirmation" className="block text-sm font-medium text-[#733D26] mb-2">
              Digite <strong>EXCLUIR</strong> para confirmar
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent min-h-[44px] bg-white"
              placeholder="EXCLUIR"
              required
              aria-required="true"
              aria-describedby="confirmation-hint"
            />
            <p id="confirmation-hint" className="text-sm text-gray-500 mt-1">
              Deve ser digitado em letras maiúsculas
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors min-h-[44px] font-medium"
          >
            Excluir conta permanentemente
          </button>
        </form>
      </div>
    </div>
  );
}
