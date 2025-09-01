import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, SendHorizontal, X, FileText, Image, Paperclip, AudioLines } from 'lucide-react';
import './chat-glowing-input.css';

interface ChatGlowingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFileUpload?: (files: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

const ChatGlowingInput: React.FC<ChatGlowingInputProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onFileUpload,
  isLoading = false,
  placeholder = "Ask anything about your brand..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !onFileUpload) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    onFileUpload(Array.from(files));
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    
    // Also notify parent component about file removal
    if (onFileUpload) {
      const remainingFiles = uploadedFiles.filter(f => f.id !== fileId).map(f => f.file);
      onFileUpload(remainingFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="chat-glowing-container relative z-20 w-full max-w-[320px] md:max-w-none mx-auto md:mx-0 p-1 rounded-[2.5rem] chat-glow">
      <div className="relative flex flex-col w-full min-h-[102px]">
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="relative z-5 w-full bg-transparent text-gray-900 pl-8 pr-4 pt-5 pb-16 border-none outline-none focus:ring-0 placeholder-gray-500 placeholder-italic text-left text-sm md:text-base rounded-[2.5rem] resize-none overflow-hidden"
          style={{
            minHeight: '102px',
            height: 'auto',
            lineHeight: '1.5',
            maxWidth: '100%'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const newHeight = Math.max(102, target.scrollHeight);
            target.style.height = newHeight + 'px';
            
            // Update container height
            const container = target.closest('.chat-glowing-container') as HTMLElement;
            if (container) {
              container.style.height = (newHeight + 8) + 'px';
            }
          }}
          required
        />

        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <div className="absolute top-16 left-20 md:left-24 right-2 md:right-4 z-10">
            <div className="flex flex-wrap gap-2 md:gap-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  {file.preview ? (
                    <div className="relative">
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      {/* Cancel icon - always visible on mobile, hover on desktop */}
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Remove button clicked for file:', file.id, file.file.name);
                          removeFile(file.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 md:opacity-0 md:group-hover:opacity-100"
                        title="Remove file"
                      >
                        <X className="w-2.5 h-2.5 md:w-3 md:w-3" fill="currentColor" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center shadow-sm">
                        <FileText className="w-7 h-7 md:w-8 md:h-8 text-gray-500" fill="currentColor" />
                      </div>
                      {/* Cancel icon for non-image files */}
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Remove button clicked for file:', file.id, file.file.name);
                          removeFile(file.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 md:opacity-0 md:group-hover:opacity-100"
                        title="Remove file"
                      >
                        <X className="w-2.5 h-2.5 md:w-3 md:w-3" fill="currentColor" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drag & Drop Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-yellow-500/20 border-2 border-dashed border-yellow-500 rounded-[2.5rem] flex items-center justify-center z-30">
            <div className="text-center text-yellow-700">
              <Paperclip className="w-8 h-8 mx-auto mb-2" fill="currentColor" />
              <p className="text-sm font-medium">Drop files here</p>
            </div>
          </div>
        )}

        {/* Bottom Icons Container */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10">
          {/* Plus Icon - Left side */}
          <button 
            type="button" 
            className="p-3 rounded-full text-yellow-500 hover:bg-yellow-500/20 transition-all duration-300 hover:scale-110 touch-manipulation"
            onClick={openFileDialog}
            title="Upload files or images"
          >
            <Plus className="h-6 w-6" fill="currentColor" />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Right-side Dynamic Button */}
          <div className="flex items-center">
            {value.trim() || uploadedFiles.length > 0 ? (
              /* Send Button with AI text - when user is typing or has files */
              <button 
                type="submit" 
                disabled={isLoading}
                className="chat-send-button flex items-center gap-2 px-4 py-3 rounded-full text-black font-semibold bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 hover:scale-105 text-sm cursor-pointer touch-manipulation overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="ai-text whitespace-nowrap">AI</span>
                <SendHorizontal className="h-4 w-4" fill="currentColor" />
              </button>
            ) : (
              /* Microphone Button - when no text or files */
              <button 
                type="button" 
                className="chat-mic-button p-3 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
                style={{ backgroundColor: '#eab308' }}
              >
                <AudioLines className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drag & Drop Event Handlers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />

      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
        AI can make mistakes. Check important info.
      </div>
    </form>
  );
};

export default ChatGlowingInput;
