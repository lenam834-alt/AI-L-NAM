import React, { useState } from 'react';
import { Clapperboard, Calendar, Mic, Sparkles, Loader2, Copy, Download } from 'lucide-react';
import { generateJSON } from '../services/geminiService';
import { ChannelPlanItem, ScriptContent } from '../types';
import { Schema, Type } from '@google/genai';

export const ChannelScriptBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'channel' | 'review'>('channel');
  const [productName, setProductName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [channelPlan, setChannelPlan] = useState<ChannelPlanItem[] | null>(null);
  const [scriptContent, setScriptContent] = useState<ScriptContent | null>(null);

  const handleGenerate = async () => {
    if (!productName) return;
    setIsGenerating(true);
    setChannelPlan(null);
    setScriptContent(null);

    const systemInstruction = "You are an expert TikTok/Youtube content strategist and scriptwriter. Language: Vietnamese.";

    try {
      if (activeTab === 'channel') {
        const prompt = `Create a 3-part content series plan for reviewing/promoting the product: "${productName}". 
        Output JSON array with fields: day, format (e.g. Short Video, Carousel), hook, content (summary), cta.`;
        
        const schema: Schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              format: { type: Type.STRING },
              hook: { type: Type.STRING },
              content: { type: Type.STRING },
              cta: { type: Type.STRING }
            },
            required: ["day", "format", "hook", "content", "cta"]
          }
        };

        const result = await generateJSON(prompt, schema, systemInstruction);
        setChannelPlan(result as ChannelPlanItem[]);
      } else {
        const prompt = `Write a detailed 5-part video script for a direct review of "${productName}".
        Output JSON object with: title, structure (array of objects with part (e.g. Hook, Problem, Solution) and desc (description/dialogue)).`;

        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                structure: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            part: { type: Type.STRING },
                            desc: { type: Type.STRING }
                        },
                        required: ["part", "desc"]
                    }
                }
            },
            required: ["title", "structure"]
        };

        const result = await generateJSON(prompt, schema, systemInstruction);
        setScriptContent(result as ScriptContent);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h3 className="font-bold text-gray-800 flex items-center text-lg">
              <Clapperboard className="mr-3 text-indigo-600" size={24} /> 
              Xây Kênh & Kịch Bản
            </h3>
            
            <div className="flex bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
              <button 
                onClick={() => { setActiveTab('channel'); setChannelPlan(null); setScriptContent(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'channel' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Calendar size={16} className="mr-2"/> Xây Kênh Series
              </button>
              <button 
                onClick={() => { setActiveTab('review'); setChannelPlan(null); setScriptContent(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'review' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Mic size={16} className="mr-2"/> Kịch Bản 1 Video
              </button>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nhập tên sản phẩm (VD: Son Black Rouge A12, Tai nghe Airpod Pro...)" 
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={!productName || isGenerating}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : (
                <>
                  <Sparkles className="mr-2" size={18} />
                  {activeTab === 'channel' ? 'Lập Kế Hoạch' : 'Viết Kịch Bản'}
                </>
              )}
            </button>
         </div>
         <p className="text-xs text-gray-500 mt-3 ml-1">
           {activeTab === 'channel' 
             ? '*AI sẽ tạo lộ trình nội dung đa kênh để xây dựng uy tín.' 
             : '*AI sẽ viết kịch bản chi tiết từng giây để quay video.'}
         </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {channelPlan || scriptContent ? (
           <div className="animate-fade-in space-y-4 pb-6">
             {activeTab === 'channel' && channelPlan && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {channelPlan.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                      <h4 className="font-bold text-indigo-700 mb-3 text-lg">{item.day}</h4>
                      <div className="text-xs font-bold bg-gray-100 text-gray-600 inline-block px-2.5 py-1 rounded-md mb-4 uppercase tracking-wide">{item.format}</div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Hook</p>
                          <p className="text-sm font-medium text-gray-800 italic bg-gray-50 p-2 rounded-lg border border-gray-100">"{item.hook}"</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Nội dung</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Call to Action</p>
                          <p className="text-sm text-indigo-600 font-bold">{item.cta}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}
             
             {activeTab === 'review' && scriptContent && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-6">{scriptContent.title}</h2>
                  <div className="space-y-8 relative pl-4">
                     <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                     {scriptContent.structure.map((part, idx) => (
                       <div key={idx} className="flex gap-6 relative group">
                          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 z-10 shadow-sm group-hover:scale-110 group-hover:border-indigo-400 transition-all">
                            {idx + 1}
                          </div>
                          <div className="flex-1 bg-gray-50 p-5 rounded-2xl border border-gray-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                             <h5 className="font-bold text-gray-900 mb-2">{part.part}</h5>
                             <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{part.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-10 flex justify-center space-x-4">
                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl flex items-center hover:bg-gray-800 transition-colors font-medium text-sm"><Copy size={16} className="mr-2"/> Sao chép</button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl flex items-center hover:bg-gray-50 transition-colors font-medium text-sm"><Download size={16} className="mr-2"/> Tải PDF</button>
                  </div>
                </div>
             )}
           </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 pb-20">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <Clapperboard size={48} className="text-indigo-300" />
              </div>
              <p className="text-lg font-medium">Nhập tên sản phẩm để AI lên kế hoạch</p>
              <p className="text-sm mt-2">Hỗ trợ xây kênh series hoặc kịch bản chi tiết</p>
           </div>
        )}
      </div>
    </div>
  );
};
