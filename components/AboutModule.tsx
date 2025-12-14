import React from 'react';

const glossary = [
  { term: "Laju Reaksi", def: "Perubahan konsentrasi reaktan atau produk per satuan waktu." },
  { term: "Energi Aktivasi", def: "Energi minimum yang diperlukan agar reaksi kimia dapat terjadi." },
  { term: "Katalis", def: "Zat yang mempercepat laju reaksi tanpa ikut bereaksi secara permanen." },
  { term: "Tumbukan Efektif", def: "Tumbukan antar partikel yang menghasilkan reaksi kimia." },
  { term: "Konsentrasi", def: "Jumlah zat terlarut dalam setiap satuan larutan." },
];

const AboutModule: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Glosarium */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white"><i className="fas fa-book-medical mr-2 text-gray-500 dark:text-gray-400"></i>Glosarium Kimia</h2>
        </div>
        <div className="p-6 grid gap-4">
            {glossary.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-600">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">{item.term}</span>
                    <span className="text-gray-600 dark:text-slate-300 text-sm">{item.def}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Profil Pengembang */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-xl overflow-hidden text-white p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 text-4xl shadow-inner border-4 border-slate-700 dark:border-slate-500">
            <i className="fas fa-user"></i>
        </div>
        <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Ika Ni'amah Sari</h2>
            <div className="inline-block bg-indigo-500 text-xs px-3 py-1 rounded-full mb-4">Pengembang Modul</div>
            <p className="text-slate-300 dark:text-slate-200 max-w-lg leading-relaxed">
                Mahasiswa Pendidikan Kimia yang berdedikasi mengembangkan media pembelajaran interaktif berbasis teknologi untuk meningkatkan pemahaman siswa terhadap konsep kimia abstrak.
            </p>
             <div className="mt-6 flex justify-center md:justify-start space-x-4">
                <a 
                  href="https://www.instagram.com/ikkaniaa?igsh=MWRwbnJkcXAwNDRtZg==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-indigo-500 transition-colors"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors"><i className="fab fa-linkedin-in"></i></a>
                <a 
                  href="mailto:ika.niamah.2203316@students.um.ac.id" 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <i className="far fa-envelope"></i>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModule;