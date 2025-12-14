import React, { useState, useEffect, useRef } from 'react';

type FlaskState = {
  id: 'A' | 'B' | 'C';
  targetTemp: number; // 25, 35, 45
  currentTemp: number;
  hasNa2S2O3: boolean;
  hasHCl: boolean;
  isOnHeater: boolean;
  opacity: number; // 0 to 1 (clear to cloudy)
  isReacting: boolean;
  startTime: number; // Stores the timer value when reaction started
  timeResult: number | null;
};

const TemperatureLab: React.FC = () => {
  const [activeFlask, setActiveFlask] = useState<'A' | 'B' | 'C'>('A');
  const [flasks, setFlasks] = useState<{ [key: string]: FlaskState }>({
    A: { id: 'A', targetTemp: 25, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
    B: { id: 'B', targetTemp: 35, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
    C: { id: 'C', targetTemp: 45, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
  });

  const [instruction, setInstruction] = useState("Klik Gelas A (Target 25°C) untuk memulai.");
  const [globalTimer, setGlobalTimer] = useState(0);
  const [burnerOn, setBurnerOn] = useState(false);

  // Laporan Auto-save
  const [report, setReport] = useState({
    obs: '', graphAnalysis: '', conclusion: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('lab_temp_data');
    if (saved) {
        try { setReport(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveReport = (key: string, value: string) => {
    const newData = { ...report, [key]: value };
    setReport(newData);
    localStorage.setItem('lab_temp_data', JSON.stringify(newData));
  };

  // --- LOGIC 1: PEMANASAN (HEATING) ---
  useEffect(() => {
    let heatInterval: number;
    if (burnerOn) {
      heatInterval = window.setInterval(() => {
        setFlasks(prev => {
          const next = { ...prev };
          let changed = false;
          
          (['A', 'B', 'C'] as const).forEach(key => {
            const f = next[key];
            // Hanya panaskan jika ada di pemanas DAN suhu belum mencapai target
            if (f.isOnHeater && f.currentTemp < f.targetTemp) {
              const newTemp = Math.min(f.targetTemp, f.currentTemp + 1);
              next[key] = { ...f, currentTemp: newTemp };
              changed = true;
            }
          });
          
          return changed ? next : prev;
        });
      }, 200); // Update suhu setiap 200ms
    }
    return () => clearInterval(heatInterval);
  }, [burnerOn]);

  // --- LOGIC 2: REAKSI & TIMER ---
  useEffect(() => {
    let reactionInterval: number;
    const isAnyReacting = flasks.A.isReacting || flasks.B.isReacting || flasks.C.isReacting;

    if (isAnyReacting) {
      reactionInterval = window.setInterval(() => {
        setGlobalTimer(t => t + 0.1);

        setFlasks(prev => {
          const next = { ...prev };
          let changed = false;

          (['A', 'B', 'C'] as const).forEach(key => {
            const f = next[key];
            if (f.isReacting) {
              // Arrhenius Approximation: Setiap kenaikan 10C, laju ~2x lebih cepat
              // Base speed pada 25C sekitar 0.005 per tick (butuh ~200 tick = 20 detik)
              const tempDiff = f.currentTemp - 25;
              const factor = Math.pow(2, tempDiff / 10); 
              const speed = 0.005 * factor;

              const newOpacity = f.opacity + speed;

              if (newOpacity >= 1) {
                // Reaksi Selesai
                const finishTime = Number((globalTimer + 0.1).toFixed(1));
                const duration = finishTime - f.startTime;
                
                next[key] = { 
                    ...f, 
                    opacity: 1, 
                    isReacting: false, 
                    timeResult: Number(Math.max(0.1, duration).toFixed(1)) 
                };
              } else {
                next[key] = { ...f, opacity: newOpacity };
              }
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      }, 100);
    }
    return () => clearInterval(reactionInterval);
  }, [flasks.A.isReacting, flasks.B.isReacting, flasks.C.isReacting, globalTimer]);

  // --- INTERAKSI USER ---

  const handleFlaskClick = (id: 'A' | 'B' | 'C') => {
    setActiveFlask(id);
    const f = flasks[id];
    updateInstruction(id, f);
  };

  const updateInstruction = (id: 'A'|'B'|'C', f: FlaskState) => {
    if (f.timeResult) {
        setInstruction(`Gelas ${id}: Reaksi selesai dalam ${f.timeResult} detik.`);
        return;
    }
    if (f.isReacting) {
        setInstruction(`Gelas ${id}: Reaksi sedang berlangsung...`);
        return;
    }
    
    // Cek Suhu
    if (f.currentTemp < f.targetTemp) {
        setInstruction(`⚠️ Gelas ${id}: Suhu saat ini ${f.currentTemp}°C. Target ${f.targetTemp}°C. Letakkan di pemanas!`);
        return;
    }

    // Cek Bahan
    if (!f.hasNa2S2O3) {
        setInstruction(`Gelas ${id}: Suhu tercapai. Masukkan Larutan Na₂S₂O₃.`);
    } else if (!f.hasHCl) {
        setInstruction(`Gelas ${id}: Masukkan Larutan HCl untuk memulai stopwatch.`);
    } else {
        setInstruction(`Gelas ${id} siap.`);
    }
  };

  const toggleHeaterPlace = () => {
    setFlasks(prev => {
        const f = prev[activeFlask];
        
        // Validasi
        if (f.hasNa2S2O3 || f.hasHCl) {
            setInstruction("⚠️ Bahaya! Jangan panaskan gelas yang sudah berisi zat kimia!");
            return prev;
        }
        if (f.currentTemp >= f.targetTemp && !f.isOnHeater) {
            setInstruction("⚠️ Suhu target sudah tercapai/terlewati. Tidak perlu dipanaskan lagi.");
            return prev;
        }

        const newState = { ...f, isOnHeater: !f.isOnHeater };
        
        // Update instruction immediately for better UX
        if (newState.isOnHeater) setInstruction("Gelas diletakkan di pemanas. Nyalakan api jika belum.");
        else setInstruction("Gelas diangkat dari pemanas.");

        return { ...prev, [activeFlask]: newState };
    });
  };

  const toggleBurner = () => {
    setBurnerOn(!burnerOn);
    setInstruction(burnerOn ? "Api dimatikan." : "Api menyala. Suhu akan naik perlahan.");
  };

  const addNa2S2O3 = () => {
    setFlasks(prev => {
        const f = prev[activeFlask];
        
        if (f.isOnHeater) {
            setInstruction("⚠️ Angkat gelas dari pemanas sebelum mengisi larutan!");
            return prev;
        }
        if (f.currentTemp < f.targetTemp) {
            setInstruction(`⚠️ Suhu belum cukup! Panaskan hingga ${f.targetTemp}°C.`);
            return prev;
        }
        if (f.hasNa2S2O3) return prev;

        setInstruction("Na₂S₂O₃ ditambahkan. Selanjutnya: HCl.");
        return { ...prev, [activeFlask]: { ...f, hasNa2S2O3: true } };
    });
  };

  const addHCl = () => {
    setFlasks(prev => {
        const f = prev[activeFlask];
        if (!f.hasNa2S2O3) {
            setInstruction("⚠️ Urutan salah! Masukkan Na₂S₂O₃ terlebih dahulu.");
            return prev;
        }
        if (f.hasHCl) return prev;

        // Logic Timer Cerdas:
        // Jika ada reaksi lain yang sedang berjalan, kita IKUT timer tersebut (offset startTime).
        // Jika TIDAK ada reaksi lain, kita reset timer global ke 0 agar user melihat angka dari 0.
        const otherReacting = Object.values(prev).some(flask => flask.isReacting);
        const currentTimerVal = otherReacting ? globalTimer : 0;
        
        // Side effect: Reset timer if needed
        if (!otherReacting) setGlobalTimer(0);

        setInstruction("Reaksi dimulai! Perhatikan tanda silang.");
        return { 
            ...prev, 
            [activeFlask]: { 
                ...f, 
                hasHCl: true, 
                isReacting: true, 
                startTime: currentTimerVal 
            } 
        };
    });
  };

  const reset = () => {
    setFlasks({
        A: { id: 'A', targetTemp: 25, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
        B: { id: 'B', targetTemp: 35, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
        C: { id: 'C', targetTemp: 45, currentTemp: 25, hasNa2S2O3: false, hasHCl: false, isOnHeater: false, opacity: 0, isReacting: false, startTime: 0, timeResult: null },
    });
    setGlobalTimer(0);
    setBurnerOn(false);
    setActiveFlask('A');
    setInstruction("Simulasi di-reset. Mulai dari Gelas A.");
  };

  // Helper untuk mendapatkan status gelas saat ini untuk UI
  const currentF = flasks[activeFlask];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-rose-500 no-print">
         <h2 className="text-2xl font-bold text-slate-800">Lab 3: Faktor Suhu</h2>
         <p className="text-gray-600 mb-2">Topik: Pengaruh Suhu pada Reaksi Na₂S₂O₃ + HCl.</p>
         <div className={`flex items-center p-3 rounded text-sm font-medium transition-colors ${
             instruction.includes('⚠️') ? 'bg-red-100 text-red-800' : 'bg-rose-50 text-rose-700'
         }`}>
            <i className={`fas ${instruction.includes('⚠️') ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2`}></i> 
            {instruction}
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* WORKBENCH (Hidden on Print) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 shadow-2xl relative min-h-[550px] border-4 border-slate-700 flex flex-col no-print">
           
           {/* Stopwatch Global Display */}
           <div className="absolute top-4 right-4 font-mono text-3xl text-rose-400 bg-black/50 px-4 rounded border border-slate-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              {globalTimer.toFixed(1)} s
           </div>

           {/* Scene Area */}
           <div className="flex-1 flex justify-center items-end space-x-4 md:space-x-8 pb-10 relative">
              
              {/* Heater Object */}
              <div className="absolute bottom-10 left-4 md:left-10 w-32 h-40 flex flex-col items-center justify-end opacity-90">
                  <div className={`w-24 h-6 bg-orange-500 blur-md transition-all duration-300 rounded-full ${burnerOn ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}></div>
                  <div className="w-24 h-2 bg-gray-600 rounded relative z-10"></div>
                  <div className="w-20 h-16 border-x-4 border-gray-600 bg-gray-700/50"></div>
                  <div className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Hotplate</div>
              </div>

              {/* Render Flasks */}
              {['A', 'B', 'C'].map((idStr) => {
                 const id = idStr as 'A' | 'B' | 'C';
                 const f = flasks[id];
                 
                 // Positioning Logic
                 const isHeating = f.isOnHeater;
                 const isActive = activeFlask === id;
                 
                 // Dynamic Styles
                 let containerClass = "relative cursor-pointer transition-all duration-700 ease-in-out";
                 let transformStyle = {};

                 if (isHeating) {
                    // Pindah ke atas heater (kiri bawah)
                    containerClass += " z-20 absolute bottom-32 left-8 md:left-14 scale-90";
                 } else {
                    // Posisi normal berjajar
                    containerClass += ` hover:scale-105 ${isActive ? 'scale-110 z-10' : 'opacity-70 scale-95'}`;
                 }

                 // Glow effect jika suhu target tercapai
                 const tempReached = f.currentTemp >= f.targetTemp;
                 const glowClass = tempReached && !f.hasHCl ? "drop-shadow-[0_0_15px_rgba(255,255,0,0.6)]" : isActive ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "";

                 return (
                    <div 
                      key={id}
                      onClick={() => handleFlaskClick(id)}
                      className={`${containerClass} ${glowClass}`}
                    >
                       {/* Thermometer UI */}
                       <div className="absolute -right-3 bottom-0 h-32 w-3 bg-gray-200 rounded-full border border-gray-400 overflow-hidden shadow-sm">
                          {/* Garis-garis skala */}
                          <div className="absolute top-2 w-full h-px bg-gray-400"></div>
                          <div className="absolute top-8 w-full h-px bg-gray-400"></div>
                          <div className="absolute top-14 w-full h-px bg-gray-400"></div>
                          <div className="absolute top-20 w-full h-px bg-gray-400"></div>
                          
                          {/* Mercury */}
                          <div 
                            className="absolute bottom-0 w-full bg-red-600 transition-all duration-300 ease-linear"
                            style={{ height: `${(f.currentTemp / 100) * 100}%` }}
                          ></div>
                       </div>
                       
                       {/* Floating Label Temp */}
                       <div className={`absolute -right-10 bottom-10 text-[10px] px-1 rounded font-bold transition-colors ${tempReached ? 'bg-green-500 text-white' : 'bg-black/50 text-white'}`}>
                           {f.currentTemp}°C
                       </div>

                       {/* The Beaker */}
                       <div className="w-24 h-32 bg-slate-200/10 border-2 border-slate-400 rounded-b-xl relative backdrop-blur-sm overflow-hidden group">
                          
                          {/* "X" Mark on the other side of glass */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-5xl font-extrabold text-black opacity-40 select-none">X</span>
                          </div>

                          {/* Liquid Level */}
                          <div className={`absolute bottom-0 w-full transition-all duration-1000 ${f.hasNa2S2O3 ? 'h-20' : 'h-0'} bg-blue-100/30 flex items-end`}>
                             {/* Precipitate Opacity Layer */}
                             <div 
                                className="w-full h-full bg-yellow-100 transition-opacity duration-100 ease-linear"
                                style={{ opacity: f.opacity }}
                             ></div>
                          </div>
                          
                          {/* Bubbles Animation if reacting */}
                          {f.isReacting && (
                             <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <div className="absolute bottom-0 left-2 w-2 h-2 bg-white rounded-full animate-bounce opacity-50"></div>
                                <div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full animate-bounce opacity-50 delay-100"></div>
                             </div>
                          )}
                       </div>

                       {/* Flask Label */}
                       <div className="text-center mt-2">
                           <span className={`text-xs font-bold px-2 py-1 rounded ${isActive ? 'bg-rose-600 text-white' : 'bg-slate-700 text-gray-400'}`}>
                               Gelas {id}
                           </span>
                           <div className="text-[10px] text-gray-400 mt-1">Target: {f.targetTemp}°C</div>
                       </div>

                       {/* Time Result Tag */}
                       {f.timeResult && (
                           <div className="absolute -top-4 left-0 w-full text-center">
                               <span className="bg-white text-rose-600 font-mono font-bold text-xs px-2 py-0.5 rounded shadow border border-rose-200">
                                   {f.timeResult}s
                               </span>
                           </div>
                       )}
                    </div>
                 );
              })}
           </div>

           {/* Control Panel (Toolbar) */}
           <div className="bg-slate-800 p-4 rounded-xl flex flex-wrap justify-center items-center gap-4 border-t border-slate-600">
              
              {/* Group 1: Heating Controls */}
              <div className="flex gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                  <button onClick={toggleHeaterPlace} className="flex flex-col items-center group w-16">
                     <div className={`w-10 h-10 border rounded flex items-center justify-center transition-all ${currentF.isOnHeater ? 'bg-orange-900 border-orange-500 text-orange-200' : 'bg-gray-700 border-gray-500 text-gray-300 group-hover:bg-gray-600'}`}>
                        <i className={`fas ${currentF.isOnHeater ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                     </div>
                     <span className="text-[8px] text-slate-300 mt-1 text-center leading-tight">{currentF.isOnHeater ? 'Angkat' : 'Panaskan'}</span>
                  </button>

                  <button onClick={toggleBurner} className={`flex flex-col items-center group w-16 ${burnerOn ? 'text-orange-400' : 'text-gray-400'}`}>
                     <div className={`w-10 h-10 border rounded flex items-center justify-center transition-all ${burnerOn ? 'bg-red-900 border-red-500 animate-pulse' : 'bg-gray-800 border-gray-600 group-hover:bg-gray-700'}`}>
                        <i className="fas fa-fire"></i>
                     </div>
                     <span className="text-[8px] mt-1 text-center leading-tight">{burnerOn ? 'Matikan' : 'Nyalakan'}</span>
                  </button>
              </div>

              <div className="h-10 w-px bg-slate-600"></div>

              {/* Group 2: Chemicals */}
              <div className="flex gap-2">
                  <button 
                    onClick={addNa2S2O3} 
                    disabled={currentF.isOnHeater || currentF.hasNa2S2O3 || currentF.currentTemp < currentF.targetTemp}
                    className={`flex flex-col items-center group w-14 transition-opacity ${currentF.hasNa2S2O3 ? 'opacity-50 cursor-not-allowed' : (currentF.currentTemp < currentF.targetTemp ? 'opacity-30 cursor-not-allowed' : 'opacity-100')}`}
                  >
                     <div className="w-8 h-10 bg-yellow-200/20 border border-yellow-200 rounded flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                        <span className="text-[8px] text-yellow-200 font-bold">A</span>
                     </div>
                     <span className="text-[8px] text-slate-300 mt-1">Na₂S₂O₃</span>
                  </button>

                  <button 
                    onClick={addHCl} 
                    disabled={!currentF.hasNa2S2O3 || currentF.hasHCl}
                    className={`flex flex-col items-center group w-14 transition-opacity ${!currentF.hasNa2S2O3 || currentF.hasHCl ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                  >
                     <div className="w-8 h-10 bg-blue-200/20 border border-blue-200 rounded flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                        <span className="text-[8px] text-blue-200 font-bold">B</span>
                     </div>
                     <span className="text-[8px] text-slate-300 mt-1">HCl</span>
                  </button>
              </div>

              <div className="h-10 w-px bg-slate-600"></div>

              <button onClick={reset} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs font-bold transition-colors">
                 <i className="fas fa-redo mr-1"></i> RESET
              </button>
           </div>
        </div>

        {/* REPORT (Printable) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto print-only max-h-screen">
           <div className="flex justify-between items-center mb-6 no-print">
              <h3 className="font-bold text-lg text-slate-800">Laporan Praktikum</h3>
              <button onClick={() => window.print()} className="bg-gray-100 p-2 rounded hover:bg-gray-200 text-sm font-semibold text-slate-700 border border-gray-300">
                 <i className="fas fa-print mr-2"></i>Unduh PDF
              </button>
           </div>
           
           <div className="hidden print-only mb-6 border-b-2 border-black pb-4 text-center">
               <h1 className="text-2xl font-bold uppercase">Laporan Praktikum Kimia</h1>
               <h2 className="text-xl font-semibold mt-1">Topik: Faktor Suhu</h2>
               <p className="text-sm mt-2 text-gray-600">ChemiLearn - Media Pembelajaran Laju Reaksi</p>
           </div>

           <div className="space-y-4">
              {/* TABEL DATA OTOMATIS */}
              <div className="mb-6 bg-rose-50 p-4 rounded-xl border border-rose-100">
                 <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase">Tabel 3. Data Pengamatan</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                       <tr>
                          <th className="border p-2">Gelas</th>
                          <th className="border p-2">Suhu (°C)</th>
                          <th className="border p-2">Waktu (s)</th>
                          <th className="border p-2">Laju (1/t)</th>
                       </tr>
                    </thead>
                    <tbody>
                       {['A', 'B', 'C'].map((id) => {
                          const f = flasks[id];
                          const rate = f.timeResult ? (1/f.timeResult).toFixed(3) : 0;
                          return (
                             <tr key={id}>
                                <td className="border p-2 font-bold text-center bg-gray-50">{id}</td>
                                <td className="border p-2 text-center">{f.targetTemp}</td>
                                <td className="border p-2 text-center font-mono">{f.timeResult || '-'}</td>
                                <td className="border p-2 text-center">{rate}</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>

              {/* FORM LAPORAN */}
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Pengamatan Perubahan Warna/Endapan</label>
                 <textarea 
                    value={report.obs} 
                    onChange={(e) => saveReport('obs', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-shadow" 
                    rows={3}
                    placeholder="Apa yang terjadi dengan tanda silang (X) di dasar gelas saat reaksi berlangsung?"
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Analisis Hubungan Suhu & Laju</label>
                 <textarea 
                    value={report.graphAnalysis} 
                    onChange={(e) => saveReport('graphAnalysis', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-shadow" 
                    rows={4}
                    placeholder="Jelaskan mengapa suhu yang lebih tinggi membuat waktu reaksi lebih singkat (gunakan konsep Energi Kinetik)."
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Kesimpulan</label>
                 <textarea 
                    value={report.conclusion} 
                    onChange={(e) => saveReport('conclusion', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-shadow" 
                    rows={3}
                    placeholder="Buat kesimpulan umum tentang pengaruh suhu terhadap laju reaksi."
                 ></textarea>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureLab;