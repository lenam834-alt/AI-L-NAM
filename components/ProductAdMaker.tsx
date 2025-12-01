import React, { useState } from 'react';
import { Package, Sparkles, Loader2, Download, RefreshCw, Banana } from 'lucide-react';
import { generateProductAdImage } from '../services/geminiService';
import { UploadBox } from './UploadBox';
import { ImageAsset } from '../types';
import { fileToBase64, getMimeType } from '../utils';

const SETTINGS = [
  { label: "Studio: Tối giản (Minimalist Pastel)", value: "Studio minimalist, solid pastel color background, clean composition" },
  { label: "Studio: Nền trắng thương mại (E-commerce)", value: "Pure white studio background, professional e-commerce product photography" },
  { label: "Studio: Đen sang trọng (Luxury Black)", value: "Dark black luxury studio background, premium look" },
  { label: "Chất liệu: Đá cẩm thạch trắng (White Marble)", value: "On a white marble podium, elegant texture" },
  { label: "Chất liệu: Đá Granite đen (Dark Granite)", value: "On a dark textured granite surface, strong presence" },
  { label: "Chất liệu: Bàn gỗ mộc (Wooden Table)", value: "On a rustic wooden table, natural texture" },
  { label: "Chất liệu: Vải lụa mềm (Silk Fabric)", value: "Resting on flowing silk fabric, elegant folds" },
  { label: "Chất liệu: Mặt nước gợn sóng (Water Ripples)", value: "Sitting in shallow water with gentle ripples, fresh look" },
  { label: "Chất liệu: Bãi cát vàng (Beach Sand)", value: "On golden beach sand, tropical vibe" },
  { label: "Chất liệu: Đá rêu phong (Mossy Rock)", value: "On a rock covered with green moss, nature vibe" },
  { label: "Thiên nhiên: Lá nhiệt đới (Tropical Leaves)", value: "Surrounded by fresh green tropical monstera leaves" },
  { label: "Thiên nhiên: Cánh đồng hoa (Flower Field)", value: "In a blooming flower field, soft foreground" },
  { label: "Thiên nhiên: Sàn rừng (Forest Floor)", value: "On the forest floor with pinecones and leaves" },
  { label: "Thiên nhiên: Bầu trời xanh (Blue Sky)", value: "Low angle shot against a clear blue sky with fluffy clouds" },
  { label: "Thiên nhiên: Hoàng hôn (Sunset Horizon)", value: "Against a warm sunset horizon, golden backlight" },
  { label: "Đời sống: Bếp hiện đại (Modern Kitchen)", value: "On a kitchen counter, modern interior background" },
  { label: "Đời sống: Phòng ngủ ấm cúng (Cozy Bedroom)", value: "On a bedside table, cozy bedroom background with soft linens" },
  { label: "Đời sống: Bàn trang điểm (Vanity)", value: "On a makeup vanity table with mirror reflection" },
  { label: "Đời sống: Bàn làm việc (Office Desk)", value: "On a professional office desk with laptop and notebook" },
  { label: "Đời sống: Quán Cà phê (Cafe)", value: "On a cafe table, blurred coffee shop background" },
  { label: "Trừu tượng: Bục hình học (Geometric Podiums)", value: "On abstract 3D geometric podiums, modern art style" },
  { label: "Trừu tượng: Lơ lửng không trọng lực (Zero Gravity)", value: "Floating in mid-air, zero gravity, floating elements around" },
  { label: "Trừu tượng: Thành phố Neon (Cyberpunk City)", value: "Neon cyberpunk city background, futuristic lights" },
  { label: "Trừu tượng: Đèn Bokeh (Bokeh Lights)", value: "Background of beautiful defocused bokeh lights" },
  { label: "Trừu tượng: Khúc xạ kính (Glass Refraction)", value: "Through glass prisms, light refraction effects" },
  { label: "Mùa: Giáng sinh (Christmas Decor)", value: "Surrounded by Christmas decorations, pine branches, lights" },
  { label: "Mùa: Tết Nguyên Đán (Lunar New Year)", value: "Red and gold theme, Lunar New Year decorations" },
  { label: "Mùa: Hồ bơi mùa hè (Summer Poolside)", value: "Next to a sparkling blue swimming pool, summer sunlight" },
  { label: "Mùa: Lá thu vàng (Autumn Leaves)", value: "Surrounded by orange and yellow autumn leaves" },
  { label: "Nghệ thuật: Pop Art rực rỡ (Colorful)", value: "Vibrant pop art background, contrasting colors" },
];

