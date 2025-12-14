import React from 'react';
import { NavItem, ModuleType } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  setModule: (m: ModuleType) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const navItems: NavItem[] = [
  { id: ModuleType.LANDING, label: 'Beranda', icon: 'fa-home', color: 'text-blue-600 dark:text-blue-400' },
  { id: ModuleType.THEORY, label: 'Teori Dasar & Peta', icon: 'fa-book', color: 'text-emerald-600 dark:text-emerald-400' },
  { id: ModuleType.LAB_SURFACE, label: 'Lab 1: Luas Permukaan', icon: 'fa-flask', color: 'text-purple-600 dark:text-purple-400' },
  { id: ModuleType.LAB_CONCENTRATION, label: 'Lab 2: Konsentrasi', icon: 'fa-vial', color: 'text-purple-600 dark:text-purple-400' },
  { id: ModuleType.LAB_TEMP, label: 'Lab 3: Suhu', icon: 'fa-temperature-high', color: 'text-purple-600 dark:text-purple-400' },
  { id: ModuleType.LAB_CATALYST, label: 'Lab 4: Katalis', icon: 'fa-atom', color: 'text-purple-600 dark:text-purple-400' },
  { id: ModuleType.LKPD, label: 'LKPD (PBL)', icon: 'fa-clipboard-list', color: 'text-orange-600 dark:text-orange-400' },
  { id: ModuleType.QUIZ, label: 'Evaluasi HOTS', icon: 'fa-brain', color: 'text-rose-600 dark:text-rose-400' },
  { id: ModuleType.ABOUT, label: 'Profil & Glosarium', icon: 'fa-info-circle', color: 'text-gray-600 dark:text-gray-400' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentModule, setModule, isOpen, setIsOpen, isDarkMode, toggleDarkMode }) => {
  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg md:hidden text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto no-print border-r border-gray-100 dark:border-slate-700`}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                ChemiLearn
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Laju Reaksi Modular</p>
          </div>
          {/* Dark Mode Toggle Small */}
          <button 
             onClick={toggleDarkMode}
             className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-yellow-400 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
          >
             <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setModule(item.id);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentModule === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:pl-5'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentModule === item.id ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-gray-100 dark:bg-slate-700'}`}>
                <i className={`fas ${item.icon} ${item.color}`}></i>
              </div>
              <span className="font-medium text-sm text-left">{item.label}</span>
              {currentModule === item.id && (
                <i className="fas fa-chevron-right ml-auto text-xs opacity-50"></i>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent">
          <div className="bg-indigo-600 dark:bg-indigo-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-indigo-300/50 dark:hover:shadow-none transition-shadow">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
            <p className="text-xs font-semibold opacity-80 mb-1">Mulai Belajar</p>
            <p className="text-sm font-bold">Jelajahi Dunia Kimia!</p>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;