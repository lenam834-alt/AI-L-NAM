import React, { useState } from 'react';
import { Bot, Loader2, Sparkles, Images, Banana, Download, Wand2 } from 'lucide-react';
import { generateJSON, generateIllustration } from '../services/geminiService';
import { CarouselSlide, ImageAsset } from '../types';
import { Schema, Type } from '@google/genai';
import { UploadBox } from './UploadBox';
import { fileToBase64, getMimeType } from '../utils';

export const CarouselMaker: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<CarouselSlide[] | null>(null);
  const [productImage, setProductImage] = useState<ImageAsset | null>(null);
  
  // Local state for images and loading status per slide
  const [slideImages, setSlideImages] = useState<Record<number, string>>({});
  const [generatingImages, setGeneratingImages] = useState<Record<number, boolean>>({});

  const handleUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);
      setProductImage({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType
      });
    } catch (e) {
      console.error("Upload failed", e);
      alert("Lỗi tải ảnh");
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setResults(null);
    setSlideImages({});
    setGeneratingImages({});

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          scene: { type: Type.STRING },
          visual: { type: Type.STRING },
          text: { type: Type.STRING },
          color: { type: Type.STRING }
        },
        required: ["id", "scene", "visual", "text", "color"]
      }
    };

    const apiPrompt = `Create a 5-slide Instagram Carousel plan for the product/topic: "${prompt}".
    Focus on Functions, Tasks, Utilities, and Features.
    Language: Vietnamese.
    For 'color', suggest a tailwind background class like 'bg-yellow-100', 'bg-blue-50', etc.`;

    try {
      const result = await generateJSON(apiPrompt, schema);
      setResults(result as CarouselSlide[]);
    } catch (e) {
      console.error(e);
      alert("Error generating carousel. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (slide: CarouselSlide) => {
    setGeneratingImages(prev => ({ ...prev, [slide.id]: true }));
    try {
      // Use specific prompt for illustration
      const imagePrompt = `Product illustration, 3D icon style, high quality, clean background. 
      Visual description: ${slide.visual}.`;
      
      // Pass the uploaded product image if available
      const imageUrl = await generateIllustration(imagePrompt, slide.text, productImage?.base64);
      if (imageUrl) {
        setSlideImages(prev => ({ ...prev, [slide.id]: imageUrl }));
      }
    } catch (e) {
      console.error("Error generating image for slide", slide.id, e);
      alert("Không thể tạo ảnh minh họa. Vui lòng thử lại.");
    } finally {
      setGeneratingImages(prev => ({ ...prev, [slide.id]: false }));
    }
  };

  const handleDownloadImage = (url: string, slideId: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `slide-${slideId}-illustration.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
        
        {/* Left: Info & Inputs */}
        <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 p-2.5 rounded-xl text-yellow-900 shadow-yellow-200 shadow-md">
                    <Bot size={24} /> 
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Carousel Feature Illustrator</h3>
                    <p className="text-xs text-gray-500">Tạo ảnh cuộn về tính năng sản phẩm kèm icon 3D</p>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Tên sản phẩm / Chủ đề</label>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ví dụ: Nồi chiên không dầu Lock&Lock..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full px-8 py-4 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-all hover:shadow-lg flex items-center justify-center"
            >
                {isGenerating ? (
                <span className="flex items-center"><Loader2 className="animate-spin mr-2" size={18}/> Đang lên kế hoạch...</span>
                ) : (
                <span className="flex items-center"><Sparkles className="mr-2" size={18}/> Tạo Kế Hoạch & Gợi Ý</span>
                )}
            </button>
        </div>

        {/* Right: Image Upload */}
        <div className="w-full md:w-64">
             <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh sản phẩm mẫu (Tùy chọn)</label>
             <UploadBox 
                 id="carousel-product-upload" 
                 label="Tải ảnh sản phẩm" 
                 image={productImage} 
                 onUpload={handleUpload} 
                 onRemove={() => setProductImage(null)}
                 heightClass="h-40"
             />
             <p className="text-[10px] text-gray-400 mt-2 italic">
                 *Tải ảnh lên để AI vẽ minh họa sát với sản phẩm thực tế nhất.
             </p>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-8 overflow-x-auto custom-scrollbar">
        {results ? (
          <div className="flex space-x-6 min-w-max h-full items-center px-4">
            {results.map((slide) => {
              const hasImage = !!slideImages[slide.id];
              const isImgLoading = !!generatingImages[slide.id];

              return (
                <div key={slide.id} className="w-80 h-[520px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                  <div className={`h-2 bg-gradient-to-r from-yellow-400 to-orange-500`}></div>
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <span className="font-bold text-gray-500 text-sm">Slide {slide.id}</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase tracking-wide">{slide.scene}</span>
                  </div>
                  
                  {/* Image Area */}
                  <div className={`relative h-64 flex items-center justify-center bg-gray-100 overflow-hidden`}>
                    {hasImage ? (
                      <div className="relative w-full h-full group/image">
                         <img src={slideImages[slide.id]} alt={slide.visual} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleDownloadImage(slideImages[slide.id], slide.id)}
                              className="p-2 bg-white rounded-full text-gray-800 hover:text-blue-600 hover:scale-110 transition-all shadow-lg"
                              title="Tải ảnh"
                            >
                              <Download size={20} />
                            </button>
                            <button 
                               onClick={() => handleGenerateImage(slide)}
                               className="p-2 bg-white rounded-full text-gray-800 hover:text-yellow-600 hover:scale-110 transition-all shadow-lg"
                               title="Tạo lại ảnh"
                             >
                               <Wand2 size={20} />
                             </button>
                         </div>
                      </div>
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${slide.color} bg-opacity-40`}>
                        {isImgLoading ? (
                          <div className="text-yellow-600 flex flex-col items-center">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <span className="text-xs font-bold">Đang vẽ minh họa...</span>
                          </div>
                        ) : (
                          <>
                             <Images size={32} className="text-gray-400 mb-2" />
                             <p className="text-xs text-gray-500 line-clamp-3 mb-3 italic">"{slide.visual}"</p>
                             <button 
                               onClick={() => handleGenerateImage(slide)}
                               className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg text-xs font-bold shadow-sm hover:bg-yellow-50 flex items-center gap-1 transition-colors"
                             >
                               <Wand2 size={12} />
                               Tạo ảnh minh họa
                             </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between bg-white relative">
                     <div className="absolute -top-6 left-5 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm z-10 text-2xl">
                        💡
                     </div>
                     <div className="mt-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-wider">Thông điệp chính</p>
                        <p className="font-bold text-gray-800 text-sm leading-relaxed">{slide.text}</p>
                     </div>
                     <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Banana size={10} className="text-yellow-500"/>
                            Generated by Google Banana
                        </span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-spin-slow">
               <Banana size={64} className="text-yellow-500" />
            </div>
            <p className="text-lg font-medium text-gray-600">Carousel Planner</p>
            <p className="text-sm">Nhập tên sản phẩm để tạo chuỗi ảnh giới thiệu tính năng</p>
          </div>
        )}
      </div>
    </div>
  );
};