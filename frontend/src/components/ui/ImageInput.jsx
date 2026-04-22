import { useState, useRef } from 'react';
import { Upload, Link } from 'lucide-react';
import { uploadService } from '@/services/modules';
import toast from 'react-hot-toast';

const ImageInput = ({ label, value, onChange, compact = false }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('url');
  const BACKEND = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003';

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Use Cloudinary for new uploads
      const res = await uploadService.uploadImageCloudinary(file);
      // Cloudinary returns a full secure_url
      onChange(res.url || res.data?.url);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Cloudinary upload failed. Falling back to local preview.');
      onChange(URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = value?.startsWith('http') 
    ? value 
    : (value?.startsWith('/uploads/') ? BACKEND + value : value);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
        <div className="flex rounded-md overflow-hidden border border-gray-700 text-[10px]">
          <button type="button" onClick={() => setMode('url')}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 transition-colors ${mode === 'url' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>
            <Link size={9} /> URL
          </button>
          <button type="button" onClick={() => setMode('file')}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 transition-colors ${mode === 'file' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>
            <Upload size={9} /> File
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or leave blank"
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 text-xs px-2 py-1.5
            focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder-gray-600 transition-all" />
      ) : (
        <div onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-1.5 w-full rounded-md border border-dashed border-gray-600
            hover:border-primary-500 bg-gray-800/50 text-xs text-gray-500 px-2 py-2 cursor-pointer transition-all hover:text-primary-400 font-medium">
          {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={11} /> Choose image</>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      {value && !compact && (
        <div className="relative mt-1 group">
          <img src={previewUrl} alt="preview" className="h-24 w-full object-cover rounded-md border border-gray-700 transition-all group-hover:opacity-90"
            onError={(e) => (e.target.style.display = 'none')} />
        </div>
      )}
      {value && compact && (
        <img src={previewUrl} alt="preview" className="h-8 w-12 object-cover rounded border border-gray-700 mt-0.5"
          onError={(e) => (e.target.style.display = 'none')} />
      )}
    </div>
  );
};

export default ImageInput;
