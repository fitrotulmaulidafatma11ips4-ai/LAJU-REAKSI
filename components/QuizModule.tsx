import React, { useState } from 'react';
import { Question } from '../types';

const questions: Question[] = [
  {
    id: 1,
    text: "Ibu ingin memasak daging sapi agar cepat empuk. Ia memotong daging tersebut menjadi dadu-dadu kecil sebelum merebusnya. Jika dibandingkan dengan merebus daging dalam potongan besar utuh, konsep laju reaksi manakah yang diterapkan Ibu?",
    options: [
      { label: "A", value: "Menurunkan energi aktivasi reaksi pelunakan protein" },
      { label: "B", value: "Memperbesar luas permukaan bidang sentuh daging dengan air panas" },
      { label: "C", value: "Meningkatkan konsentrasi protein dalam panci" },
      { label: "D", value: "Menaikkan suhu didih air dalam panci" },
      { label: "E", value: "Menambahkan katalis alami dari serat daging" }
    ],
    correctAnswer: "B",
    explanation: "Memotong daging menjadi kecil-kecil memperbesar luas permukaan total daging yang bersentuhan langsung dengan air panas. Semakin luas bidang sentuh, semakin banyak tumbukan efektif antara molekul air panas dan serat daging, sehingga reaksi pelunakan (denaturasi/hidrolisis protein) berlangsung lebih cepat."
  },
  {
    id: 2,
    text: "Di kota besar dengan tingkat polusi tinggi, patung-patung yang terbuat dari marmer (CaCO₃) lebih cepat rusak dan berlubang dibandingkan patung serupa di pedesaan. Fenomena ini berkaitan dengan hujan asam. Faktor utama yang menyebabkan perbedaan laju kerusakan tersebut adalah...",
    options: [
      { label: "A", value: "Suhu di kota lebih tinggi daripada di desa (Global Warming)" },
      { label: "B", value: "Luas permukaan patung di kota lebih besar" },
      { label: "C", value: "Konsentrasi asam (H⁺) dalam air hujan di kota lebih tinggi" },
      { label: "D", value: "Adanya katalis logam berat di udara kota" },
      { label: "E", value: "Tekanan udara di kota lebih rendah" }
    ],
    correctAnswer: "C",
    explanation: "Hujan asam di kota memiliki konsentrasi ion H⁺ yang lebih tinggi akibat polusi gas SO₂ dan NOx. Sesuai hukum laju reaksi, semakin tinggi konsentrasi pereaksi (asam), semakin sering tumbukan antar partikel terjadi, sehingga laju reaksi pelarutan marmer (korosi) menjadi jauh lebih cepat."
  },
  {
    id: 3,
    text: "Perhatikan fenomena 'Glow Stick' (tongkat cahaya). Saat dipatahkan, stick menyala terang. Jika stick yang menyala dimasukkan ke dalam gelas berisi air es, nyalanya meredup. Sebaliknya, jika dimasukkan ke air panas, nyalanya menjadi sangat terang namun cepat mati. Kesimpulan yang paling tepat dari percobaan ini adalah...",
    options: [
      { label: "A", value: "Reaksi kimia dalam glow stick bersifat endoterm" },
      { label: "B", value: "Suhu rendah menurunkan energi aktivasi reaksi" },
      { label: "C", value: "Kenaikan suhu meningkatkan laju reaksi sehingga pereaksi cepat habis" },
      { label: "D", value: "Air panas bertindak sebagai katalis bagi glow stick" },
      { label: "E", value: "Luas permukaan zat dalam stick berubah saat dipanaskan" }
    ],
    correctAnswer: "C",
    explanation: "Nyala terang menandakan laju reaksi cepat (pelepasan foton cepat). Air panas menaikkan suhu, sehingga energi kinetik partikel naik dan reaksi berjalan sangat cepat (terang), namun konsekuensinya bahan bakar pereaksi cepat habis (cepat mati). Air es memperlambat laju reaksi (redup) sehingga nyala bertahan lebih lama."
  },
  {
    id: 4,
    text: "Kecelakaan ledakan debu sering terjadi di pabrik pengolahan gandum atau tambang batu bara. Padahal, biji gandum utuh atau bongkahan batu bara sulit diledakkan dengan api kecil. Mengapa partikel debu yang halus sangat mudah meledak?",
    options: [
      { label: "A", value: "Debu memiliki energi potensial lebih tinggi dari bongkahan" },
      { label: "B", value: "Luas permukaan debu sangat besar sehingga reaksi pembakaran berlangsung seketika dan serentak" },
      { label: "C", value: "Debu mengandung gas metana yang bersifat katalis" },
      { label: "D", value: "Partikel debu menurunkan suhu nyala api di sekitarnya" },
      { label: "E", value: "Massa debu lebih ringan sehingga molekul oksigen lebih mudah diikat" }
    ],
    correctAnswer: "B",
    explanation: "Ledakan adalah reaksi pembakaran yang sangat cepat. Debu halus memiliki luas permukaan bidang sentuh yang sangat besar dibandingkan bongkahan. Hal ini memungkinkan kontak dengan oksigen terjadi secara masif dan serentak di seluruh permukaan, memicu reaksi berantai yang sangat cepat (ledakan)."
  },
  {
    id: 5,
    text: "Pada knalpot kendaraan modern terdapat komponen bernama 'Catalytic Converter' yang mengandung logam Platinum dan Rhodium. Alat ini berfungsi mengubah gas beracun (CO dan NO) menjadi gas yang lebih aman (CO₂ dan N₂) dalam waktu sangat singkat. Peran logam Platinum di sini adalah...",
    options: [
      { label: "A", value: "Meningkatkan suhu gas buang agar terbakar habis" },
      { label: "B", value: "Menyerap gas beracun agar tidak keluar ke udara" },
      { label: "C", value: "Menurunkan energi aktivasi (Ea) reaksi penguraian gas" },
      { label: "D", value: "Memperbesar konsentrasi gas buang dalam knalpot" },
      { label: "E", value: "Mengubah orientasi tumbukan antar molekul gas secara permanen" }
    ],
    correctAnswer: "C",
    explanation: "Platinum bertindak sebagai katalis heterogen. Katalis bekerja dengan menyediakan jalur reaksi alternatif yang memiliki Energi Aktivasi (Ea) lebih rendah. Hal ini memungkinkan reaksi pengubahan gas beracun menjadi gas aman dapat terjadi dengan cepat pada suhu knalpot."
  },
  {
    id: 6,
    text: "Seorang siswa melakukan percobaan mereaksikan 5 gram pualam (CaCO₃) dengan larutan HCl. Percobaan 1: Pualam kepingan + HCl 1 M. Percobaan 2: Pualam serbuk + HCl 2 M. Manakah prediksi yang paling tepat mengenai laju reaksi kedua percobaan tersebut?",
    options: [
      { label: "A", value: "Percobaan 1 lebih cepat karena kepingan lebih padat" },
      { label: "B", value: "Percobaan 2 jauh lebih cepat karena pengaruh luas permukaan dan konsentrasi sekaligus" },
      { label: "C", value: "Sama cepat, karena massa pualam sama-sama 5 gram" },
      { label: "D", value: "Percobaan 1 lebih cepat karena HCl 1 M lebih encer sehingga molekul bergerak bebas" },
      { label: "E", value: "Tidak dapat diprediksi tanpa mengetahui suhu larutan" }
    ],
    correctAnswer: "B",
    explanation: "Percobaan 2 memiliki dua faktor yang mempercepat reaksi: (1) Bentuk serbuk memiliki luas permukaan lebih besar dibanding kepingan, dan (2) Konsentrasi HCl 2 M lebih tinggi dibanding 1 M. Akumulasi kedua faktor ini membuat laju reaksi pada percobaan 2 berlangsung jauh lebih cepat."
  },
  {
    id: 7,
    text: "Enzim dalam tubuh manusia bekerja sebagai biokatalisator. Saat seseorang mengalami demam tinggi (suhu > 40°C), proses metabolisme tubuh justru terganggu dan bisa berakibat fatal. Berdasarkan konsep laju reaksi dan sifat katalis, hal ini terjadi karena...",
    options: [
      { label: "A", value: "Suhu tinggi membuat enzim bekerja terlalu cepat hingga kehabisan energi" },
      { label: "B", value: "Kenaikan suhu menyebabkan struktur protein enzim rusak (denaturasi) sehingga kehilangan fungsi katalisnya" },
      { label: "C", value: "Suhu tinggi menurunkan energi kinetik substrat makanan" },
      { label: "D", value: "Enzim berubah menjadi racun pada suhu tinggi" },
      { label: "E", value: "Suhu tubuh tidak mempengaruhi kerja enzim" }
    ],
    correctAnswer: "B",
    explanation: "Meskipun kenaikan suhu umumnya mempercepat reaksi, enzim adalah protein yang memiliki struktur spesifik (sisi aktif). Pada suhu yang terlalu tinggi (seperti demam ekstrem), struktur enzim rusak (denaturasi). Akibatnya, enzim tidak bisa lagi mengikat substrat (kunci-gembok tidak pas), dan reaksi metabolisme melambat atau berhenti."
  },
  {
    id: 8,
    text: "Dalam industri pembuatan amonia (Proses Haber-Bosch), gas N₂ dan H₂ direaksikan pada suhu tinggi dan tekanan tinggi dengan bantuan serbuk besi. Mengapa serbuk besi digunakan, padahal suhu sudah dinaikkan?",
    options: [
      { label: "A", value: "Agar jumlah produk amonia yang dihasilkan lebih banyak (mengeser kesetimbangan)" },
      { label: "B", value: "Untuk menghemat energi pemanasan dengan menurunkan Ea, karena suhu tinggi saja mahal dan berbahaya" },
      { label: "C", value: "Serbuk besi bereaksi dengan N₂ membentuk senyawa antara" },
      { label: "D", value: "Untuk menyerap panas yang dihasilkan reaksi" },
      { label: "E", value: "Agar tekanan dalam wadah tetap stabil" }
    ],
    correctAnswer: "B",
    explanation: "Menaikkan suhu memang mempercepat reaksi, namun pada reaksi eksoterm (seperti pembuatan amonia), suhu terlalu tinggi justru mengurai kembali produk (pergeseran kesetimbangan). Katalis besi digunakan untuk menurunkan Energi Aktivasi, sehingga reaksi bisa berjalan cepat pada suhu yang moderat (tidak terlalu ekstrem), menyeimbangkan kecepatan produksi dan efisiensi biaya."
  },
  {
    id: 9,
    text: "Luka yang diberi larutan Hidrogen Peroksida (H₂O₂) 3% akan berbuih. Buih ini muncul akibat enzim katalase dalam darah yang menguraikan H₂O₂ menjadi air dan gas oksigen. Jika H₂O₂ diteteskan pada kulit yang tidak terluka, tidak timbul buih. Hal ini membuktikan bahwa...",
    options: [
      { label: "A", value: "Laju reaksi dipengaruhi oleh suhu tubuh" },
      { label: "B", value: "H₂O₂ hanya bereaksi dengan bakteri" },
      { label: "C", value: "Katalis (enzim) diperlukan untuk mempercepat penguraian H₂O₂ yang sebenarnya berlangsung lambat" },
      { label: "D", value: "Konsentrasi H₂O₂ meningkat saat menyentuh darah" },
      { label: "E", value: "Darah mengandung zat yang menurunkan energi kinetik H₂O₂" }
    ],
    correctAnswer: "C",
    explanation: "H₂O₂ sebenarnya tidak stabil dan terurai perlahan secara alami. Namun, lajunya sangat lambat. Darah mengandung enzim katalase (katalis) yang menurunkan Ea reaksi penguraian H₂O₂ secara drastis, sehingga reaksi berlangsung sangat cepat (seketika) yang ditandai dengan munculnya banyak gelembung gas oksigen."
  },
  {
    id: 10,
    text: "Saat mencuci pakaian dengan noda membandel, disarankan menggunakan deterjen lebih banyak dan merendamnya dalam air hangat. Hubungan yang tepat antara variabel bebas dan variabel terikat dalam kasus ini adalah...",
    options: [
      { label: "A", value: "Variabel bebas: Kebersihan pakaian; Variabel terikat: Suhu air" },
      { label: "B", value: "Variabel bebas: Konsentrasi deterjen & Suhu; Variabel terikat: Kecepatan hilangnya noda (Laju)" },
      { label: "C", value: "Variabel bebas: Waktu merendam; Variabel terikat: Jumlah deterjen" },
      { label: "D", value: "Variabel bebas: Jenis noda; Variabel terikat: Suhu air" },
      { label: "E", value: "Variabel bebas: Volume air; Variabel terikat: Konsentrasi deterjen" }
    ],
    correctAnswer: "B",
    explanation: "Dalam kasus ini, kita memanipulasi (mengubah-ubah) jumlah deterjen (Konsentrasi) dan temperatur air (Suhu). Tujuannya adalah untuk melihat efeknya terhadap seberapa cepat noda hilang. Jadi, Konsentrasi & Suhu adalah Variabel Bebas, sedangkan Laju reaksi (kecepatan bersih) adalah Variabel Terikat."
  },
];

