import React, { useState } from 'react';
import { TrendingUp, Check } from 'lucide-react';

export const MiniGameCreator: React.FC = () => {
    const [gameType, setGameType] = useState('king');
  
    const games = [
      { id: 'king', label: 'Vua Tiếng Việt' },
      { id: 'catch', label: 'Đuổi hình bắt chữ' },
    ];
  
    const renderGamePreview = () => {
      switch (gameType) {
        case 'king':
          return (
            <div className="w-full max-w-md mx-auto animate-fade-in">
             <div className="bg-purple-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 via-purple-900 to-black"></div>
                <h3 className="text-yellow-400 text-center font-bold text-xl mb-6 uppercase tracking-wider relative z-10 drop-shadow-md">Sắp xếp từ</h3>
                
                {/* Scrambled Letters */}
                <div className="flex justify-center flex-wrap gap-3 mb-8 relative z-10">
                  {['P', 'H', 'O', 'N', 'G', 'C', 'Ả', 'N', 'H'].sort(() => Math.random() - 0.5).map((char, idx) => (
                    <div key={idx} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center text-purple-900 font-bold text-xl sm:text-2xl shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer border-b-4 border-gray-300">
                      {char}
                    </div>
                  ))}
                </div>

                {/* Answer Slots */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-8 relative z-10">
                   {[...Array(9)].map((_, i) => (
                     <div key={i} className="w-8 h-10 sm:w-10 sm:h-12 bg-white/10 border-2 border-white/30 rounded flex items-center justify-center"></div>
                   ))}
                </div>

                <div className="text-center relative z-10">
                   <button className="bg-yellow-400 text-purple-900 font-bold py-2 px-8 rounded-full shadow-lg hover:bg-yellow-300 transition-colors uppercase tracking-widest">
                     Kiểm tra
                   </button>
                </div>
             </div>
          </div>
          );
        case 'catch':
          return (
             <div className="w-full max-w-md mx-auto animate-fade-in">
             <div className="bg-blue-500 rounded-2xl p-6 shadow-2xl border-4 border-white relative overflow-hidden">
                <div className="bg-white rounded-xl h-48 flex items-center justify-center mb-6 overflow-hidden shadow-inner relative">
                    <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                   <div className="flex items-center space-x-4 text-6xl relative z-10">
                      <span className="drop-shadow-sm">🌧️</span>
                      <span className="text-gray-400 font-bold text-4xl">+</span>
                      <span className="drop-shadow-sm">🧥</span>
                   </div>
                </div>

                {/* Answer Inputs */}
                <div className="flex justify-center gap-2 mb-6">
                   {['Á', 'O', 'M', 'Ư', 'A'].map((char, i) => (
                     <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-700 rounded border-2 border-blue-300 flex items-center justify-center text-white font-bold text-xl shadow-md">
                       {i < 2 ? char : ''} 
                     </div>
                   ))}
                </div>

                {/* Keyboard / Options */}
                <div className="grid grid-cols-5 gap-2">
                   {['A', 'O', 'B', 'M', 'Ư', 'C', 'D', 'E', 'A', 'H'].map((char, i) => (
                      <button key={i} className="bg-white rounded p-2 font-bold text-blue-600 shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors">
                        {char}
                      </button>
                   ))}
                </div>
             </div>
          </div>
          );
        default: return null;
      }
    };
  
    return (
      <div className="flex flex-col h-full space-y-6 animate-fade-in">
        <div className="flex space-x-2 bg-white p-2 rounded-xl border border-gray-200 w-fit shadow-sm">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setGameType(game.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gameType === game.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {game.label}
            </button>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 h-fit">
            <h3 className="font-semibold text-gray-800 text-lg">Cấu hình: {games.find(g => g.id === gameType)?.label}</h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Tiêu đề Game</label>
              <input type="text" defaultValue={gameType === 'king' ? "Vua Tiếng Việt" : "Đuổi Hình Bắt Chữ"} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>

            {gameType === 'king' && (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Bộ câu hỏi (Từ khóa | Đáp án)</label>
                    <textarea 
                        defaultValue="yeunuoc | YEUNUOC&#10;phongcanh | PHONGCANH" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm h-32 font-mono bg-gray-50 focus:bg-white transition-colors outline-none focus:border-blue-500" 
                        placeholder="nhap | NHAP"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Mỗi dòng một cặp từ khóa và đáp án.</p>
                </div>
            )}

            {gameType === 'catch' && (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Bộ câu hỏi (Icon/Ảnh | Đáp án)</label>
                    <textarea 
                        defaultValue="cloud_coat | AOMUA&#10;horse_chess | MACO" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm h-32 font-mono bg-gray-50 focus:bg-white transition-colors outline-none focus:border-blue-500" 
                    />
                     <p className="text-[10px] text-gray-400 mt-1">Nhập mã icon hoặc link ảnh.</p>
                </div>
            )}

            <div className="pt-2">
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-blue-200 shadow-lg transition-all active:scale-95 flex items-center justify-center">
                <Check size={18} className="mr-2" /> Lưu & Xuất bản
                </button>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center p-8 relative overflow-hidden min-h-[400px]">
             <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border text-gray-400 z-0">PREVIEW</div>
             {renderGamePreview()}
          </div>
        </div>
      </div>
    );
};

const MOCK_HOT_PRODUCTS = [
    { id: 1, name: 'Kẹp tóc hoa sứ', price: '1.000đ', sold: '54k', trend: '+120%', image: '🌸' },
    { id: 2, name: 'Ốp lưng trong suốt', price: '9.000đ', sold: '32k', trend: '+85%', image: '📱' },
    { id: 3, name: 'Tất vớ cổ cao', price: '5.000đ', sold: '120k', trend: '+200%', image: '🧦' },
    { id: 4, name: 'Dây buộc tóc nơ', price: '1.000đ', sold: '45k', trend: '+60%', image: '🎀' },
    { id: 5, name: 'Sticker cute', price: '2.000đ', sold: '89k', trend: '+150%', image: '🏷️' },
    { id: 6, name: 'Móc khóa len', price: '8.000đ', sold: '15k', trend: '+40%', image: '🧸' },
];

export const HotProducts: React.FC = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex space-x-2">
             <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500">
               <option>Tất cả danh mục</option>
               <option>Thời trang</option>
               <option>Gia dụng</option>
               <option>Công nghệ</option>
             </select>
             <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500">
               <option>Giá dưới 1k</option>
               <option>Giá dưới 9k</option>
               <option>Giá dưới 99k</option>
             </select>
          </div>
          <button className="text-blue-600 font-medium text-sm hover:underline">Xuất Excel</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOCK_HOT_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
              <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-3 group-hover:bg-blue-50 transition-colors">
                {product.image}
              </div>
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-red-500 font-bold text-sm">{product.price}</span>
                <span className="text-[10px] text-gray-500">Đã bán {product.sold}</span>
              </div>
              <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center bg-green-50 w-fit px-1.5 py-0.5 rounded">
                <TrendingUp size={10} className="mr-1" />
                {product.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};