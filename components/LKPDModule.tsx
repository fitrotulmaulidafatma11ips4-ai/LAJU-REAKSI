import React, { useState, useEffect } from 'react';
import { LKPDData } from '../types';

const LKPDModule: React.FC = () => {
  const [data, setData] = useState<LKPDData>({
    name: '',
    absentNo: '',
    className: '',
    hypothesis: '',
    aspectContext: '',
    aspectContent: '',
    solution: '',
    reflection: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('lkpd_ssi_data');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('lkpd_ssi_data', JSON.stringify(data));
    alert('LKPD SSI Tersimpan!');
  };

  const handleChange = (field: keyof LKPDData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden print-only transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white no-print">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold">LKPD Terintegrasi SSI</h2>
                    <p className="text-blue-100 mt-2">Socio-Scientific Issues: Laju Reaksi & Keselamatan Jalan Raya</p>
                </div>
                <div className="space-x-2">
                    <button onClick={handleSave} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors font-semibold">
                        <i className="fas fa-save mr-2"></i>Simpan
                    </button>
                    <button onClick={() => window.print()} className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-semibold">
                        <i className="fas fa-print mr-2"></i>Cetak PDF
                    </button>
                </div>
            </div>
        </div>

        {/* Print Header */}
        <div className="hidden print-only p-8 border-b-2 border-black text-center">
            <h1 className="text-2xl font-bold uppercase">Lembar Kerja Peserta Didik (LKPD)</h1>
            <p className="text-lg font-semibold">Terintegrasi Socio-Scientific Issues (SSI)</p>
            <p className="text-sm">Materi: Teori Tumbukan & Laju Reaksi</p>
        </div>

        <div className="p-4 md:p-8 space-y-8">
            
            {/* Identity Section */}
            <div className="grid md:grid-cols-3 gap-6 bg-blue-50 dark:bg-slate-700/50 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                <div>
                    <label className="block text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">Nama Lengkap</label>
                    <input 
                        value={data.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" 
                        placeholder="Nama Siswa"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">No. Absen</label>
                    <input 
                        value={data.absentNo} 
                        onChange={(e) => handleChange('absentNo', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">Kelas</label>
                    <input 
                        value={data.className} 
                        onChange={(e) => handleChange('className', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" 
                    />
                </div>
            </div>

            {/* BAGIAN 1: WACANA SSI (Stimulus) */}
            <section className="border dark:border-slate-600 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-yellow-400 px-4 py-2 font-bold text-slate-800 flex items-center">
                    <i className="fas fa-newspaper mr-2"></i> KONTEN SSI (Isu Sosial Sains)
                </div>
                <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900">
                    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 shadow-md rounded-lg border border-gray-200 dark:border-slate-700">
                        <div className="border-b dark:border-slate-600 pb-4 mb-4">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                Fakta Kecelakaan Mobil di Kemayoran Tewaskan 3 Orang
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Minggu, 8 Oktober 2023 | Sumber: Ilustrasi Detik.com</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                <div className="bg-gray-200 dark:bg-slate-700 w-full h-40 rounded-lg flex items-center justify-center text-gray-400 mb-2 overflow-hidden">
                                     <i className="fas fa-car-crash text-5xl opacity-50"></i>
                                </div>
                                <p className="text-xs text-center italic text-gray-500 dark:text-gray-400">Gambar 5. Ilustrasi Kecelakaan Mobil</p>
                            </div>
                            <div className="md:w-2/3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 text-justify">
                                <p>
                                    <strong>Jakarta</strong> - Kecelakaan maut terjadi di Jalan Benyamin Sueb, Kemayoran, Jakarta Pusat (Jakpus). Kecelakaan melibatkan mobil dan motor berboncengan tiga orang. Akibatnya ketiga orang yang berboncengan itu meninggal dunia.
                                </p>
                                <p>
                                    Kasat Lantas Jakarta Pusat, Kompol Gomos Simamora mengatakan kecelakaan terjadi pada Minggu (8/10/2023) pukul 23.30 WIB. Mulanya mobil Innova yang dikemudikan laki-laki inisial AKC (25) melintas di jalur cepat dari arah selatan ke utara.
                                </p>
                                <p>
                                    "Setelah melewati kolong flyover HBR Motik, mobil tersebut menabrak motor yang dikemudikan laki-laki inisial NAN beserta dua orang pembonceng," ujar Gomos.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 text-sm uppercase">Koneksi Sains:</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                                "Berdasarkan peristiwa diatas, terjadinya tumbukan antar partikel disebabkan setiap partikel dalam suatu zat memiliki <strong>energi kinetik</strong> sehingga partikel-partikel tersebut selalu bergerak. Gerakan ini memungkinkan terjadinya tumbukan antar partikel yang akhirnya menghasilkan reaksi kimia (atau dalam kasus makroskopis: tabrakan)."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BAGIAN 2: HIPOTESIS */}
            <section>
                <div className="border-2 border-dashed border-yellow-400 rounded-xl p-6 bg-yellow-50/50 dark:bg-yellow-900/20">
                    <div className="flex items-start mb-4">
                        <div className="bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Merumuskan Hipotesis</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Setelah menganalisis permasalahan di atas, tuliskan hipotesis awal kamu mengenai <strong>teori tumbukan</strong>!</p>
                        </div>
                    </div>
                    <textarea 
                        value={data.hypothesis}
                        onChange={(e) => handleChange('hypothesis', e.target.value)}
                        className="w-full h-32 p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none bg-white dark:bg-slate-800 dark:text-white shadow-inner"
                        placeholder="Contoh: Semakin besar energi kinetik benda yang bertabrakan, maka dampak kerusakannya semakin besar (analogi laju reaksi)..."
                    ></textarea>
                </div>
            </section>

            {/* BAGIAN 3: INVESTIGASI KELOMPOK (Konteks & Konten) */}
            <section className="bg-slate-100 dark:bg-slate-700/30 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Investigasi & Analisis Masalah</h3>
                </div>
                
                <div className="space-y-8">
                    {/* ASPEK KONTEKS */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 text-sm md:text-base w-3/4">
                                1. Menurut kalian, bagaimana dampak yang terjadi dari peristiwa tabrakan mobil pada lingkungan sekitar (sosial/fisik)?
                            </label>
                            <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded font-bold uppercase">Aspek Konteks</span>
                        </div>
                        <div className="p-1 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-800 dark:to-amber-900 rounded-lg">
                            <textarea 
                                value={data.aspectContext}
                                onChange={(e) => handleChange('aspectContext', e.target.value)}
                                className="w-full h-32 p-4 border-none rounded-md focus:ring-0 outline-none bg-white dark:bg-slate-800 dark:text-white"
                                placeholder="Jawab disini..."
                            ></textarea>
                        </div>
                    </div>

                    {/* ASPEK KONTEN */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 text-sm md:text-base w-3/4">
                                2. Jika ditinjau melalui peristiwa kimia, jelaskan <strong>Teori Tumbukan</strong> menurut pendapatmu berdasarkan analogi kecelakaan tersebut!
                            </label>
                            <span className="bg-yellow-300 text-yellow-900 text-xs px-2 py-1 rounded font-bold uppercase">Aspek Konten</span>
                        </div>
                        <div className="p-1 bg-gradient-to-r from-yellow-200 to-yellow-100 dark:from-yellow-700 dark:to-yellow-800 rounded-lg">
                            <textarea 
                                value={data.aspectContent}
                                onChange={(e) => handleChange('aspectContent', e.target.value)}
                                className="w-full h-32 p-4 border-none rounded-md focus:ring-0 outline-none bg-white dark:bg-slate-800 dark:text-white"
                                placeholder="Jelaskan tentang energi kinetik, orientasi tumbukan, dan tumbukan efektif..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </section>

            {/* BAGIAN 4: PEMECAHAN MASALAH (SOLUSI BERMAKNA) */}
            <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 page-break">
                <div className="flex items-start mb-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Solusi & Pengambilan Keputusan</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Sebagai saintis muda, berikan solusi untuk meminimalkan dampak "tumbukan" di jalan raya yang dihubungkan dengan konsep penurunan energi kinetik atau laju reaksi!</p>
                    </div>
                </div>
                <textarea 
                    value={data.solution}
                    onChange={(e) => handleChange('solution', e.target.value)}
                    className="w-full h-32 p-4 border border-green-300 dark:border-green-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 dark:text-white"
                    placeholder="Contoh Solusi: Membatasi kecepatan (menurunkan energi kinetik), Sabuk pengaman (mengurangi dampak tumbukan)..."
                ></textarea>
            </section>

            {/* BAGIAN 5: REFLEKSI */}
            <section className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center mb-4">
                    <i className="fas fa-lightbulb text-indigo-600 dark:text-indigo-400 text-2xl mr-3"></i>
                    <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">Refleksi Pembelajaran</h3>
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">Apa hubungan paling menarik antara kecelakaan mobil dengan reaksi kimia yang kamu pelajari hari ini?</p>
                <textarea 
                    value={data.reflection}
                    onChange={(e) => handleChange('reflection', e.target.value)}
                    className="w-full h-24 p-4 border border-indigo-200 dark:border-indigo-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 dark:text-white"
                    placeholder="Tuliskan refleksi singkat..."
                ></textarea>
            </section>
        </div>
      </div>
    </div>
  );
};

export default LKPDModule;