const stickers = ['🤩', '🤔', '🤯', '😎', '😭'];

const QuizModule: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const handleAnswer = (value: string) => {
    if (showExplanation) return;
    setSelectedOption(value);
    setShowExplanation(true);
    if (value === questions[currentQIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in pt-12">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-900 transition-colors">
            <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                {score >= 8 ? '🏆' : score >= 5 ? '👏' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Evaluasi Selesai!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                Kamu menjawab benar <span className="font-bold text-rose-600 dark:text-rose-400 text-2xl">{score}</span> dari {questions.length} soal.
            </p>
            
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Bagaimana perasaanmu setelah mengerjakan soal ini?</p>
                <div className="flex justify-center gap-4 flex-wrap">
                    {stickers.map(sticker => (
                        <button
                            key={sticker}
                            onClick={() => setSelectedSticker(sticker)}
                            className={`text-4xl p-4 rounded-xl transition-all duration-300 hover:scale-125 ${selectedSticker === sticker ? 'bg-rose-100 dark:bg-rose-900 ring-4 ring-rose-300 dark:ring-rose-700 scale-110 shadow-lg' : 'bg-white dark:bg-slate-600 shadow-sm border border-gray-100 dark:border-slate-500'}`}
                        >
                            {sticker}
                        </button>
                    ))}
                </div>
            </div>

            {selectedSticker && (
                <div className="animate-fade-in mt-4 text-rose-600 dark:text-rose-400 font-medium italic">
                    "Terima kasih atas refleksinya! Teruslah mengasah literasi sainsmu."
                </div>
            )}
            
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-lg font-bold">
                <i className="fas fa-redo mr-2"></i>Ulangi Evaluasi
            </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto pb-12">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-slate-700 h-3 rounded-full mb-8 overflow-hidden shadow-inner">
            <div 
                className="bg-gradient-to-r from-rose-500 to-orange-500 h-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-6 text-white flex justify-between items-center shadow-md">
            <span className="font-bold text-lg opacity-90"><i className="fas fa-question-circle mr-2"></i>Soal {currentQIndex + 1} / {questions.length}</span>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">Literasi Sains</span>
        </div>
        
        <div className="p-6 md:p-8">
            <p className="text-lg md:text-xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed mb-8">
                {question.text}
            </p>

            <div className="space-y-3">
                {question.options.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => handleAnswer(opt.value)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start group relative overflow-hidden ${
                            showExplanation
                                ? opt.value === question.correctAnswer
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200'
                                    : opt.value === selectedOption
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200'
                                        : 'border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500 opacity-60'
                                : 'border-gray-100 dark:border-slate-700 dark:text-slate-300 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-slate-700 hover:shadow-md'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold mr-4 transition-colors ${
                             showExplanation && opt.value === question.correctAnswer 
                                ? 'bg-green-200 text-green-700' 
                                : showExplanation && opt.value === selectedOption
                                    ? 'bg-red-200 text-red-700'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 group-hover:bg-rose-200 group-hover:text-rose-700'
                        }`}>
                            {opt.label}
                        </div>
                        <span className="mt-1">{opt.value}</span>
                    </button>
                ))}
            </div>

            {showExplanation && (
                <div className="mt-8 animate-fade-in">
                    <div className={`p-6 rounded-xl border shadow-sm ${selectedOption === question.correctAnswer ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-center mb-3">
                             <i className={`fas ${selectedOption === question.correctAnswer ? 'fa-check-circle text-green-600 dark:text-green-400' : 'fa-times-circle text-red-600 dark:text-red-400'} text-2xl mr-3`}></i>
                             <h4 className={`font-bold text-lg ${selectedOption === question.correctAnswer ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                {selectedOption === question.correctAnswer ? 'Jawaban Tepat!' : 'Jawaban Kurang Tepat'}
                             </h4>
                        </div>
                        <div className="pl-9">
                            <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Pembahasan & Konsep Sains:</h5>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base text-justify">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 text-right">
                        <button onClick={nextQuestion} className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 font-bold">
                            {currentQIndex < questions.length - 1 ? (
                                <>Soal Selanjutnya <i className="fas fa-arrow-right ml-2"></i></>
                            ) : (
                                <>Lihat Hasil <i className="fas fa-trophy ml-2"></i></>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizModule;