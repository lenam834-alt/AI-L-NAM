import React from 'react';
import { 
  LayoutDashboard, 
  PenTool, Search, Bell, Menu, X, Shirt, Clapperboard, Megaphone,
  Package, Type
} from 'lucide-react';
import { ViewType, MenuItem } from '../types';

const MENU_ITEMS: MenuItem[] = [
  { id: ViewType.DASHBOARD, label: 'Tổng quan', icon: LayoutDashboard },
  { id: ViewType.PRODUCT_AD_MAKER, label: 'Ảnh Quảng Cáo (Banana)', icon: Package },
  { id: ViewType.IMAGE_CAPTIONER, label: 'Chèn Chữ Vào Ảnh', icon: Type },
  { id: ViewType.FACEBOOK_ADS, label: 'Viết Quảng Cáo FB', icon: Megaphone },
  { id: ViewType.CHANNEL_BUILDER, label: 'Xây Kênh Review', icon: Clapperboard },
  { id: ViewType.AI_FASHION, label: 'AI Fashion & VEO3', icon: Shirt },
  { id: ViewType.CAPTION_WRITER, label: 'Viết Caption & Trend', icon: PenTool },
];

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen }) => (
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-md">G</div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Nam Lê AI</span>
      </div>
      <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
    </div>
    <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id);
              setIsMobileOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={20} className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {item.label}
          </button>
        );
      })}
    </nav>
    <div className="shrink-0 p-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">NL</div>
        <div>
          <p className="text-sm font-bold text-gray-800">Nam Lê</p>
          <p className="text-xs text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Pro Member
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface HeaderProps {
  setIsMobileOpen: (open: boolean) => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ setIsMobileOpen, title }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
    <div className="flex items-center">
      <button onClick={() => setIsMobileOpen(true)} className="md:hidden mr-4 text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="hidden sm:flex relative group">
        <input 
          type="text" 
          placeholder="Tìm công cụ..." 
          className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus:bg-white"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
      </div>
      <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>
    </div>
  </header>
);