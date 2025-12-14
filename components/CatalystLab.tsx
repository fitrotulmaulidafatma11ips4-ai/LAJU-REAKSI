import React, { useState, useEffect } from 'react';

type FlaskState = {
  id: 'CONTROL' | 'CATALYST';
  hasH2O2: boolean;
  hasSoap: boolean;
  hasCatalyst: boolean;
  foamHeight: number;
  isReacting: boolean;
  startTime: number;
  timeResult: number | null;
};

const CatalystLab: React.FC = () => {
  const [activeFlask, setActiveFlask] = useState<'CONTROL' | 'CATALYST'>('CONTROL');
  const [flasks, setFlasks] = useState<{ [key: string]: FlaskState }>({
    CONTROL: { id: 'CONTROL', hasH2O2: false, hasSoap: false, hasCatalyst: false, foamHeight: 0, isReacting: false, startTime: 0, timeResult: null },
    CATALYST: { id: 'CATALYST', hasH2O2: false, hasSoap: false, hasCatalyst: false, foamHeight: 0, isReacting: false, startTime: 0, timeResult: null }
  });
  
  const [instruction, setInstruction] = useState("Siapkan Tabung Reaksi. Klik Tabung KIRI (Kontrol) untuk memulai.");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Laporan Auto-save
  const [report, setReport] = useState({
    observationControl: '',
    observationCatalyst: '',
    analysis: '',
    conclusion: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('lab_catalyst_data');
    if (saved) {
        try { setReport(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveReport = (key: string, value: string) => {
    const newData = { ...report, [key]: value };
    setReport(newData);
    localStorage.setItem('lab_catalyst_data', JSON.stringify(newData));
  };

  // Logic Reaksi
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTimer(t => t + 0.1);
        
        setFlasks(prev => {
          const next = { ...prev };
          let changed = false;
          let doneCount = 0;

          // Tabung Kontrol (Tanpa Katalis)
          if (next.CONTROL.isReacting) {
            const f = next.CONTROL;
            if (f.foamHeight < 5) {
                next.CONTROL = { ...f, foamHeight: f.foamHeight + 0.05 };
            } else {
                const finishTime = Number((timer + 0.1).toFixed(1));
                const duration = finishTime - f.startTime;
                next.CONTROL = { 
                    ...f, 
                    isReacting: false, 
                    timeResult: Number(duration.toFixed(1)) 
                };
            }
            changed = true;
          } else if (next.CONTROL.timeResult) {
            doneCount++;
          }

          // Tabung Katalis (Ada MnO2)
          if (next.CATALYST.isReacting) {
            const f = next.CATALYST;
            if (f.foamHeight < 100) {
                 next.CATALYST = { ...f, foamHeight: f.foamHeight + 2.0 };
            } else {
                 const finishTime = Number((timer + 0.1).toFixed(1));
                 const duration = finishTime - f.startTime;
                 next.CATALYST = { 
                    ...f, 
                    isReacting: false, 
                    timeResult: Number(duration.toFixed(1)) 
                };
            }
            changed = true;
          } else if (next.CATALYST.timeResult) {
            doneCount++;
          }

          if (doneCount === 2) {
             setIsRunning(false);
             setInstruction("Reaksi Selesai. Bandingkan tinggi busa kedua tabung.");
          }

          return changed ? next : prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Actions
  const handleFlaskClick = (id: 'CONTROL' | 'CATALYST') => {
    setActiveFlask(id);
    if (!flasks[id].hasH2O2) setInstruction(`Tabung ${id} dipilih. Langkah 1: Tuang H₂O₂ (Hidrogen Peroksida).`);
    else if (!flasks[id].hasSoap) setInstruction(`Tabung ${id}. Langkah 2: Tambahkan Sabun (Indikator Gelembung).`);
    else if (id === 'CATALYST' && !flasks[id].hasCatalyst) setInstruction(`Tabung ${id}. Langkah 3: Tambahkan Katalis MnO₂.`);
    else if (id === 'CONTROL') setInstruction(`Tabung Kontrol tidak perlu katalis. Siap untuk diamati.`);
  };

  const addChemical = (type: 'H2O2' | 'SOAP' | 'MNO2') => {
    const current = flasks[activeFlask];
    
    if (type === 'H2O2') {
      if (current.hasH2O2) return;
      setFlasks(prev => ({ ...prev, [activeFlask]: { ...current, hasH2O2: true } }));
      setInstruction("H₂O₂ ditambahkan. Selanjutnya: Sabun.");
    } else if (type === 'SOAP') {
      if (!current.hasH2O2) { setInstruction("⚠️ Tuang H₂O₂ dulu!"); return; }
      if (current.hasSoap) return;
      setFlasks(prev => ({ ...prev, [activeFlask]: { ...current, hasSoap: true } }));
      setInstruction(activeFlask === 'CATALYST' ? "Sekarang tambahkan katalis MnO₂." : "Tabung Kontrol siap.");
    } else if (type === 'MNO2') {
      if (activeFlask === 'CONTROL') { setInstruction("⚠️ Tabung Kontrol tidak memakai katalis!"); return; }
      if (!current.hasSoap) { setInstruction("⚠️ Tambahkan sabun dulu!"); return; }
      setFlasks(prev => ({ ...prev, [activeFlask]: { ...current, hasCatalyst: true } }));
      setInstruction("Katalis siap! Klik 'Mulai Reaksi' untuk melihat perbandingan.");
    }
  };

  const startAll = () => {
    if (!flasks.CONTROL.hasSoap || !flasks.CATALYST.hasCatalyst) {
      setInstruction("⚠️ Pastikan kedua tabung sudah terisi bahan lengkap!");
      return;
    }
    if (flasks.CONTROL.timeResult || flasks.CATALYST.timeResult) {
        setInstruction("⚠️ Reset dulu.");
        return;
    }

    setTimer(0);
    setFlasks(prev => ({
       CONTROL: { ...prev.CONTROL, isReacting: true, startTime: 0 },
       CATALYST: { ...prev.CATALYST, isReacting: true, startTime: 0 }
    }));
    setIsRunning(true);
    setInstruction("Mengamati laju peruraian H₂O₂...");
  };

  const reset = () => {
    setFlasks({
        CONTROL: { id: 'CONTROL', hasH2O2: false, hasSoap: false, hasCatalyst: false, foamHeight: 0, isReacting: false, startTime: 0, timeResult: null },
        CATALYST: { id: 'CATALYST', hasH2O2: false, hasSoap: false, hasCatalyst: false, foamHeight: 0, isReacting: false, startTime: 0, timeResult: null }
    });
    setTimer(0);
    setIsRunning(false);
    setInstruction("Siapkan Tabung Reaksi. Klik Tabung KIRI (Kontrol) untuk memulai.");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-purple-500 no-print">
         <h2 className="text-2xl font-bold text-slate-800">Lab 4: Katalis</h2>
         <p className="text-gray-600 mb-2">Topik: Peruraian Hidrogen Peroksida (H₂O₂) dengan Katalis MnO₂.</p>
         <div className="flex items-center text-purple-700 bg-purple-50 p-2 rounded text-sm font-medium">
            <i className="fas fa-info-circle mr-2"></i> {instruction}
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* WORKBENCH (Hidden on Print) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 shadow-2xl relative min-h-[500px] border-4 border-slate-700 flex flex-col no-print">
           {/* Scene */}
           <div className="flex-1 flex justify-center items-end space-x-20 pb-10 relative">
              
              {/* Tabung Kontrol */}
              <div 
                onClick={() => handleFlaskClick('CONTROL')}
                className={`relative cursor-pointer transition-transform hover:scale-105 ${activeFlask === 'CONTROL' ? 'scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-80'}`}
              >
                  {/* Busa */}
                  <div className="absolute bottom-0 w-16 bg-white rounded-t-lg transition-all duration-100 overflow-hidden opacity-90" style={{ height: `${flasks.CONTROL.foamHeight + (flasks.CONTROL.hasH2O2 ? 40 : 0)}px` }}></div>
                  {/* Glass */}
                  <div className="w-16 h-64 border-x-2 border-b-4 border-slate-400 bg-blue-400/10 rounded-b-xl relative backdrop-blur-sm">
                      {/* Liquid Layer */}
                      <div className={`absolute bottom-0 w-full transition-all duration-500 ${flasks.CONTROL.hasH2O2 ? 'h-16' : 'h-0'} bg-blue-300/30`}></div>
                      {flasks.CONTROL.hasSoap && <div className="absolute bottom-16 w-full h-2 bg-pink-300/50"></div>}
                  </div>
                  <div className="text-center text-white mt-2 font-bold text-sm">Tabung A (Kontrol)</div>
              </div>

              {/* Tabung Katalis */}
              <div 
                onClick={() => handleFlaskClick('CATALYST')}
                className={`relative cursor-pointer transition-transform hover:scale-105 ${activeFlask === 'CATALYST' ? 'scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-80'}`}
              >
                  {/* Busa Elephant Toothpaste */}
                  <div className="absolute bottom-0 w-16 bg-gradient-to-t from-white to-yellow-100 rounded-t-lg transition-all duration-100 overflow-hidden opacity-95" style={{ height: `${flasks.CATALYST.foamHeight * 2.5 + (flasks.CATALYST.hasH2O2 ? 40 : 0)}px` }}>
                     {flasks.CATALYST.isReacting && <div className="w-full h-full animate-pulse bg-white/50"></div>}
                  </div>
                  {/* Glass */}
                  <div className="w-16 h-64 border-x-2 border-b-4 border-slate-400 bg-blue-400/10 rounded-b-xl relative backdrop-blur-sm z-10">
                      <div className={`absolute bottom-0 w-full transition-all duration-500 ${flasks.CATALYST.hasH2O2 ? 'h-16' : 'h-0'} bg-blue-300/30`}></div>
                      {flasks.CATALYST.hasSoap && <div className="absolute bottom-16 w-full h-2 bg-pink-300/50"></div>}
                      {flasks.CATALYST.hasCatalyst && <div className="absolute bottom-0 w-full h-2 bg-black rounded-full opacity-80"></div>}
                  </div>
                  <div className="text-center text-white mt-2 font-bold text-sm">Tabung B (+ MnO₂)</div>
              </div>

           </div>

           {/* Toolbar */}
           <div className="bg-slate-800 p-4 rounded-xl flex justify-center gap-6 border-t border-slate-600">
              <button onClick={() => addChemical('H2O2')} className="flex flex-col items-center group">
                 <div className="w-10 h-14 bg-blue-900 rounded border border-blue-500 relative group-hover:-translate-y-2 transition-transform">
                    <span className="text-[8px] text-white absolute top-4 left-1">H₂O₂</span>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">1. H₂O₂</span>
              </button>
              
              <button onClick={() => addChemical('SOAP')} className="flex flex-col items-center group">
                 <div className="w-10 h-14 bg-pink-500 rounded-full border border-pink-300 relative group-hover:-translate-y-2 transition-transform">
                    <span className="text-[8px] text-white absolute top-4 left-2">Soap</span>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">2. Sabun</span>
              </button>

              <button onClick={() => addChemical('MNO2')} className="flex flex-col items-center group">
                 <div className="w-12 h-8 bg-black rounded-lg border-b-4 border-gray-600 relative group-hover:-translate-y-2 transition-transform mt-6">
                    <span className="text-[8px] text-white absolute top-1 left-2">MnO₂</span>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">3. Katalis</span>
              </button>

              <div className="border-l border-slate-600 mx-2"></div>

              <button 
                 onClick={startAll} 
                 disabled={isRunning}
                 className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg self-center disabled:opacity-50"
              >
                 {isRunning ? 'Berlangsung...' : 'Mulai Reaksi'}
              </button>

              <button onClick={reset} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg self-center">
                 <i className="fas fa-redo"></i>
              </button>
           </div>
        </div>

        {/* REPORT */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto print-only max-h-screen">
           <div className="flex justify-between items-center mb-4 no-print">
              <h3 className="font-bold text-lg text-slate-800">Laporan Data</h3>
              <button onClick={() => window.print()} className="bg-gray-100 p-2 rounded hover:bg-gray-200 text-sm font-semibold text-slate-700 border border-gray-300">
                 <i className="fas fa-print mr-2"></i>Unduh PDF
              </button>
           </div>

           {/* Header Print */}
           <div className="hidden print-only mb-6 border-b-2 border-black pb-4 text-center">
               <h1 className="text-2xl font-bold uppercase">Laporan Praktikum Kimia</h1>
               <h2 className="text-xl font-semibold mt-1">Topik: Faktor Katalis</h2>
               <p className="text-sm mt-2 text-gray-600">ChemiLearn - Media Pembelajaran Laju Reaksi</p>
           </div>

           <div className="space-y-4">
              {/* TABEL DATA OTOMATIS */}
              <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                 <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase">Tabel 3. Data Pengamatan</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                       <tr>
                          <th className="border p-2">Tabung</th>
                          <th className="border p-2">Perlakuan</th>
                          <th className="border p-2">Tinggi Busa</th>
                          <th className="border p-2">Waktu</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td className="border p-2 font-bold text-center">A</td>
                          <td className="border p-2">H₂O₂ + Sabun (Kontrol)</td>
                          <td className="border p-2 text-center">±{flasks.CONTROL.foamHeight.toFixed(1)} cm</td>
                          <td className="border p-2 text-center">{flasks.CONTROL.timeResult ? flasks.CONTROL.timeResult + ' s' : '-'}</td>
                       </tr>
                       <tr>
                          <td className="border p-2 font-bold text-center">B</td>
                          <td className="border p-2">H₂O₂ + Sabun + MnO₂</td>
                          <td className="border p-2 text-center">±{(flasks.CATALYST.foamHeight * 2.5).toFixed(1)} cm</td>
                          <td className="border p-2 text-center">{flasks.CATALYST.timeResult ? flasks.CATALYST.timeResult + ' s' : '-'}</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              {/* FORM LAPORAN */}
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Pengamatan Tabung A (Kontrol)</label>
                 <textarea 
                    value={report.observationControl}
                    onChange={(e) => saveReport('observationControl', e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    rows={3}
                    placeholder="Deskripsikan laju pembentukan gelembung pada tabung tanpa katalis..."
                 ></textarea>
              </div>
              
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Pengamatan Tabung B (+Katalis)</label>
                 <textarea 
                    value={report.observationCatalyst}
                    onChange={(e) => saveReport('observationCatalyst', e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    rows={3}
                    placeholder="Deskripsikan laju pembentukan gelembung setelah ditambah MnO2..."
                 ></textarea>
              </div>

              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Analisis (Fungsi Katalis)</label>
                 <textarea 
                    value={report.analysis}
                    onChange={(e) => saveReport('analysis', e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    rows={3}
                    placeholder="Jelaskan peran MnO2 dalam menurunkan energi aktivasi..."
                 ></textarea>
              </div>

              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Kesimpulan</label>
                 <textarea 
                    value={report.conclusion}
                    onChange={(e) => saveReport('conclusion', e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    rows={3}
                    placeholder="Buat kesimpulan tentang pengaruh katalis..."
                 ></textarea>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CatalystLab;