const STYLES = [
  { label: "Điện ảnh (Cinematic)", value: "Cinematic Lighting, 4k, Photorealistic, movie scene look" },
  { label: "Sáng & Trong trẻo (Bright & Airy)", value: "Softbox lighting, bright, airy, clean aesthetic" },
  { label: "Tương phản cao (Moody/Dramatic)", value: "Dramatic shadows, moody lighting, high contrast" },
  { label: "Ánh sáng phòng thu (Studio Strobe)", value: "Professional studio strobe lighting, sharp details" },
  { label: "Ánh sáng tự nhiên (Natural Sunlight)", value: "Natural sunlight, window light, organic feel" },
  { label: "Giờ vàng (Golden Hour)", value: "Golden hour warm sunlight, soft glow" },
  { label: "Giờ xanh (Blue Hour)", value: "Blue hour twilight lighting, cool tones" },
  { label: "Ánh sáng Neon (Neon Glow)", value: "Neon colored gel lighting, vibrant pink and blue" },
  { label: "Viền sáng (Rim Lighting)", value: "Strong rim lighting, backlit silhouette effect" },
  { label: "Mơ màng (Soft Focus/Dreamy)", value: "Soft focus, ethereal, dreamy atmosphere" },
  { label: "Bóng đổ cứng (Hard Light)", value: "Hard light, strong defined shadows, summer noon look" },
  { label: "Cận cảnh chi tiết (Macro)", value: "Macro photography, extreme close-up, shallow depth of field" },
  { label: "Màu phim (Vintage Film)", value: "Vintage film grain, retro color grading" },
  { label: "Trắng đen (Black & White)", value: "Black and white photography, high contrast monochrome" },
  { label: "Tương lai (Cyberpunk)", value: "Futuristic cyberpunk style, metallic reflections" },
  { label: "Tông màu phấn (Pastel Tones)", value: "Soft pastel color palette, gentle look" },
  { label: "Rực rỡ (Vibrant/Saturated)", value: "High saturation, vibrant colors, punchy look" },
  { label: "Màu lì (Matte Finish)", value: "Matte finish, low contrast, flat look" },
  { label: "Bóng bẩy (Luxury/Glossy)", value: "High gloss, luxury magazine style, shiny reflections" },
  { label: "Sạch sẽ (Minimalist/Clean)", value: "Minimalist, clean lines, uncluttered" },
];

export const ProductAdMaker: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [setting, setSetting] = useState(SETTINGS[0].value);
  const [style, setStyle] = useState(STYLES[0].value);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<ImageAsset | null>(null);

  const handleUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);
      setUploadedImage({
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
    if (!productName && !uploadedImage) return;
    setIsGenerating(true);
    setResultImage(null);

    try {
      // Pass the uploaded image (if any) to the service
      const imageUrl = await generateProductAdImage(productName, setting, style, uploadedImage || undefined);
      setResultImage(imageUrl);
    } catch (e) {
      console.error(e);
      alert("Không thể tạo ảnh. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `product-ad-banana-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* Input Panel */}
      <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
               <Banana size={24} />
             </div>
             <div>
               <h3 className="font-bold text-gray-800 text-lg">Google Banana</h3>
               <p className="text-xs text-gray-500">Tạo ảnh quảng cáo sản phẩm siêu tốc</p>
             </div>
          </div>

          <div className="space-y-4">
            
            {/* Image Upload Section */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh sản phẩm gốc (Tùy chọn)</label>
               <UploadBox 
                 id="product-upload" 
                 label="Tải ảnh sản phẩm lên" 
                 image={uploadedImage} 
                 onUpload={handleUpload} 
                 onRemove={() => setUploadedImage(null)}
                 heightClass="h-40"
               />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm / Mô tả</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="VD: Chai nước hoa Chanel hồng..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bối cảnh (Background)</label>
              <select 
                value={setting} 
                onChange={(e) => setSetting(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none custom-scrollbar"
              >
                {SETTINGS.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ánh sáng & Phong cách</label>
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none custom-scrollbar"
              >
                {STYLES.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={(!productName && !uploadedImage) || isGenerating}
              className="w-full py-4 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-lg shadow-yellow-200/50 flex items-center justify-center mt-4"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Tạo Ảnh Ngay
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
           <strong>Mẹo:</strong> Tải ảnh sản phẩm lên để AI giữ nguyên chi tiết sản phẩm và chỉ thay đổi nền xung quanh.
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:w-2/3 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden group min-h-[500px]">
        {resultImage ? (
           <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
              <img src={resultImage} alt="Generated Ad" className="max-w-full max-h-full object-contain shadow-2xl" />
              <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                   onClick={handleGenerate}
                   className="p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white text-gray-700 shadow-lg transition-transform hover:scale-105"
                   title="Tạo lại"
                 >
                   <RefreshCw size={20} />
                 </button>
                 <button 
                   onClick={handleDownload}
                   className="p-3 bg-yellow-400 rounded-full hover:bg-yellow-300 text-yellow-900 shadow-lg transition-transform hover:scale-105"
                   title="Tải ảnh"
                 >
                   <Download size={20} />
                 </button>
              </div>
           </div>
        ) : (
           <div className="text-center text-gray-400 p-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <Package size={40} className="text-gray-300" />
              </div>
              <p className="font-medium text-lg text-gray-500">Chưa có ảnh nào được tạo</p>
              <p className="text-sm mt-1">Tải ảnh sản phẩm hoặc nhập tên để bắt đầu</p>
           </div>
        )}
      </div>
    </div>
  );
};
