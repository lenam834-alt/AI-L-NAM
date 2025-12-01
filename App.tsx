import React, { useState } from 'react';
import { ViewType } from './types';
import { Sidebar, Header } from './components/Layout';
import { DashboardView } from './components/Dashboard';
import { FacebookAdCreator } from './components/FacebookAds';
import { ChannelScriptBuilder } from './components/ChannelBuilder';
import { CaptionWriter } from './components/CaptionWriter';
import { AIFashionStudio } from './components/AIFashion';
import { ProductAdMaker } from './components/ProductAdMaker';
import { ImageCaptioner } from './components/ImageCaptioner';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case ViewType.DASHBOARD: return <DashboardView setCurrentView={setCurrentView} />;
      case ViewType.FACEBOOK_ADS: return <FacebookAdCreator />;
      case ViewType.PRODUCT_AD_MAKER: return <ProductAdMaker />;
      case ViewType.IMAGE_CAPTIONER: return <ImageCaptioner />;
      case ViewType.CHANNEL_BUILDER: return <ChannelScriptBuilder />;
      case ViewType.AI_FASHION: return <AIFashionStudio />;
      case ViewType.CAPTION_WRITER: return <CaptionWriter />;
      default: return <DashboardView setCurrentView={setCurrentView} />;
    }
  };

  const getTitle = () => {
    switch(currentView) {
        case ViewType.DASHBOARD: return 'Tổng quan';
        case ViewType.FACEBOOK_ADS: return 'Viết Quảng Cáo FB';
        case ViewType.PRODUCT_AD_MAKER: return 'Tạo Ảnh Quảng Cáo (Banana)';
        case ViewType.IMAGE_CAPTIONER: return 'Chèn Chữ Vào Ảnh (Banana)';
        case ViewType.CHANNEL_BUILDER: return 'Xây Kênh Review';
        case ViewType.AI_FASHION: return 'AI Fashion & VEO3';
        case ViewType.CAPTION_WRITER: return 'Viết Caption & Trend';
        default: return 'Nam Lê AI';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header setIsMobileOpen={setIsMobileOpen} title={getTitle()} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </div>
  );
}