import React, { useState } from 'react';
import { Wand2, Sparkles, RotateCcw, AlertCircle, Download, Video } from 'lucide-react';
import { UploadBox } from './UploadBox';
import { generateFashionImage, suggestPrompt, generateVeoPromptFromImage } from '../services/geminiService';
import { fileToBase64, getMimeType } from '../utils';
import { ImageAsset, TabType } from '../types';

export const AIFashionStudio: React.FC = () => {
  // State
  const [fashionImage, setFashionImage] = useState<ImageAsset | null>(null);
  const [productImage, setProductImage] = useState<ImageAsset | null>(null);
  const [modelImage, setModelImage] = useState<ImageAsset | null>(null);
  
  const [prompt, setPrompt] = useState<string>(`Mô tả bối cảnh & tạo dáng:
Một em bé 3 tuổi đang bước đi vui vẻ
Bối cảnh: Đường phố
Phong cách: Nhiếp ảnh thời trang chuyên nghiệp, ánh sáng dịu nhẹ`);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.FASHION);
  const [error, setError] = useState<string | null>(null);

  // Helper to process file upload
  const handleUpload = async (file: File, setter: React.Dispatch<React.SetStateAction<ImageAsset | null>>) => {
    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);
      setter({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType
      });
    } catch (e) {
      console.error("Upload failed", e);
      setError("Không thể xử lý ảnh. Vui lòng thử lại.");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Vui lòng nhập mô tả cho hình ảnh mong muốn.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      // Collect valid images
      const inputImages: ImageAsset[] = [];
      if (fashionImage) inputImages.push(fashionImage);
      if (productImage) inputImages.push(productImage);
      if (modelImage) inputImages.push(modelImage);

      const result = await generateFashionImage(prompt, inputImages);
      
      if (result) {
        setResultImage(result);
      } else {
        setError("AI đã tạo nội dung nhưng không có ảnh nào được trả về. Thử điều chỉnh mô tả của bạn.");
      }
    } catch (err) {
      setError("Không thể tạo ảnh. Khóa API có thể không hợp lệ hoặc mô hình đang quá tải.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestPrompt = async () => {
    setIsSuggesting(true);
    try {
      const suggestion = await suggestPrompt(activeTab === TabType.FASHION ? "Chụp ảnh thời trang cao cấp" : "Chụp ảnh quảng cáo sản phẩm");
      setPrompt(suggestion);
    } catch (err) {
      setError("Không thể gợi ý prompt.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleVeoPrompt = async () => {
    if (!modelImage) {
      setError("Vui lòng tải lên ảnh 'Người mẫu / Chủ thể' để tạo prompt video.");
      return;
    }
    
    setIsGeneratingVeo(true);
    setError(null);
    try {
      const veoPrompt = await generateVeoPromptFromImage(modelImage);
      setPrompt(veoPrompt);
    } catch (err) {
      setError("Không thể tạo prompt video. Vui lòng thử lại.");
    } finally {
      setIsGeneratingVeo(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `fashion-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full bg-pink-50 p-2 md:p-4 font-sans text-slate-800 overflow-y-auto custom-scrollbar">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT PANEL (INPUTS) --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
             <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Sparkles className="text-pink-500" size={20}/>
                   Tài nguyên đầu vào
                </h2>
                <p className="text-sm text-gray-500">Tải lên ảnh tham khảo để hướng dẫn AI tạo hình.</p>
             </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <UploadBox 
                id="fashion"
                label="1. Phong cách tham khảo" 
                image={fashionImage} 
                onUpload={(f) => handleUpload(f, setFashionImage)} 
                onRemove={() => setFashionImage(null)} 
              />
              <UploadBox 
                id="product"
                label="2. Sản phẩm" 
                image={productImage} 
                onUpload={(f) => handleUpload(f, setProductImage)} 
                onRemove={() => setProductImage(null)} 
              />
            </div>

            <UploadBox 
              id="model"
              label="3. Người mẫu / Chủ thể" 
              image={modelImage} 
              onUpload={(f) => handleUpload(f, setModelImage)} 
              onRemove={() => setModelImage(null)} 
              heightClass="h-48"
            />

            <p className="text-xs text-gray-400 mt-4 italic text-center">
              * AI sẽ kết hợp các ảnh này dựa trên mô tả của bạn bên dưới.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-pink-700 font-bold">Bối cảnh & Yêu cầu</h3>
                 {error && (
                     <div className="flex items-center text-red-500 text-xs font-bold gap-1 animate-pulse">
                         <AlertCircle size={12} />
                         <span>Lỗi</span>
                     </div>
                 )}
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
              <button 
                onClick={() => setActiveTab(TabType.FASHION)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === TabType.FASHION ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Prompt Thời trang
              </button>
              <button 
                onClick={() => setActiveTab(TabType.PRODUCT)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === TabType.PRODUCT ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Prompt Sản phẩm
              </button>
            </div>

            <div className="relative flex-grow mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none font-mono leading-relaxed transition-all"
                placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo..."
              />
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-3">
                <button 
                  onClick={handleSuggestPrompt}
                  disabled={isSuggesting}
                  className="flex-1 py-3 rounded-xl border-2 border-purple-200 text-purple-600 font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors disabled:opacity-50 text-sm"
                >
                  <Sparkles size={16} className={isSuggesting ? "animate-spin" : ""} />
                  {isSuggesting ? "Đang gợi ý..." : "Gợi ý Prompt"}
                </button>
                
                <button 
                  onClick={handleVeoPrompt}
                  disabled={isGeneratingVeo || !modelImage}
                  className={`flex-1 py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors text-sm
                    ${(!modelImage && !isGeneratingVeo) ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : ''}`}
                  title={!modelImage ? "Vui lòng tải ảnh mẫu trước" : "Tạo prompt video từ ảnh mẫu"}
                >
                  <Video size={16} className={isGeneratingVeo ? "animate-pulse" : ""} />
                  {isGeneratingVeo ? "Đang phân tích..." : "Prompt Video (Veo)"}
                </button>
              </div>
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-200 transition-all
                  ${isGenerating ? 'bg-pink-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.01]'}`}
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="animate-spin" size={20} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Tạo Ảnh
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* --- RIGHT PANEL (RESULT) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-1 shadow-sm border border-pink-100 h-full flex flex-col min-h-[600px]">
            
            <div className="p-5 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Kết quả</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Gemini 3 Pro
              </span>
            </div>

            <div className="flex-grow bg-gray-50 m-2 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {resultImage ? (
                <div className="relative w-full h-full animate-fade-in group">
                  <img 
                    src={resultImage} 
                    alt="Kết quả từ AI" 
                    className="w-full h-full object-contain bg-gray-900 rounded-2xl"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={handleDownload}
                        className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-gray-700 transition-transform hover:scale-110" 
                        title="Tải xuống"
                    >
                      <Download size={20} />
                    </button>
                    <button 
                        onClick={() => setResultImage(null)}
                        className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-red-500 transition-transform hover:scale-110" 
                        title="Xóa"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center text-purple-600">
                  <div className="relative">
                      <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-75"></div>
                      <Sparkles size={64} className="relative z-10 mb-4 animate-bounce text-purple-600" />
                  </div>
                  <p className="text-xl font-bold mt-4">Đang xử lý điểm ảnh...</p>
                  <p className="text-sm opacity-70 mt-2">Đang tạo kiệt tác của bạn</p>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-8 max-w-md">
                  <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-inner">
                    <Wand2 size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Sẵn sàng sáng tạo</h3>
                  <p className="text-sm">
                    Tải ảnh tham khảo ở bên trái và mô tả ý tưởng của bạn. AI sẽ kết hợp chúng thành một bức ảnh thời trang ấn tượng.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};