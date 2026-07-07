import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-8 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/80 text-center text-xs text-gray-400 dark:text-gray-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="text-left">
          <span className="font-semibold text-gray-500 dark:text-gray-400">HealthMate AI</span> — Dasbor & Asisten Edukasi Kesehatan.
        </div>
        <div className="max-w-md text-xs italic leading-relaxed md:text-right text-gray-400 dark:text-gray-500">
          Penafian: HealthMate AI memberikan informasi kesehatan untuk tujuan edukasi. Informasi yang diberikan bukan merupakan diagnosis medis dan tidak menggantikan konsultasi langsung dengan dokter atau tenaga kesehatan profesional.
        </div>
      </div>
    </footer>
  );
};
