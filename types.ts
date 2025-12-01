import { LucideIcon } from 'lucide-react';

export enum ViewType {
  DASHBOARD = 'dashboard',
  CHANNEL_BUILDER = 'channel_builder',
  FACEBOOK_ADS = 'facebook_ads',
  AI_FASHION = 'ai_fashion',
  CAPTION_WRITER = 'caption_writer',
  PRODUCT_AD_MAKER = 'product_ad_maker',
  IMAGE_CAPTIONER = 'image_captioner',
}

export interface MenuItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

export interface GeneratedAd {
  hook: string[];
  body: string;
}

export interface ChannelPlanItem {
  day: string;
  format: string;
  hook: string;
  content: string;
  cta: string;
}

export interface ScriptStructure {
  part: string;
  desc: string;
}

export interface ScriptContent {
  title: string;
  structure: ScriptStructure[];
}

export interface ImageAsset {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export enum TabType {
  FASHION = 'fashion',
  PRODUCT = 'product'
}

export interface CarouselSlide {
  id: number;
  scene: string;
  visual: string;
  text: string;
  color: string;
}