import React, { useState } from 'react';
import { Megaphone, Loader2, Sparkles, MoreHorizontal, Images, ThumbsUp, MessageCircle, Share2, Copy } from 'lucide-react';
import { generateJSON } from '../services/geminiService';
import { GeneratedAd } from '../types';
import { Schema, Type } from '@google/genai';

export const FacebookAdCreator: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [adContent, setAdContent] = useState<GeneratedAd | null>(null);

  const handleGenerate = async () => {
    if (!productInfo) return;
    setIsGenerating(true);
    setAdContent(null);

    const prompt = `Write a high-converting Facebook ad for the following product/service: "${productInfo}".
    The output must be a JSON object with two fields:
    1. "hook": An array of 3 short, punchy, attention-grabbing opening lines (strings).
    2. "body": The main ad copy (string). Use emojis, bullet points, formatting. Focus on benefits, scarcity, and a clear Call to Action (CTA). Language: Vietnamese.`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.ARRAY, items: { type: Type.STRING } },
        body: { type: Type.STRING }
      },
      required: ["hook", "body"]
    };

    try {
      const result = await generateJSON(prompt, schema, "You are a world-class copywriter specializing in Facebook Ads for the Vietnamese market.");
      if (result) {
        setAdContent(result as GeneratedAd);
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo quảng cáo. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Left Input Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
         <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-blue-200 shadow-lg">
              <Megaphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Tạo Quảng Cáo Facebook</h3>
              <p className="text-sm text-gray-500">AI tối ưu Hook & Body để tăng tỷ lệ chuyển đổi</p>
            </div>
         </div>

         <div className="space-y-4 flex-1">
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Sản phẩm / Dịch vụ của bạn</label>
             <textarea 
               value={productInfo}
               onChange={(e) => setProductInfo(e.target.value)}
               placeholder="Ví dụ: Giày thể thao nam siêu nhẹ, thoáng khí, giá 299k. Freeship hôm nay..."
               className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none bg-gray-50 focus:bg-white transition-colors"
             />
           </div>
           
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">Mẹo viết quảng cáo hiệu quả:</h4>
             <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside opacity-80">
               <li>Tập trung vào lợi ích (Benefit) thay vì tính năng.</li>
               <li>Tạo sự khan hiếm (Chỉ còn 50 suất, Hết hạn tối nay).</li>
               <li>Kêu gọi hành động (CTA) rõ ràng ở cuối bài.</li>
             </ul>
           </div>
         </div>

         <button 
            onClick={handleGenerate}
            disabled={!productInfo || isGenerating}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center mt-6 shadow-lg shadow-blue-200 transition-all hover:shadow-xl active:scale-95"
         >
            {isGenerating ? <Loader2 className="animate-spin" /> : (
              <>
                <Sparkles className="mr-2" size={18} />
                Viết Quảng Cáo Ngay
              </>
            )}
         </button>
      </div>

      {/* Right Preview Panel - Facebook Post UI */}
      <div className="bg-gray-100 p-4 md:p-8 rounded-2xl border border-gray-200 overflow-y-auto flex items-start justify-center">
        {adContent ? (
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden animate-fade-in">
             {/* FB Header */}
             <div className="p-4 flex items-center justify-between">
               <div className="flex items-center">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">NL</div>
                 <div className="ml-3">
                   <h4 className="font-bold text-sm text-gray-900 leading-tight">Nam Lê Store</h4>
                   <p className="text-xs text-gray-500 flex items-center mt-0.5">
                     Được tài trợ <span className="mx-1 text-[8px]">•</span> <span className="text-gray-400">🌍</span>
                   </p>
                 </div>
               </div>
               <MoreHorizontal size={20} className="text-gray-500" />
             </div>

             {/* FB Content Area */}
             <div className="px-4 pb-3 text-[15px] text-gray-900 leading-relaxed font-normal">
                {/* THE HOOK SECTION */}
                <div className="bg-yellow-50 -mx-2 px-3 py-2 rounded-lg border border-yellow-100 mb-3 space-y-2">
                   {adContent.hook.map((line, idx) => (
                     <p key={idx} className="font-semibold text-gray-800">🔥 {line}</p>
                   ))}
                </div>
                
                {/* The Body */}
                <div className="text-gray-800 whitespace-pre-line">
                  {adContent.body}
                </div>
             </div>

             {/* FB Image Placeholder */}
             <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-y border-gray-100">
               <Images size={48} className="mb-2 opacity-50" />
               <span className="text-xs">Ảnh sản phẩm sẽ hiển thị ở đây</span>
             </div>

             {/* FB Actions Stats */}
             <div className="px-4 py-2 border-b border-gray-200 flex justify-between text-gray-500 text-sm">
                <span className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] mr-1"><ThumbsUp size={8} fill="white"/></div> 1.2K</span>
                <span>245 Bình luận • 89 Chia sẻ</span>
             </div>

             {/* FB Action Buttons */}
             <div className="px-2 py-1 flex justify-between">
                <button className="flex-1 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm transition-colors"><ThumbsUp size={18} className="mr-2"/> Thích</button>
                <button className="flex-1 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm transition-colors"><MessageCircle size={18} className="mr-2"/> Bình luận</button>
                <button className="flex-1 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm transition-colors"><Share2 size={18} className="mr-2"/> Chia sẻ</button>
             </div>
             
             {/* Copy Button */}
             <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
               <button 
                 onClick={() => navigator.clipboard.writeText(adContent.hook.join('\n') + "\n\n" + adContent.body)}
                 className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center w-full py-1 hover:bg-blue-50 rounded transition-colors"
               >
                 <Copy size={16} className="mr-1" /> Sao chép nội dung
               </button>
             </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                 <Megaphone size={40} className="opacity-40 text-gray-500" />
             </div>
             <p className="font-medium text-gray-500">Bản xem trước quảng cáo sẽ hiển thị ở đây</p>
             <p className="text-sm mt-1 opacity-70">Nhập thông tin sản phẩm để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};
