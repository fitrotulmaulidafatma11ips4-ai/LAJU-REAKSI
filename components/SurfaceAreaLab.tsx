import React, { useState, useEffect } from 'react';

type ExperimentState = {
  type: 'CHUNKS' | 'POWDER' | null;
  hasAcid: boolean;
  hasSolid: boolean;
  balloonSize: number;
  isReacting: boolean;
  startTime: number;
  timeResult: number | null;
};

const SurfaceAreaLab: React.FC = () => {
  // State Simulasi
  const [activeFlask, setActiveFlask] = useState<'A' | 'B'>('A');
  const [flasks, setFlasks] = useState<{ A: ExperimentState, B: ExperimentState }>({
    A: { type: 'CHUNKS', hasAcid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
    B: { type: 'POWDER', hasAcid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null }
  });

  const [instruction, setInstruction] = useState("Pilih Labu A (Potongan) untuk memulai.");
  const [timer, setTimer] = useState(0);

  // State Laporan (Auto-save)
  const [report, setReport] = useState({
    reaction: '', hypothesis: '', analysis: '', conclusion: ''
  });

  // Load data tersimpan saat pertama kali buka
  useEffect(() => {
    const saved = localStorage.getItem('lab_surface_data');
    if (saved) {
      try {
        setReport(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal memuat data laporan", e);
      }
    }
  }, []);

  // Fungsi Simpan Laporan
  const saveReport = (key: string, value: string) => {
    const newData = { ...report, [key]: value };
    setReport(newData);
    localStorage.setItem('lab_surface_data', JSON.stringify(newData));
  };

  // Logika Reaksi & Timer
  useEffect(() => {
    let interval: number;
    // Cek apakah ada reaksi yang berjalan
    const isAnyReacting = flasks.A.isReacting || flasks.B.isReacting;

    if (isAnyReacting) {
      interval = window.setInterval(() => {
        setTimer((t) => t + 0.1);

        setFlasks((prev) => {
          const next = { ...prev };
          let changed = false;

          (['A', 'B'] as const).forEach((key) => {
            const f = next[key];
            if (f.isReacting) {
              // Rate: Serbuk (B) 3x lebih cepat dari Potongan (A)
              const rate = key === 'A' ? 0.5 : 2.0; 
              const newSize = f.balloonSize + rate;

              if (newSize >= 100) {
                // Calculate duration based on individual start time
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
  }, [flasks.A.isReacting, flasks.B.isReacting, timer]);

  // Actions
  const handleFlaskClick = (id: 'A' | 'B') => {
    setActiveFlask(id);
    const f = flasks[id];
    if (!f.hasSolid) setInstruction(`Labu ${id} terpilih. Langkah 1: Masukkan ${id === 'A' ? 'Potongan' : 'Serbuk'} Cangkang.`);
    else if (!f.hasAcid) setInstruction(`Labu ${id}. Langkah 2: Tuangkan HCl.`);
    else if (!f.isReacting && !f.timeResult) setInstruction(`Siap. Klik 'Mulai Reaksi' untuk mengamati.`);
    else setInstruction(`Reaksi pada Labu ${id} selesai.`);
  };

  const addSolid = (type: 'CHUNKS' | 'POWDER') => {
    const f = flasks[activeFlask];
    if (f.type !== type) {
       setInstruction(`⚠️ Salah bahan! Labu ${activeFlask} butuh ${f.type === 'CHUNKS' ? 'Potongan' : 'Serbuk'}.`);
       return;
    }
    if (f.hasSolid) return;
    setFlasks(prev => ({ ...prev, [activeFlask]: { ...f, hasSolid: true } }));
    setInstruction("Bagus. Sekarang tuangkan Asam Klorida (HCl).");
  };

  const addAcid = () => {
    const f = flasks[activeFlask];
    if (!f.hasSolid) { setInstruction("⚠️ Masukkan padatan cangkang dulu!"); return; }
    if (f.hasAcid) return;
    setFlasks(prev => ({ ...prev, [activeFlask]: { ...f, hasAcid: true } }));
    setInstruction("Semua bahan masuk. Siap direaksikan.");
  };

  const startReaction = () => {
     if (!flasks.A.hasAcid || !flasks.B.hasAcid) {
        setInstruction("⚠️ Siapkan KEDUA labu (A & B) terlebih dahulu agar perbandingan adil!");
        return;
     }
     if (flasks.A.timeResult || flasks.B.timeResult) {
       setInstruction("⚠️ Reset terlebih dahulu jika ingin mengulang.");
       return;
     }

     // Start both simultaneously
     setTimer(0);
     setFlasks(prev => ({
        A: { ...prev.A, isReacting: true, startTime: 0 },
        B: { ...prev.B, isReacting: true, startTime: 0 }
     }));
     setInstruction("Amati perbedaan kecepatan pengembangan balon!");
  };

  const reset = () => {
    setFlasks({
        A: { type: 'CHUNKS', hasAcid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null },
        B: { type: 'POWDER', hasAcid: false, hasSolid: false, balloonSize: 0, isReacting: false, startTime: 0, timeResult: null }
    });
    setTimer(0);
    setInstruction("Pilih Labu A untuk memulai ulang.");
  };

  const getRate = (t: number | null) => t && t > 0 ? (1/t).toFixed(3) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-purple-500 no-print">
         <h2 className="text-2xl font-bold text-slate-800">Lab 1: Luas Permukaan</h2>
         <p className="text-gray-600 mb-2">Topik: Reaksi CaCO₃ (Cangkang) + HCl.</p>
         <div className="flex items-center text-purple-700 bg-purple-50 p-2 rounded text-sm font-medium">
            <i className="fas fa-info-circle mr-2"></i> {instruction}
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* WORKBENCH (Hidden on Print) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 shadow-2xl relative min-h-[500px] border-4 border-slate-700 flex flex-col no-print">
           
           {/* Stopwatch */}
           <div className="absolute top-4 right-4 font-mono text-3xl text-green-400 bg-black/50 px-4 rounded border border-slate-500">
              {timer.toFixed(1)} s
           </div>

           {/* Scene */}
           <div className="flex-1 flex justify-center items-end space-x-20 pb-10 relative">
              
              {/* Labu A */}
              <div 
                 onClick={() => handleFlaskClick('A')}
                 className={`relative cursor-pointer transition-transform hover:scale-105 ${activeFlask === 'A' ? 'scale-110 drop-shadow-[0_0_10px_white]' : 'opacity-70'}`}
              >
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 bg-red-500 rounded-full opacity-90 transition-all duration-100 ease-out border-b-4 border-red-700"
                      style={{ height: `${Math.max(10, flasks.A.balloonSize * 1.5)}px`, transform: `translate(-50%, -${flasks.A.balloonSize}%)` }}></div>
                 
                 <div className="w-24 h-32 bg-slate-200/20 border-2 border-slate-400 rounded-b-3xl relative backdrop-blur-sm overflow-hidden">
                    <div className={`absolute bottom-0 w-full transition-all duration-500 ${flasks.A.hasAcid ? 'h-16' : 'h-0'} bg-blue-400/40`}></div>
                    {flasks.A.hasSolid && (
                       <div className="absolute bottom-1 left-4 flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-4 h-3 bg-yellow-200 border border-yellow-600 rounded-sm"></div>)}
                       </div>
                    )}
                    {flasks.A.isReacting && <div className="absolute bottom-0 w-full h-full animate-pulse bg-white/10"></div>}
                 </div>
                 <div className="text-center text-white text-xs mt-2 font-bold">Labu A (Potongan)</div>
                 {flasks.A.timeResult && <div className="text-center text-green-400 font-mono text-sm">{flasks.A.timeResult}s</div>}
              </div>

              {/* Labu B */}
              <div 
                 onClick={() => handleFlaskClick('B')}
                 className={`relative cursor-pointer transition-transform hover:scale-105 ${activeFlask === 'B' ? 'scale-110 drop-shadow-[0_0_10px_white]' : 'opacity-70'}`}
              >
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 bg-blue-500 rounded-full opacity-90 transition-all duration-100 ease-out border-b-4 border-blue-700"
                      style={{ height: `${Math.max(10, flasks.B.balloonSize * 1.5)}px`, transform: `translate(-50%, -${flasks.B.balloonSize}%)` }}></div>
                 
                 <div className="w-24 h-32 bg-slate-200/20 border-2 border-slate-400 rounded-b-3xl relative backdrop-blur-sm overflow-hidden">
                    <div className={`absolute bottom-0 w-full transition-all duration-500 ${flasks.B.hasAcid ? 'h-16' : 'h-0'} bg-blue-400/40`}></div>
                    {flasks.B.hasSolid && (
                       <div className="absolute bottom-0 w-full h-2 bg-yellow-200/80"></div>
                    )}
                    {flasks.B.isReacting && <div className="absolute bottom-0 w-full h-full animate-pulse bg-white/30"></div>}
                 </div>
                 <div className="text-center text-white text-xs mt-2 font-bold">Labu B (Serbuk)</div>
                 {flasks.B.timeResult && <div className="text-center text-green-400 font-mono text-sm">{flasks.B.timeResult}s</div>}
              </div>

           </div>

           {/* Toolbar */}
           <div className="bg-slate-800 p-4 rounded-xl flex justify-center gap-4 border-t border-slate-600">
              <button onClick={() => addSolid('CHUNKS')} className="flex flex-col items-center group">
                 <div className="w-12 h-12 bg-yellow-100 border-2 border-yellow-600 rounded flex items-center justify-center group-hover:-translate-y-2 transition-transform">
                    <div className="flex gap-1"><div className="w-2 h-2 bg-yellow-600"></div><div className="w-2 h-2 bg-yellow-600"></div></div>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">Potongan</span>
              </button>

              <button onClick={() => addSolid('POWDER')} className="flex flex-col items-center group">
                 <div className="w-12 h-12 bg-yellow-50 border-2 border-yellow-400 rounded flex items-center justify-center group-hover:-translate-y-2 transition-transform">
                    <div className="w-8 h-1 bg-yellow-400"></div>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">Serbuk</span>
              </button>

              <button onClick={addAcid} className="flex flex-col items-center group">
                 <div className="w-10 h-14 bg-blue-900 rounded border border-blue-400 relative group-hover:-translate-y-2 transition-transform">
                    <span className="text-[8px] text-white absolute top-4 left-2">HCl</span>
                 </div>
                 <span className="text-xs text-slate-300 mt-1">Larutan HCl</span>
              </button>

              <div className="border-l border-slate-600 mx-2"></div>

              <button onClick={startReaction} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg self-center">
                 Mulai
              </button>
              <button onClick={reset} className="px-3 py-2 bg-slate-600 text-white rounded-lg self-center"><i className="fas fa-redo"></i></button>
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

           {/* Header Khusus Print */}
           <div className="hidden print-only mb-6 border-b-2 border-black pb-4 text-center">
               <h1 className="text-2xl font-bold uppercase">Laporan Praktikum Kimia</h1>
               <h2 className="text-xl font-semibold mt-1">Topik: Faktor Luas Permukaan</h2>
               <p className="text-sm mt-2 text-gray-600">ChemiLearn - Media Pembelajaran Laju Reaksi</p>
           </div>

           <div className="space-y-4">
              {/* TABEL DATA OTOMATIS */}
              <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase">Tabel 1. Data Pengamatan</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                       <tr>
                          <th className="border p-2">Labu</th>
                          <th className="border p-2">Bentuk Zat</th>
                          <th className="border p-2">Waktu (s)</th>
                          <th className="border p-2">Laju (1/t)</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr>
                          <td className="border p-2 font-bold text-center">A</td>
                          <td className="border p-2">Potongan (Kasar)</td>
                          <td className="border p-2 text-center">{flasks.A.timeResult || '-'}</td>
                          <td className="border p-2 text-center">{getRate(flasks.A.timeResult)}</td>
                       </tr>
                       <tr>
                          <td className="border p-2 font-bold text-center">B</td>
                          <td className="border p-2">Serbuk (Halus)</td>
                          <td className="border p-2 text-center">{flasks.B.timeResult || '-'}</td>
                          <td className="border p-2 text-center">{getRate(flasks.B.timeResult)}</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              {/* FORM LAPORAN */}
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">a. Persamaan Reaksi</label>
                 <textarea 
                    value={report.reaction} 
                    onChange={(e) => saveReport('reaction', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    rows={2}
                    placeholder="Tuliskan persamaan reaksi setara..."
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">b. Hipotesis Awal</label>
                 <textarea 
                    value={report.hypothesis} 
                    onChange={(e) => saveReport('hypothesis', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    rows={2}
                    placeholder="Dugaan sementara sebelum percobaan..."
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">c. Analisis Data</label>
                 <textarea 
                    value={report.analysis} 
                    onChange={(e) => saveReport('analysis', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    rows={4}
                    placeholder="Jelaskan hubungan antara bentuk zat dengan waktu reaksi berdasarkan teori tumbukan..."
                 ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold mb-1 uppercase text-slate-700">d. Kesimpulan</label>
                 <textarea 
                    value={report.conclusion} 
                    onChange={(e) => saveReport('conclusion', e.target.value)} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    rows={3}
                    placeholder="Simpulkan pengaruh luas permukaan terhadap laju reaksi..."
                 ></textarea>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SurfaceAreaLab;