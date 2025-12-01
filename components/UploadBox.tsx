import React, { useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { ImageAsset } from '../types';

interface UploadBoxProps {
  id: string;
  label: string;
  image: ImageAsset | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  heightClass?: string;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ 
  id, label, image, onUpload, onRemove, heightClass = "aspect-[3/4]" 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`bg-white p-3 rounded-2xl border-2 border-dashed ${image ? 'border-pink-400' : 'border-pink-200'} hover:border-pink-400 transition-colors relative group`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500">{label}</span>
      </div>
      
      <div 
        className={`${heightClass} bg-pink-50 rounded-lg overflow-hidden relative flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-pink-100`}
        onClick={!image ? handleClick : undefined}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*"
          onChange={handleChange} 
          className="hidden"
        />
        
        {image ? (
          <>
            <img src={image.previewUrl} className="w-full h-full object-cover" alt="Upload preview" />
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white shadow-sm transition-transform hover:scale-110"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="text-center p-2 text-pink-300">
             <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
             <span className="text-[10px] font-medium uppercase tracking-wide">Click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};