import React from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { FileText, Image, Download } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

// Utility function to safely render HTML content
const renderHTMLContent = (content: string) => {
  // First, process the entire content to handle bold and italic formatting
  let processedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Convert *text* to <em>
  
  // Split content into lines for better processing
  const lines = processedContent.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle headers
    if (line.match(/^### (.+)$/)) {
      // Close any open list first
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      processedLines.push(`<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">${line.replace(/^### /, '')}</h3>`);
    } else if (line.match(/^## (.+)$/)) {
      // Close any open list first
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      processedLines.push(`<h2 class="text-xl font-bold text-gray-900 mt-4 mb-2">${line.replace(/^## /, '')}</h2>`);
    } else if (line.match(/^# (.+)$/)) {
      // Close any open list first
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      processedLines.push(`<h1 class="text-2xl font-bold text-gray-900 mt-4 mb-3">${line.replace(/^## /, '')}</h1>`);
    } else if (line.match(/^- (.+)$/) || line.match(/^\* (.+)$/)) {
      // Handle list items (both - and * formats)
      inList = true;
      const listContent = line.replace(/^[-*] /, '');
      listItems.push(`<li class="ml-4">${listContent}</li>`);
    } else if (line.trim() === '') {
      // Close any open list first
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      processedLines.push('<br>');
    } else {
      // Close any open list first
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      
      // Handle regular text (bold and italic already processed)
      processedLines.push(line);
    }
  }
  
  // Close any remaining open list
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="list-disc ml-4 mb-2">${listItems.join('')}</ul>`);
  }
  
  // Join lines
  let htmlContent = processedLines.join('\n');
  
  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

// Component to render file attachments
const FileAttachments: React.FC<{ attachments: ChatMessageType['attachments'] }> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {attachment.type.startsWith('image/') && attachment.preview ? (
            <img 
              src={attachment.preview} 
              alt={attachment.name}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500">
              {attachment.type} • {(attachment.size / 1024).toFixed(1)} KB
            </p>
          </div>
          
          {attachment.url && (
            <a 
              href={attachment.url} 
              download={attachment.name}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // User message - Right side of 766px container
  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-3 md:mb-4">
        <div className="max-w-[85%] md:max-w-[45%] rounded-2xl px-3 md:px-4 py-2 md:py-3 bg-[#f4f4f4] text-gray-900">
          <div className="text-xs md:text-sm leading-relaxed">{message.content}</div>
          <FileAttachments attachments={message.attachments} />
        </div>
      </div>
    );
  }

  // AI message - Left side of 766px container
  return (
    <div className="flex justify-start mb-4 md:mb-6">
      <div className="max-w-[85%] md:max-w-[70%]">
        <div className="text-sm md:text-base leading-relaxed text-gray-900 text-left bg-white border border-gray-200 rounded-2xl px-3 md:px-4 py-2 md:py-3">
          {renderHTMLContent(message.content)}
          <FileAttachments attachments={message.attachments} />
        </div>
      </div>
    </div>
  );
};
