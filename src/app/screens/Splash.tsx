import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { storage } from '../utils/storage';
import { Shirt } from 'lucide-react';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (storage.isAuthenticated()) {
        navigate('/app');
      } else {
        navigate('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-[#FFB6C1]/30">
            <Shirt className="text-[#733D26]" size={64} aria-hidden="true" />
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
