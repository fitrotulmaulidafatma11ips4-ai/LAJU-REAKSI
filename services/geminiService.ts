import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMotivationalQuote = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Belajar kimia adalah jendela dunia. Tetap semangat!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Berikan satu kalimat motivasi pendek (maksimal 20 kata) yang sangat inspiratif untuk siswa yang sedang belajar Kimia (Laju Reaksi). Bahasa Indonesia, Gaul tapi sopan.",
    });
    return response.text || "Semangat belajar!";
  } catch (error) {
    console.error("Error fetching quote:", error);
    return "Kegagalan adalah awal dari keberhasilan. Coba lagi!";
  }
};

export const simulateLabExperiment = async (topic: string, parameter: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Mode offline: Reaksi berjalan lebih cepat.";

  try {
    const prompt = `
      Anda adalah asisten laboratorium kimia AI.
      Topik: Faktor Laju Reaksi - ${topic}.
      Siswa mengubah parameter menjadi: ${parameter}.
      
      Deskripsikan secara visual dan singkat (maksimal 3 kalimat) apa yang terjadi pada tingkat molekuler dan makroskopis (gelembung, warna, waktu).
      Jangan berikan rumus, hanya observasi.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Tidak ada data observasi.";
  } catch (error) {
    return "Gagal menghubungkan ke AI Lab. Periksa koneksi internet.";
  }
};

export const getQuizExplanation = async (question: string, answer: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Penjelasan tidak tersedia saat offline.";

  try {
    const prompt = `Jelaskan secara singkat mengapa jawaban untuk pertanyaan '${question}' berkaitan dengan '${answer}' adalah benar atau salah dalam konteks laju reaksi.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Tidak ada penjelasan.";
  } catch (error) {
    return "Error memuat penjelasan.";
  }
};