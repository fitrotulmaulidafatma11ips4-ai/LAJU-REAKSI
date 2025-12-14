import React, { useState, useEffect } from 'react';

type FlaskState = {
  concentration: number; // 0.1, 0.5, 1.0
  hasLiquid: boolean;
  hasSolid: boolean; // Soda Kue
  balloonSize: number;
  isReacting: boolean;
  startTime: number;
  timeResult: number | null;
};

const ConcentrationLab: React.FC = () => {
  const [activeFlask, setActiveFlask] = useState<'A' | 'B' | 'C'>('A');
  const [flasks, setFlasks] = useState<{ [key: string]: FlaskState }>({
    A: { concentration: 0.1, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
    B: { concentration: 0.5, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
    C: { concentration: 1.0, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
  });

  const [instruction, setInstruction] = useState("Pilih Labu A untuk memulai.");
  const [timer, setTimer] = useState(0);

  // Laporan (Auto-save)
  const [report, setReport] = useState({
    obs: '', graphAnalysis: '', conclusion: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('lab_conc_data');
    if (saved) {
        try { setReport(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveReport = (key: string, value: string) => {
    const newData = { ...report, [key]: value };
    setReport(newData);
    localStorage.setItem('lab_conc_data', JSON.stringify(newData));
  };

  // Reaction Logic
  useEffect(() => {
    let interval: number;
    const isAnyReacting = flasks.A.isReacting || flasks.B.isReacting || flasks.C.isReacting;

    if (isAnyReacting) {
      interval = window.setInterval(() => {
        setTimer(t => t + 0.1);
        
        setFlasks(prev => {
          const next = { ...prev };
          let changed = false;
          (['A', 'B', 'C'] as const).forEach(key => {
            const f = next[key];
            if (f.isReacting) {
              // Rate based on concentration (0.1 -> 0.3 speed, 1.0 -> 2.5 speed)
              const growthRate = (f.concentration * 3.5); 
              const newSize = f.balloonSize + growthRate;

              if (newSize >= 100) {
                 const finishTime = Number((timer + 0.1).toFixed(1));
                 const duration = finishTime - f.startTime;

                 next[key] = { 
                     ...f, 
                     balloonSize: 100, 
                     isReacting: false, 
                     timeResult: Number(duration.toFixed(1)) 
                 };
              } else {
                 next[key] = { ...f, balloonSize: newSize };
              }
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [flasks.A.isReacting, flasks.B.isReacting, flasks.C.isReacting, timer]);

  // Actions
  const handleFlaskClick = (id: 'A' | 'B' | 'C') => {
    setActiveFlask(id);
    const f = flasks[id];
    if (!f.hasLiquid) setInstruction(`Labu ${id} terpilih. Masukkan CH₃COOH ${f.concentration}M.`);
    else if (!f.hasSolid) setInstruction(`Labu ${id}. Masukkan Soda Kue.`);
    else if (!f.isReacting && !f.timeResult) setInstruction("Siap direaksikan.");
    else setInstruction(`Reaksi Labu ${id} selesai.`);
  };

  const addAcid = (molar: number) => {
    const f = flasks[activeFlask];
    if (f.concentration !== molar) {
      setInstruction(`⚠️ Konsentrasi salah! Labu ${activeFlask} butuh ${f.concentration}M.`);
      return;
    }
    if (f.hasLiquid) return;
    setFlasks(prev => ({ ...prev, [activeFlask]: { ...f, hasLiquid: true } }));
    setInstruction("Asam masuk. Sekarang tambahkan Soda Kue.");
  };

  const addSolid = () => {
    const f = flasks[activeFlask];
    if (!f.hasLiquid) { setInstruction("⚠️ Tuang larutan asam dulu!"); return; }
    if (f.hasSolid) return;
    setFlasks(prev => ({ ...prev, [activeFlask]: { ...f, hasSolid: true } }));
    setInstruction("Bahan lengkap. Lanjutkan ke labu berikutnya atau mulai reaksi.");
  };

  const startAll = () => {
    if (!flasks.A.hasSolid || !flasks.B.hasSolid || !flasks.C.hasSolid) {
      setInstruction("⚠️ Siapkan KETIGA labu (A, B, C) sampai lengkap!");
      return;
    }
    if (flasks.A.timeResult || flasks.B.timeResult || flasks.C.timeResult) {
        setInstruction("⚠️ Tekan tombol reset untuk mengulang.");
        return;
    }

    setTimer(0);
    setFlasks(prev => ({
       A: { ...prev.A, isReacting: true, startTime: 0 },
       B: { ...prev.B, isReacting: true, startTime: 0 },
       C: { ...prev.C, isReacting: true, startTime: 0 },
    }));
    setInstruction("Amati perbedaan pengembangan balon!");
  };

  const reset = () => {
    setFlasks({
        A: { concentration: 0.1, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
        B: { concentration: 0.5, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
        C: { concentration: 1.0, hasLiquid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
    });
    setTimer(0);
    setInstruction("Reset berhasil. Pilih Labu A.");
  };

  const getRate = (t: number | null) => t && t > 0 ? (1/t).toFixed(3) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-emerald-500 no-print">
         <h2 className="text-2xl font-bold text-slate-800">Lab 2: Konsentrasi</h2>
         <p className="text-gray-600 mb-2">Topik: Reaksi CH₃COOH + Soda Kue.</p>
         <div className="flex items-center text-emerald-700 bg-emerald-50 p-2 rounded text-sm font-medium">
            <i className="fas fa-info-circle mr-2"></i> {instruction}
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* WORKBENCH (Hidden on Print) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 shadow-2xl relative min-h-[500px] border-4 border-slate-700 flex flex-col no-print">
           
           <div className="absolute top-4 right-4 font-mono text-3xl text-emerald-400 bg-black/50 px-4 rounded border border-slate-500">
              {timer.toFixed(1)} s
           </div>

           {/* Scene */}
           <div className="flex-1 flex justify-center items-end space-x-8 pb-10 relative">
              {['A', 'B', 'C'].map((id) => {
                 const f = flasks[id];
                 const color = id === 'A' ? 'bg-red-500' : id === 'B' ? 'bg-yellow-500' : 'bg-green-500';
                 return (
                    <div 
                      key={id}
                      onClick={() => handleFlaskClick(id as any)}
                      className={`relative cursor-pointer transition-transform hover:scale-105 ${activeFlask === id ? 'scale-110 drop-shadow-[0_0_10px_white]' : 'opacity-70'}`}
                    >
                       <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-16 ${color} rounded-full opacity-90 transition-all duration-100 ease-out border-b-4`}
                            style={{ height: `${Math.max(10, f.balloonSize * 1.5)}px`, transform: `translate(-50%, -${f.balloonSize}%)` }}></div>
                       
                       <div className="w-20 h-28 bg-slate-200/20 border-2 border-slate-400 rounded-b-2xl relative backdrop-blur-sm overflow-hidden">
                          <div className={`absolute bottom-0 w-full transition-all duration-500 ${f.hasLiquid ? 'h-14' : 'h-0'} bg-emerald-400/40`}></div>
                          {f.hasSolid && <div className="absolute bottom-0 w-full h-2 bg-white/80 animate-pulse"></div>}
                       </div>
                       <div className="text-center text-white text-[10px] mt-2 font-bold">{id} ({f.concentration}M)</div>
                       {f.timeResult && <div className="text-center text-emerald-400 font-mono text-xs">{f.timeResult}s</div>}
                    </div>
                 );
              })}
           </div>

           {/* Toolbar */}
           <div className="bg-slate-800 p-4 rounded-xl flex justify-center gap-3 border-t border-slate-600">
              {[0.1, 0.5, 1.0].map(m => (
                 <button key={m} onClick={() => addAcid(m)} className="flex flex-col items-center group">
                    <div className="w-8 h-12 bg-emerald-900 border border-emerald-500 rounded flex items-center justify-center group-hover:-translate-y-2 transition-transform">
                       <span className="text-[8px] text-white">{m}M</span>
                    </div>
                 </button>
              ))}

              <div className="border-l border-slate-600 mx-1"></div>

              <button onClick={addSolid} className="flex flex-col items-center group">
                 <div className="w-10 h-10 bg-white border-2 border-gray-400 rounded-full flex items-center justify-center group-hover:-translate-y-2 transition-transform">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                 </div>
                 <span className="text-[8px] text-slate-300 mt-1">Soda Kue</span>
              </button>

              <div className="border-l border-slate-600 mx-1"></div>

              <button onClick={startAll} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-lg text-xs">Mulai</button>
              <button onClick={reset} className="px-3 py-2 bg-slate-600 text-white rounded text-xs"><i className="fas fa-redo"></i></button>
           </div>
        </div>

        {/* REPORT */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-lg h-full overflow-y-auto print-only max-h-screen">
           <div className="flex justify-between items-center mb-6 no-print">
              <h3 className="font-bold text-lg text-slate-800">Laporan Praktikum</h3>
              <button onClick={() => window.print()} className="bg-gray-100 p-2 rounded hover:bg-gray-200 text-sm font-semibold text-slate-700 border border-gray-300">
                 <i className="fas fa-print mr-2"></i>Unduh PDF
              </button>
           </div>
           
           <div className="hidden print-only mb-6 border-b-2 border-black pb-4 text-center">
               <h1 className="text-2xl font-bold uppercase">Laporan Praktikum Kimia</h1>
               <h2 className="text-xl font-semibold mt-1">Topik: Faktor Konsentrasi</h2>
               <p className="text-sm mt-2 text-gray-600">ChemiLearn - Media Pembelajaran Laju Reaksi</p>
           </div>

           <div className="space-y-4">
              {/* TABEL DATA OTOMATIS */}
              <div className="mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase">Tabel 2. Data Pengamatan</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                       <tr>
                          <th className="border p-2">Labu</th>
                          <th className="border p-2">Konsentrasi</th>
                          <th className="border p-2">Waktu (s)</th>
                          <th className="border p-2">Laju (1/t)</th>
                       </tr>
                    </thead>
                    <tbody>
                       {['A', 'B', 'C'].map((id) => {
                          const f = flasks[id];
                          return (
                             <tr key={id}>
                                <td className="border p-2 font-bold text-center">{id}</td>
                                <td className="border p-2 text-center">{f.concentration} M</td>
                                <td className="border p-2 text-center">{f.timeResult || '-'}</td>
                                <td className="border p-2 text-center">{getRate(f.timeResult)}</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>

              {/* FORM LAPORAN */}
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Pengamatan Makroskopis</label>
                 <textarea 
                    value={report.obs} 
                    onChange={(e) => saveReport('obs', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    rows={3}
                    placeholder="Apa yang terjadi pada balon dan larutan di masing-masing labu?"
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Analisis Grafik (Hubungan Konsentrasi & Laju)</label>
                 <textarea 
                    value={report.graphAnalysis} 
                    onChange={(e) => saveReport('graphAnalysis', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    rows={4}
                    placeholder="Bagaimana pengaruh konsentrasi terhadap waktu reaksi? Jelaskan dengan teori tumbukan."
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">Kesimpulan</label>
                 <textarea 
                    value={report.conclusion} 
                    onChange={(e) => saveReport('conclusion', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    rows={3}
                    placeholder="Buat kesimpulan tentang pengaruh konsentrasi."
                 ></textarea>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConcentrationLab;