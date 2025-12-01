import React from 'react';
import { 
  Clapperboard, Megaphone, Shirt, 
  PenTool, TrendingUp, Package, Type
} from 'lucide-react';
import { ViewType, MenuItem } from '../types';

const MENU_ITEMS_QUICK_ACCESS: MenuItem[] = [
  { id: ViewType.PRODUCT_AD_MAKER, label: 'Tạo Ảnh Quảng Cáo', icon: Package },
  { id: ViewType.IMAGE_CAPTIONER, label: 'Chèn Chữ Vào Ảnh', icon: Type },
  { id: ViewType.FACEBOOK_ADS, label: 'Viết Quảng Cáo', icon: Megaphone },
  { id: ViewType.CHANNEL_BUILDER, label: 'Xây Kênh', icon: Clapperboard },
  { id: ViewType.AI_FASHION, label: 'AI Fashion', icon: Shirt },
];

export const DashboardView: React.FC<{ setCurrentView: (view: ViewType) => void }> = ({ setCurrentView }) => (
  <div className="space-y-6 animate-fade-in">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <h3 className="text-lg font-medium opacity-90">Tổng Lượt Xem (Tháng)</h3>
        <p className="text-4xl font-bold mt-2 tracking-tight">1.2M</p>
        <div className="flex items-center mt-4 text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
          <TrendingUp size={16} className="mr-1" />
          <span>+12.5% tăng trưởng</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold text-gray-800">Video Viral Nhất</h3>
        <p className="text-xl font-semibold mt-2 text-gray-900 truncate">Review Camera Instax Mini...</p>
        <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: '85%' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right font-medium">850k views • 45k likes</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold text-gray-800">Hashtag Thịnh Hành</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['#bienhinh', '#reviewcongnghe', '#thuthuat', '#unboxing', '#goclamdep'].map(tag => (
            <span key={tag} className="inline-block px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Quick Access */}
    <div>
        <h3 className="text-lg font-bold text-gray-800 mt-4 mb-4">Truy cập nhanh công cụ</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {MENU_ITEMS_QUICK_ACCESS.map((item) => {
            const Icon = item.icon;
            return (
            <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all group duration-300"
            >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-blue-600 transition-colors">{item.label}</span>
            </button>
            )
        })}
        </div>
    </div>
  </div>
);