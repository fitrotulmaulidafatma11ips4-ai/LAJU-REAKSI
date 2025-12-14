import React from 'react';
import { ModuleType } from '../types';

interface LandingPageProps {
  setModule: (m: ModuleType) => void;
  quote: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ setModule, quote }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-400 opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 border border-white/20">
            👋 Selamat Datang di ChemiLearn
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Kuasai <span className="text-yellow-300">Laju Reaksi</span><br />
            Dengan Cara Seru!
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-2xl">
            <p className="text-indigo-100 text-lg italic mb-2">
              <i className="fas fa-quote-left mr-2 opacity-50"></i>
              {quote}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-indigo-50 dark:border-slate-700 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl mb-6">
            <i className="fas fa-bullseye"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Tujuan Pembelajaran</h3>
          <ul className="space-y-4">
            {[
              "Memahami teori tumbukan dan faktor-faktor yang mempengaruhi laju reaksi.",
              "Menganalisis pengaruh luas permukaan, konsentrasi, suhu, dan katalis melalui simulasi AI.",
              "Menyajikan hasil analisis data percobaan dalam bentuk laporan.",
              "Menerapkan konsep laju reaksi dalam pemecahan masalah sehari-hari."
            ].map((goal, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-indigo-50 dark:border-slate-700 transition-all">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <i className="fas fa-map-signs text-indigo-500 mr-3"></i>
            Jalur Pembelajaran
          </h3>
          <div className="space-y-4">
            <button onClick={() => setModule(ModuleType.THEORY)} className="w-full text-left p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center group border border-transparent dark:border-emerald-900/30">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-200 shadow-sm mr-4 group-hover:scale-110 transition-transform">1</div>
              <div>
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">Teori Dasar</h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">Pahami konsep dasarnya</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-emerald-400 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <button onClick={() => setModule(ModuleType.LAB_SURFACE)} className="w-full text-left p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center group border border-transparent dark:border-purple-900/30">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-200 shadow-sm mr-4 group-hover:scale-110 transition-transform">2</div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-200">Praktikum AI</h4>
                <p className="text-sm text-purple-700 dark:text-purple-400">4 Modul eksperimen interaktif</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-purple-400 group-hover:translate-x-1 transition-transform"></i>
            </button>

             <button onClick={() => setModule(ModuleType.LKPD)} className="w-full text-left p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors flex items-center group border border-transparent dark:border-orange-900/30">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-200 shadow-sm mr-4 group-hover:scale-110 transition-transform">3</div>
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-200">LKPD (PBL)</h4>
                <p className="text-sm text-orange-700 dark:text-orange-400">Lembar Kerja Problem Based Learning</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-orange-400 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <button onClick={() => setModule(ModuleType.QUIZ)} className="w-full text-left p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center group border border-transparent dark:border-rose-900/30">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-200 shadow-sm mr-4 group-hover:scale-110 transition-transform">4</div>
              <div>
                <h4 className="font-semibold text-rose-900 dark:text-rose-200">Evaluasi</h4>
                <p className="text-sm text-rose-700 dark:text-rose-400">Uji pemahamanmu</p>
              </div>
              <i className="fas fa-arrow-right ml-auto text-rose-400 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;