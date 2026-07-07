import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center space-y-6 py-12 px-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center relative">
            <Heart className="w-8 h-8 fill-current" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
              !
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black font-display text-gray-900 dark:text-white">404 Error</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-2xl py-3"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="flex-1 rounded-2xl py-3"
            leftIcon={<Home className="w-4 h-4 text-white" />}
          >
            Halaman Utama
          </Button>
        </div>
      </Card>
    </div>
  );
};
