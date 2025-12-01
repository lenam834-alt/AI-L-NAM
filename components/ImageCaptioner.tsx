import React, { useState } from 'react';
import { Type, Sparkles, Loader2, Download, RefreshCw, Banana } from 'lucide-react';
import { generateImageWithText } from '../services/geminiService';
import { UploadBox } from './UploadBox';
import { ImageAsset } from '../types';
import { fileToBase64, getMimeType } from '../utils';

// --- DATA LISTS ---

const FONTS = [
  // Serif
  { label: "Serif Cổ Điển (Times)", value: "Classic Serif font similar to Times New Roman" },
  { label: "Serif Thanh Lịch (Playfair)", value: "Elegant high-contrast Serif similar to Playfair Display" },
  { label: "Slab Hiện Đại (Roboto Slab)", value: "Modern Slab Serif similar to Roboto Slab" },
  { label: "Serif Máy Đánh Chữ (Courier)", value: "Typewriter style Serif similar to Courier Prime" },
  { label: "Serif Sang Trọng (Bodoni)", value: "Luxury fashion Serif similar to Bodoni" },
  { label: "Serif Đậm (Merriweather)", value: "Thick, bold Serif similar to Merriweather" },
  { label: "Serif Mềm Mại (Lora)", value: "Soft, readable Serif similar to Lora" },
  { label: "Serif Cổ Xưa (Garamond)", value: "Old-style Serif similar to Garamond" },
  // Sans Serif
  { label: "Sans Hiện Đại (Roboto)", value: "Clean Modern Sans-Serif similar to Roboto" },
  { label: "Sans Hình Học (Montserrat)", value: "Geometric Sans-Serif similar to Montserrat" },
  { label: "Sans Nhân Văn (Open Sans)", value: "Friendly Sans-Serif similar to Open Sans" },
  { label: "Sans Đậm Nổi Bật (Impact)", value: "Thick, impactful Sans-Serif similar to Impact" },
  { label: "Sans Mỏng Tối Giản (Lato)", value: "Thin, elegant Sans-Serif similar to Lato Light" },
  { label: "Sans Tròn (Quicksand)", value: "Rounded, soft Sans-Serif similar to Quicksand" },
  { label: "Sans Công Nghệ (Orbitron)", value: "Futuristic, squared Sans-Serif similar to Orbitron" },
  { label: "Sans Hẹp (Oswald)", value: "Tall, condensed Sans-Serif similar to Oswald" },
  // Handwriting / Script
  { label: "Chữ Ký Tay", value: "Elegant signature style script" },
  { label: "Cọ Vẽ (Pacifico)", value: "Fun brush script similar to Pacifico" },
  { label: "Thư Pháp (Great Vibes)", value: "Formal calligraphy similar to Great Vibes" },
  { label: "Viết Tay (Patrick Hand)", value: "Casual handwriting similar to Patrick Hand" },
  { label: "Bút Dạ (Marker)", value: "Thick marker pen style" },
  { label: "Phấn Bảng", value: "Chalk texture handwriting" },
  { label: "Graffiti Đường Phố", value: "Street art graffiti style" },
  { label: "Chữ Trẻ Em", value: "Child-like handwriting" },
  // Decorative
  { label: "Pixel Cổ Điển (8-bit)", value: "8-bit pixel art font" },
  { label: "Gothic / Cổ Điển", value: "Blackletter Gothic style" },
  { label: "Miền Viễn Tây", value: "Wild West Wanted poster style" },
  { label: "Kinh Dị / Chảy Máu", value: "Scary, dripping blood style" },
  { label: "Truyện Tranh", value: "Comic book bubble font" },
  { label: "Đèn Neon", value: "Neon tube shaped font" },
  { label: "Khuôn Phun (Stencil)", value: "Military stencil style" },
  { label: "Chữ Bong Bóng 3D", value: "Puffy 3D bubble letters" },
  // Vietnamese Friendly Specifics (Descriptors)
  { label: "Việt Nam Hiện Đại (Be Vietnam)", value: "Modern Vietnamese Sans-Serif (Be Vietnam Pro style)" },
  { label: "Truyền Thống Việt", value: "Traditional Vietnamese calligraphy style" },
  { label: "Việt Nam Bao Cấp (Retro)", value: "Retro 1980s Vietnam poster style" },
  { label: "Dân Gian Việt", value: "Folk art style typography" },
  { label: "Thiệp Cưới Sang Trọng", value: "Wedding invitation script" },
  { label: "Doanh Nghiệp Đậm", value: "Strong corporate branding font" },
  { label: "Nghệ Thuật Art Deco", value: "1920s Art Deco style" },
  { label: "Bụi Bặm / Xước", value: "Worn, distressed texture font" },
  { label: "Kỹ Thuật Số / Ma Trận", value: "Digital LED code style" },
  { label: "Thể Thao / Học Đường", value: "American college sports jersey font" },
  { label: "Rạp Chiếu Phim (Marquee)", value: "Cinema marquee lights font" },
  { label: "Thêu Thùa", value: "Stitched embroidery effect font" },
  { label: "Cắt Giấy", value: "Paper cutout ransom note style" },
  { label: "Màu Nước", value: "Watercolor painted brush font" },
  { label: "Nhạc Rock Metal", value: "Heavy metal band logo style" },
  { label: "Đơn Dòng Tối Giản (Code)", value: "Clean monospaced coding font" }
];

const STYLES = [
  // Lighting & Glow
  { label: "Neon Xanh Dương", value: "Glowing blue neon sign effect" },
  { label: "Neon Hồng", value: "Glowing hot pink neon sign effect" },
  { label: "Ánh Kim Vàng (Glow)", value: "Radiant golden halo glow" },
  { label: "Nhiễu Sóng Cyberpunk", value: "Digital glitch distortion effect" },
  { label: "Lửa Cháy", value: "Letters made of fire and flames" },
  { label: "Băng Giá", value: "Frozen ice texture with frost" },
  { label: "Tia Lửa Điện", value: "Surrounded by electric lightning sparks" },
  { label: "Bóng Đèn Sân Khấu", value: "Filled with small light bulbs like a Broadway sign" },
  // Materials
  { label: "Vàng Khối 3D", value: "Shiny solid gold 3D metal texture" },
  { label: "Mạ Crom / Bạc", value: "Reflective chrome silver metal" },
  { label: "Thép Xước", value: "Industrial brushed steel texture" },
  { label: "Kim Loại Gỉ Sét", value: "Old rusty metal texture" },
  { label: "Khắc Gỗ", value: "Carved into oak wood" },
  { label: "Đá Tảng", value: "Chiseled from gray stone" },
  { label: "Đá Cẩm Thạch", value: "White marble texture with gold veins" },
  { label: "Thủy Tinh / Trong Suốt", value: "Transparent glass 3D letters" },
  { label: "Nước / Chất Lỏng", value: "Formed from splashing water" },
  { label: "Chất Nhờn (Slime)", value: "Green dripping slime texture" },
  { label: "Socola Chảy", value: "Melting milk chocolate texture" },
  { label: "Bánh Quy", value: "Baked cookie texture" },
  { label: "Cỏ / Rêu", value: "Covered in green grass and moss" },
  { label: "Hoa Lá", value: "Made of blooming flowers" },
  { label: "Bong Bóng Bay", value: "Shiny foil balloon texture" },
  { label: "Mây / Khói", value: "Formed from white fluffy clouds" },
  // Artistic
  { label: "Phun Sơn Graffiti", value: "Spray painted graffiti on wall" },
  { label: "Phấn Trắng Bảng Đen", value: "White chalk dust on blackboard" },
  { label: "Phác Thảo Chì", value: "Hand drawn pencil sketch style" },
  { label: "Tranh Sơn Dầu", value: "Thick oil paint strokes" },
  { label: "Màu Nước Loang", value: "Watercolor paint bleeding into paper" },
  { label: "Gấp Giấy Origami", value: "Folded paper origami style" },
  { label: "Sticker Viền Trắng", value: "White outline sticker style" },
  { label: "Thêu Chỉ", value: "Stitched thread on fabric" },
  { label: "Tranh Ghép Gốm", value: "Colorful ceramic mosaic tiles" },
  { label: "Xếp Hình Lego", value: "Built from plastic toy bricks" },
  // Effects
  { label: "Khối 3D Nổi", value: "Deep 3D extrusion perspective" },
  { label: "Bóng Đổ Mềm", value: "Soft floating drop shadow" },
  { label: "Bóng Đổ Dài (Flat)", value: "Long diagonal flat shadow" },
  { label: "Chỉ Có Viền (Rỗng)", value: "Hollow letters with thick outline" },
  { label: "Cầu Vồng Gradient", value: "Rainbow color gradient fill" },
  { label: "Kim Tuyến Lấp Lánh", value: "Covered in gold and silver glitter" },
  { label: "Con Dấu Cổ", value: "Faded ink rubber stamp effect" },
  { label: "Phản Quang Hologram", value: "Iridescent holographic foil" },
  { label: "Lông Thú Mềm", value: "Soft colorful fur texture" },
  { label: "Kẹo Giáng Sinh", value: "Red and white striped candy texture" },
  { label: "Vũ Trụ Galaxy", value: "Filled with stars and nebula galaxy" },
  { label: "Mã Code Ma Trận", value: "Green falling code rain fill" },
  { label: "Retro Thập Niên 80", value: "80s sunset gradient and grid" },
  { label: "Đen Tối Giản (Matte)", value: "Solid matte black, clean" },
  { label: "Trắng Tối Giản (Matte)", value: "Solid matte white, clean" }
];

export const ImageCaptioner: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].value);
  const [uploadedImage, setUploadedImage] = useState<ImageAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    if (!uploadedImage || !inputText) return;
    setIsGenerating(true);
    setResultImage(null);

    try {
      const imageUrl = await generateImageWithText(inputText, selectedFont, selectedStyle, uploadedImage);
      setResultImage(imageUrl);
    } catch (e) {
      console.error(e);
      alert("Không thể xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `captioned-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* LEFT: Config Panel */}
      <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
               <Banana size={24} />
             </div>
             <div>
               <h3 className="font-bold text-gray-800 text-lg">Google Banana Text</h3>
               <p className="text-xs text-gray-500">Chèn chữ & icon minh họa vào ảnh</p>
             </div>
          </div>

          <div className="space-y-5">
            
            {/* Image Upload */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">1. Tải ảnh gốc lên</label>
               <UploadBox 
                 id="caption-upload" 
                 label="Tải ảnh cần chèn chữ" 
                 image={uploadedImage} 
                 onUpload={handleUpload} 
                 onRemove={() => setUploadedImage(null)}
                 heightClass="h-48"
               />
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">2. Nội dung chữ</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="VD: Sale 50%, Chúc Mừng Năm Mới, Coffee Time..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1">*AI sẽ tự động thêm icon phù hợp với nội dung này.</p>
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">3. Font chữ ({FONTS.length} kiểu)</label>
              <select 
                value={selectedFont} 
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none custom-scrollbar text-sm"
              >
                {FONTS.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">4. Phong cách hiệu ứng ({STYLES.length} loại)</label>
              <select 
                value={selectedStyle} 
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none custom-scrollbar text-sm"
              >
                {STYLES.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={(!inputText || !uploadedImage) || isGenerating}
              className="w-full py-4 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-all shadow-lg shadow-yellow-200/50 flex items-center justify-center mt-4"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : (
                <>
                  <Type className="mr-2" size={20} />
                  Chèn Chữ Ngay
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Result Panel */}
      <div className="lg:w-2/3 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden group min-h-[500px]">
        {resultImage ? (
           <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
              <img src={resultImage} alt="Captioned Image" className="max-w-full max-h-full object-contain shadow-2xl" />
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
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                 <Type size={40} className="text-gray-300" />
              </div>
              <p className="font-medium text-lg text-gray-500">Chưa có ảnh nào được tạo</p>
              <p className="text-sm mt-1">Tải ảnh và nhập nội dung để bắt đầu sáng tạo</p>
           </div>
        )}
      </div>
    </div>
  );
};