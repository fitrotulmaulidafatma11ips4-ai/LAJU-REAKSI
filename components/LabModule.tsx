import React, { useState, useEffect } from 'react';
import { simulateLabExperiment } from '../services/geminiService';
import { LabReport } from '../types';

interface LabModuleProps {
  title: string;
  topic: string; // e.g., "Luas Permukaan"
  description: string;
  storageKey: string;
}

const LabModule: React.FC<LabModuleProps> = ({ title, topic, description, storageKey }) => {
  const [simulationInput, setSimulationInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<LabReport>({
    variable: '',
    observation: '',
    analysis: '',
    conclusion: ''
  });

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setReport(JSON.parse(saved));
    }
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(report));
    alert('Data tersimpan di browser Anda!');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const runSimulation = async () => {
    if (!simulationInput.trim()) return;
    setLoading(true);
    const result = await simulateLabExperiment(topic, simulationInput);
    setAiResult(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-md border-t-4 border-purple-500 no-print">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulation Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl no-print">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
              <i className="fas fa-robot text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg">Asisten Lab AI</h3>
              <p className="text-xs text-slate-400">Simulasikan eksperimenmu di sini</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Apa yang ingin kamu ubah pada percobaan ini?
              </label>
              <input
                type="text"
                value={simulationInput}
                onChange={(e) => setSimulationInput(e.target.value)}
                placeholder={`Contoh: Menggunakan ${topic} yang sangat besar/kecil`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Mensimulasikan...
                </span>
              ) : (
                'Jalankan Eksperimen'
              )}
            </button>

            {aiResult && (
              <div className="bg-slate-800 rounded-xl p-4 mt-4 border border-slate-700 animate-fade-in">
                <h4 className="text-purple-400 text-sm font-bold mb-2">Hasil Observasi:</h4>
                <p className="text-sm leading-relaxed">{aiResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Section - Printable */}
        <div className="bg-white rounded-2xl p-8 shadow-lg print-only">
          <div className="flex justify-between items-center mb-6 no-print">
            <h3 className="text-xl font-bold text-slate-800">
              <i className="fas fa-clipboard-check text-purple-600 mr-2"></i>
              Laporan Praktikum
            </h3>
            <div className="space-x-2">
              <button onClick={handleSave} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                <i className="fas fa-save mr-1"></i> Simpan
              </button>
              <button onClick={handleDownloadPDF} className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg transition-colors">
                <i className="fas fa-file-pdf mr-1"></i> PDF
              </button>
            </div>
          </div>
          
          {/* Header for PDF only */}
          <div className="hidden print-only mb-6 border-b-2 border-black pb-4">
             <h1 className="text-2xl font-bold text-center">LAPORAN PRAKTIKUM KIMIA</h1>
             <h2 className="text-xl text-center">Topik: {topic}</h2>
             <p className="text-center mt-2">ChemiLearn Modular</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Variabel Percobaan</label>
              <textarea
                value={report.variable}
                onChange={(e) => setReport({ ...report, variable: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
                placeholder="Jelaskan variabel bebas, terikat, dan kontrol..."
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Hasil Pengamatan</label>
              <textarea
                value={report.observation}
                onChange={(e) => setReport({ ...report, observation: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[100px]"
                placeholder="Catat apa yang terjadi selama simulasi..."
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Pembahasan & Analisis</label>
              <textarea
                value={report.analysis}
                onChange={(e) => setReport({ ...report, analysis: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[120px]"
                placeholder="Hubungkan hasil pengamatan dengan teori tumbukan..."
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Kesimpulan</label>
              <textarea
                value={report.conclusion}
                onChange={(e) => setReport({ ...report, conclusion: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
                placeholder="Simpulkan pengaruh faktor ini terhadap laju reaksi..."
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LabModule;