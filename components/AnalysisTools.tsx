import React, { useState } from 'react';
import { Loader2, Clipboard, Download, Check, FileText } from 'lucide-react';

export const TikTokAnalysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setLoading(true);
    // Simulation of API call
    setTimeout(() => {
      setResult({
        views: '1,245,000',
        likes: '156,000',
        comments: '2,400',
        shares: '15,000',
        engagementRate: '14.2%',
        estimatedEarnings: '$120 - $350'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Dán link video TikTok</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@user/video/..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center transition-colors"
          >
            {loading ? 'Đang phân tích...' : 'Phân tích'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Kết quả tổng quan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <div className="text-gray-500 text-xs uppercase font-bold">Views</div>
                <div className="text-xl font-bold text-gray-900">{result.views}</div>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl text-center">
                <div className="text-pink-500 text-xs uppercase font-bold">Likes</div>
                <div className="text-xl font-bold text-pink-700">{result.likes}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <div className="text-blue-500 text-xs uppercase font-bold">Comments</div>
                <div className="text-xl font-bold text-blue-700">{result.comments}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <div className="text-green-500 text-xs uppercase font-bold">Shares</div>
                <div className="text-xl font-bold text-green-700">{result.shares}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Tỉ lệ tương tác (ER)</h4>
            <div className="text-3xl font-bold text-purple-600">{result.engagementRate}</div>
            <p className="text-xs text-gray-500 mt-1">Cao hơn 20% so với trung bình</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Ước tính doanh thu</h4>
            <div className="text-3xl font-bold text-green-600">{result.estimatedEarnings}</div>
            <p className="text-xs text-gray-500 mt-1">Dựa trên CPM trung bình</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoTranscriptExtractor: React.FC = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isCopied, setIsCopied] = useState(false);
  
    const handleExtract = () => {
      if (!url) return;
      setLoading(true);
      setTranscript('');
      setIsCopied(false);
  
      setTimeout(() => {
        setTranscript(`[00:01] Xin chào mọi người, hôm nay mình sẽ unbox món đồ siêu hot này nha!
  [00:05] Đây là chiếc máy ảnh lấy liền phiên bản giới hạn mà mình đã săn được.
  [00:10] Nhìn cái hộp thôi là thấy xịn xò rồi đúng không? Màu pastel cực yêu luôn.
  [00:15] Để mình mở ra cho mọi người xem bên trong có gì nhé.
  [00:20] Wow! Đi kèm còn có bộ sticker và dây đeo rất dễ thương.
  [00:25] Mọi người nhớ thả tim và follow để xem phần test máy nha! Bye bye!`);
        setLoading(false);
      }, 2000);
    };
  
    const handleCopy = () => {
      if (!transcript) return;
      navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };
  
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
             <FileText className="mr-2 text-red-500" size={20} /> Trích xuất nội dung Video (Transcript)
          </h3>
          <p className="text-sm text-gray-600 mb-4">Dán link video TikTok để lấy toàn bộ lời thoại.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ví dụ: https://www.tiktok.com/@user/video/..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
            <button
              onClick={handleExtract}
              disabled={loading || !url}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center min-w-[150px] transition-colors shadow-red-200 shadow-md"
            >
              {loading ? (
                <span className="flex items-center"><Loader2 className="animate-spin mr-2" size={18}/> Đang xử lý...</span>
              ) : (
                'Trích xuất ngay'
              )}
            </button>
          </div>
        </div>
  
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Nội dung trích xuất</h4>
            {transcript && (
              <div className="flex space-x-2">
                 <button 
                   onClick={handleCopy}
                   className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                 >
                   {isCopied ? <Check size={16} className="mr-1.5"/> : <Clipboard size={16} className="mr-1.5"/>}
                   {isCopied ? 'Đã sao chép' : 'Sao chép'}
                 </button>
                 <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                   <Download size={16} className="mr-1.5"/> Tải .txt
                 </button>
              </div>
            )}
          </div>
  
          <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-y-auto font-mono text-sm leading-relaxed text-gray-700">
            {loading ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <Loader2 size={32} className="animate-spin text-red-400" />
                  <p>AI đang nghe và chép lại lời thoại...</p>
               </div>
            ) : transcript ? (
               <div className="whitespace-pre-line">{transcript}</div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <FileText size={48} className="mb-4" />
                  <p>Văn bản sẽ hiển thị ở đây</p>
               </div>
            )}
          </div>
        </div>
      </div>
    );
};
