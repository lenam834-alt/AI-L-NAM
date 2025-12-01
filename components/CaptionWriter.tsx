import React, { useState } from 'react';
import { PenTool, Copy, Loader2, Check } from 'lucide-react';
import { generateMarketingText } from '../services/geminiService';

export const CaptionWriter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateCaptions = async () => {
    if (!topic) return;
    setLoading(true);
    setCaptions([]);

    const prompt = `Write 4 distinct, engaging social media captions (for TikTok/Facebook) about: "${topic}". 
    Includes trending hashtags. Language: Vietnamese. 
    Separate each caption clearly with "---".`;

    try {
      const text = await generateMarketingText(prompt);
      if (text) {
        const splitCaptions = text.split('---').map(c => c.trim()).filter(c => c.length > 0);
        setCaptions(splitCaptions);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating captions.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
           <div className="p-2 bg-blue-100 rounded-lg mr-3">
             <PenTool className="text-blue-600" size={20} />
           </div>
           Viết Caption & Hashtag
        </h3>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ví dụ: Review son môi, Mẹo học tiếng Anh, Outfit đi biển..."
          className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none mb-6 transition-all focus:bg-white"
        />
        <button
            onClick={generateCaptions}
            disabled={loading || !topic}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
        >
            {loading ? <Loader2 className="animate-spin" /> : 'Tạo Caption Ngay'}
        </button>
      </div>
      
      <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {captions.length > 0 ? (
          captions.map((cap, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all group relative">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pr-8">{cap}</p>
              <button 
                onClick={() => copyToClipboard(cap, idx)}
                className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${copiedIndex === idx ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}
                title="Sao chép"
              >
                {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <PenTool size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Nhập chủ đề để AI viết caption</p>
          </div>
        )}
      </div>
    </div>
  );
};
