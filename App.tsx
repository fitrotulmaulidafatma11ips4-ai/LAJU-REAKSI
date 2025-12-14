import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import TheoryModule from './components/TheoryModule';
import LabModule from './components/LabModule';
import SurfaceAreaLab from './components/SurfaceAreaLab';
import ConcentrationLab from './components/ConcentrationLab';
import TemperatureLab from './components/TemperatureLab';
import CatalystLab from './components/CatalystLab'; // Import component baru
import LKPDModule from './components/LKPDModule';
import QuizModule from './components/QuizModule';
import AboutModule from './components/AboutModule';
import { ModuleType } from './types';
import { generateMotivationalQuote } from './services/geminiService';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.LANDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [quote, setQuote] = useState("Loading motivasi...");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check screen size for initial sidebar state
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    // Fetch quote
    const fetchQuote = async () => {
      const q = await generateMotivationalQuote();
      setQuote(q);
    };
    fetchQuote();

    // Init Dark Mode from LocalStorage
    const savedTheme = localStorage.getItem('chemilearn_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []); 

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chemilearn_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chemilearn_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Dynamic Content Renderer
  const renderContent = () => {
    switch (currentModule) {
      case ModuleType.LANDING:
        return <LandingPage setModule={setCurrentModule} quote={quote} />;
      case ModuleType.THEORY:
        return <TheoryModule />;
      case ModuleType.LAB_SURFACE:
        return <SurfaceAreaLab />;
      case ModuleType.LAB_CONCENTRATION:
        return <ConcentrationLab />;
      case ModuleType.LAB_TEMP:
        return <TemperatureLab />;
      case ModuleType.LAB_CATALYST:
        // Gunakan komponen spesifik untuk Lab Katalis
        return <CatalystLab />;
      case ModuleType.LKPD:
        return <LKPDModule />;
      case ModuleType.QUIZ:
        return <QuizModule />;
      case ModuleType.ABOUT:
        return <AboutModule />;
      default:
        return <LandingPage setModule={setCurrentModule} quote={quote} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <Sidebar 
        currentModule={currentModule} 
        setModule={setCurrentModule}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen && window.innerWidth >= 768 ? 'ml-72' : 'ml-0'} relative`}>
        
        <div className="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
            {/* Header for Mobile only (since Sidebar covers desktop header) */}
            <div className="md:hidden flex justify-end mb-4 mr-16">
               <span className="text-xs font-medium text-slate-400 dark:text-slate-500">ChemiLearn Mobile</span>
            </div>
            
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;