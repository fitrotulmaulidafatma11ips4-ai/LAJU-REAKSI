import React, { useState } from 'react';

// Data Peta Konsep
const conceptMapData = {
  root: {
    id: 'root',
    label: 'LAJU REAKSI',
    desc: 'Perubahan konsentrasi reaktan atau produk per satuan waktu.',
    color: 'bg-indigo-600'
  },
  nodes: [
    {
      id: 'teori',
      label: 'Teori Tumbukan',
      desc: 'Reaksi terjadi jika partikel bertumbukan dengan energi yang cukup (Ea) dan orientasi yang tepat.',
      position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-24',
      color: 'bg-purple-500'
    },
    {
      id: 'konsentrasi',
      label: 'Konsentrasi',
      desc: 'Makin besar konsentrasi, makin banyak partikel, makin sering tumbukan terjadi.',
      position: 'top-1/2 right-0 translate-x-24 -translate-y-1/2',
      color: 'bg-emerald-500'
    },
    {
      id: 'suhu',
      label: 'Suhu',
      desc: 'Suhu naik → Energi Kinetik naik → Partikel bergerak cepat → Tumbukan efektif meningkat.',
      position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-24',
      color: 'bg-rose-500'
    },
    {
      id: 'luas',
      label: 'Luas Permukaan',
      desc: 'Makin halus ukuran partikel, makin luas bidang sentuh, reaksi makin cepat.',
      position: 'top-1/2 left-0 -translate-x-24 -translate-y-1/2',
      color: 'bg-blue-500'
    },
    {
      id: 'katalis',
      label: 'Katalis',
      desc: 'Zat yang mempercepat reaksi dengan cara menurunkan Energi Aktivasi (Ea).',
      position: 'top-0 right-0 translate-x-16 -translate-y-16',
      color: 'bg-orange-500'
    }
  ]
};

const TheoryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'peta' | 'definisi' | 'tumbukan' | 'faktor'>('peta');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [collisionType, setCollisionType] = useState<'efektif' | 'tidak_efektif'>('efektif');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-wrap gap-2 sticky top-0 z-10 transition-colors">
        {[
          { id: 'peta', label: '🗺️ Peta Konsep', color: 'indigo' },
          { id: 'definisi', label: '📚 Definisi & Hukum', color: 'blue' },
          { id: 'tumbukan', label: '💥 Teori Tumbukan', color: 'rose' },
          { id: 'faktor', label: '⚗️ Faktor Penentu', color: 'emerald' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
              activeTab === tab.id
                ? `bg-${tab.color}-100 text-${tab.color}-700 border-${tab.color}-200 shadow-sm border dark:bg-${tab.color}-900/50 dark:text-${tab.color}-200 dark:border-${tab.color}-700`
                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden min-h-[600px] transition-colors">
        
        {/* === SECTION 1: PETA KONSEP INTERAKTIF === */}
        {activeTab === 'peta' && (
          <div className="p-8 h-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-12 absolute top-8 left-8 border-l-4 border-indigo-500 pl-3">
              Klik pada lingkaran untuk melihat detail hubungan
            </h3>

            {/* Area Peta Konsep */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center mt-10">
              
              {/* Garis Konektor (Visual Only) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-50">
                <div className="w-[120%] h-[1px] bg-slate-800 dark:bg-slate-200 rotate-0 absolute"></div>
                <div className="w-[120%] h-[1px] bg-slate-800 dark:bg-slate-200 rotate-90 absolute"></div>
                <div className="w-[120%] h-[1px] bg-slate-800 dark:bg-slate-200 rotate-45 absolute"></div>
              </div>

              {/* Central Node */}
              <button
                onClick={() => setActiveNode('root')}
                className={`z-10 w-32 h-32 rounded-full ${conceptMapData.root.color} text-white font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-center p-2 z-20 border-4 border-white dark:border-slate-800`}
              >
                {conceptMapData.root.label}
              </button>

              {/* Child Nodes */}
              {conceptMapData.nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`absolute w-24 h-24 md:w-28 md:h-28 rounded-full ${node.color} text-white text-sm font-semibold shadow-md hover:scale-110 transition-transform flex items-center justify-center text-center p-2 border-2 border-white dark:border-slate-800 cursor-pointer ${node.position}`}
                >
                  {node.label}
                </button>
              ))}
            </div>

            {/* Info Box Floating */}
            <div className={`mt-16 p-6 rounded-xl border max-w-2xl w-full transition-all duration-300 ${activeNode ? 'bg-white dark:bg-slate-800 dark:border-slate-700 shadow-lg opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {activeNode && (
                <>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                    {activeNode === 'root' ? conceptMapData.root.label : conceptMapData.nodes.find(n => n.id === activeNode)?.label}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {activeNode === 'root' ? conceptMapData.root.desc : conceptMapData.nodes.find(n => n.id === activeNode)?.desc}
                  </p>
                </>
              )}
              {!activeNode && <p className="text-center text-gray-400 italic">Pilih salah satu konsep di atas</p>}
            </div>
          </div>
        )}

        {/* === SECTION 2: DEFINISI & HUKUM === */}
        {activeTab === 'definisi' && (
          <div className="p-8 md:p-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Konsep Dasar Laju Reaksi</h2>
            
            <div className="prose prose-lg text-slate-600 dark:text-slate-300 max-w-none">
              <p>
                Berdasarkan buku <strong>Kimia Dasar (Raymond Chang)</strong>, Laju reaksi didefinisikan sebagai perubahan konsentrasi reaktan atau produk terhadap waktu.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-6">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-lg mb-2">Persamaan Umum</h4>
                <p className="font-mono text-xl text-blue-900 dark:text-blue-200 bg-white dark:bg-slate-800 p-4 rounded-lg inline-block shadow-sm">
                  Laju = - Δ[Reaktan] / Δt = + Δ[Produk] / Δt
                </p>
                <p className="text-sm mt-3 text-blue-700 dark:text-blue-400">
                  *Tanda negatif (-) menunjukkan pengurangan reaktan, tanda positif (+) menunjukkan penambahan produk.
                </p>
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8 mb-4">Hukum Laju & Orde Reaksi</h3>
              <p>
                Laju reaksi sering kali sebanding dengan konsentrasi reaktan yang dipangkatkan dengan bilangan tertentu (orde).
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <strong className="block text-slate-800 dark:text-slate-200 mb-2">Hukum Laju:</strong>
                  <span className="font-mono text-lg text-indigo-600 dark:text-indigo-400">v = k [A]<sup>x</sup> [B]<sup>y</sup></span>
                  <ul className="text-sm mt-2 list-disc list-inside">
                    <li>v = Laju reaksi (M/s)</li>
                    <li>k = Konstanta laju</li>
                    <li>x, y = Orde reaksi (harus ditentukan lewat eksperimen)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <strong className="block text-slate-800 dark:text-slate-200 mb-2">Makna Orde Reaksi:</strong>
                  <ul className="text-sm space-y-2">
                    <li><span className="font-bold text-indigo-600 dark:text-indigo-400">Orde 0:</span> Laju tidak dipengaruhi konsentrasi.</li>
                    <li><span className="font-bold text-indigo-600 dark:text-indigo-400">Orde 1:</span> Konsentrasi 2x, laju 2x.</li>
                    <li><span className="font-bold text-indigo-600 dark:text-indigo-400">Orde 2:</span> Konsentrasi 2x, laju 4x.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === SECTION 3: TEORI TUMBUKAN === */}
        {activeTab === 'tumbukan' && (
          <div className="p-8 md:p-12 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Teori Tumbukan</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  Menurut teori tumbukan, reaksi kimia terjadi akibat tumbukan antar partikel reaktan. Namun, tidak semua tumbukan menghasilkan reaksi.
                </p>
                <div className="space-y-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-1">1. Energi Aktivasi (Ea)</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400">Tumbukan harus memiliki energi kinetik ≥ Ea untuk memutus ikatan lama dan membentuk ikatan baru.</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-1">2. Orientasi Tepat</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Posisi tumbukan antar atom yang akan berikatan harus pas (tepat sasaran).</p>
                  </div>
                </div>
              </div>

              {/* Interactive Simulation Box */}
              <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <i className="fas fa-flask mr-2 text-green-400"></i> Laboratorium Mini: Tumbukan
                </h3>
                
                <div className="flex justify-center space-x-4 mb-8">
                  <button 
                    onClick={() => setCollisionType('tidak_efektif')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${collisionType === 'tidak_efektif' ? 'bg-red-500 text-white' : 'bg-slate-700 text-gray-300'}`}
                  >
                    Tumbukan Lemah
                  </button>
                  <button 
                    onClick={() => setCollisionType('efektif')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${collisionType === 'efektif' ? 'bg-green-500 text-white' : 'bg-slate-700 text-gray-300'}`}
                  >
                    Tumbukan Efektif
                  </button>
                </div>

                {/* Visual Animation Area */}
                <div className="h-40 bg-slate-800 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-700">
                  {/* Particle A */}
                  <div className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-900 transition-all duration-[2000ms]
                    ${collisionType === 'efektif' ? 'bg-green-400 animate-slide-right-fast' : 'bg-red-400 animate-slide-right-slow'}
                    left-4
                  `}>
                    A
                  </div>
                  
                  {/* Particle B */}
                  <div className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-900 transition-all duration-[2000ms]
                    ${collisionType === 'efektif' ? 'bg-blue-400 animate-slide-left-fast' : 'bg-yellow-400 animate-slide-left-slow'}
                    right-4
                  `}>
                    B
                  </div>
                  
                  {/* Result Text */}
                  <div className="absolute bottom-2 text-xs text-slate-400">
                    {collisionType === 'efektif' ? 'Energi Cukup & Posisi Pas -> REAKSI!' : 'Energi Kurang / Posisi Salah -> MANTUL'}
                  </div>
                </div>
                <style>{`
                  @keyframes slideRight { 0% { left: 10%; } 50% { left: 45%; } 100% { left: 10%; } }
                  @keyframes slideLeft { 0% { right: 10%; } 50% { right: 45%; } 100% { right: 10%; } }
                  .animate-slide-right-fast { animation: slideRight 1s infinite linear; }
                  .animate-slide-left-fast { animation: slideLeft 1s infinite linear; }
                  .animate-slide-right-slow { animation: slideRight 2s infinite ease-in-out; }
                  .animate-slide-left-slow { animation: slideLeft 2s infinite ease-in-out; }
                `}</style>
              </div>
            </div>
          </div>
        )}

        {/* === SECTION 4: FAKTOR PENENTU === */}
        {activeTab === 'faktor' && (
          <div className="p-8 md:p-12 animate-fade-in bg-gray-50 dark:bg-slate-900 h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">4 Faktor Utama Laju Reaksi</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card 1: Konsentrasi */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl mb-4">
                  <i className="fas fa-vials"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">1. Konsentrasi</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  Semakin tinggi konsentrasi, semakin banyak jumlah partikel per volume.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs p-3 rounded-lg font-medium">
                  Analogi: Jalanan padat kendaraan lebih sering terjadi tabrakan dibandingkan jalanan sepi.
                </div>
              </div>

              {/* Card 2: Luas Permukaan */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl mb-4">
                  <i className="fas fa-cube"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">2. Luas Permukaan</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  Untuk massa yang sama, serbuk memiliki total luas permukaan lebih besar daripada bongkahan.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-xs p-3 rounded-lg font-medium">
                  Fakta: Gula halus larut lebih cepat daripada gula batu karena bidang sentuhnya lebih banyak.
                </div>
              </div>

              {/* Card 3: Suhu */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-rose-100 dark:border-rose-900 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 text-xl mb-4">
                  <i className="fas fa-temperature-high"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">3. Suhu</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  Kenaikan suhu menaikkan energi kinetik rata-rata partikel. Lebih banyak partikel yang mencapai Energi Aktivasi.
                </p>
                <div className="bg-rose-50 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 text-xs p-3 rounded-lg font-medium">
                  Aturan Praktis: Kenaikan suhu 10°C umumnya meningkatkan laju reaksi 2-3 kali lipat.
                </div>
              </div>

              {/* Card 4: Katalis */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 text-xl mb-4">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">4. Katalis</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                  Zat yang mempercepat reaksi dengan menyediakan jalur alternatif yang memiliki Energi Aktivasi (Ea) lebih rendah.
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-xs p-3 rounded-lg font-medium">
                  Penting: Katalis tidak dikonsumsi dalam reaksi (terbentuk kembali di akhir).
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TheoryModule;