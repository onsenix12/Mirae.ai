'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileUploadZone } from './shared/FileUploadZone';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface SmartOnboardingChatProps {
  onComplete: () => void;
  onContextUpdate: (data: Partial<{
    yearLevel: 'year1' | 'year2' | 'year3';
    courseSelectionStatus: 'picked' | 'deciding' | 'reconsidering';
    currentFeeling: string;
  }>) => void;
  onKeywordsExtracted?: (keywords: string[]) => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  onSend: () => void;
}

export const SmartOnboardingChat: React.FC<SmartOnboardingChatProps> = ({
  onComplete,
  onContextUpdate,
  onKeywordsExtracted,
  onInputChange,
  inputValue,
  onSend,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "No one else can see what we talk about here. Not teachers, not parents, not friends. Just you and me.\n\nBefore we start, I'd love to know a little about where you're at right now. Cool if I ask a few quick questions?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [contextData, setContextData] = useState<{
    yearLevel?: 'year1' | 'year2' | 'year3';
    courseSelectionStatus?: 'picked' | 'deciding' | 'reconsidering';
    currentFeeling?: string;
  }>({});
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for send event
  useEffect(() => {
    const handleSend = async () => {
      if (!inputValue.trim() || isLoading) return;

      const userMessage = inputValue.trim();
      onInputChange('');

      // Add user message
      const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
      setMessages(newMessages);
      setIsLoading(true);
      setConversationCount(prev => prev + 1);
      let latestContext = contextData;

      try {
        // Call AI API
        const response = await fetch('/api/onboarding/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
            context: latestContext,
          }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const payload = await response.json();
        const assistantMessage = typeof payload.message === 'string' ? payload.message : '';
        if (payload.context) {
          const nextContext = { ...latestContext, ...payload.context };
          latestContext = nextContext;
          setContextData(nextContext);
          onContextUpdate(payload.context);
        }

        // Handle extracted keywords
        if (payload.keywords && Array.isArray(payload.keywords) && onKeywordsExtracted) {
          onKeywordsExtracted(payload.keywords);
        }

        if (assistantMessage) {
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        } else {
          setMessages([
            ...newMessages,
            {
              role: 'assistant',
              content: "I'm here. Want to share a bit more so I can guide you?",
            },
          ]);
        }

        const shouldComplete =
          !!latestContext.yearLevel &&
          !!latestContext.courseSelectionStatus &&
          (latestContext.courseSelectionStatus === 'picked' || !!latestContext.currentFeeling);

        if (shouldComplete && !hasCompleted && !showDocumentUpload) {
          setHasCompleted(true);
          // Show document upload prompt instead of completing immediately
          setTimeout(() => {
            setShowDocumentUpload(true);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: "One more thing—some students find it helpful to share things like:\n\n📎 Career.net results (커리어넷 검사 결과)\n📎 Interest/aptitude test results\n📎 Notes from school counseling\n📎 Project work or writing samples\n\nIf you have anything like that and want to share, I can help us talk through what you're seeing in them.\n\nBut if not, no worries—we can just keep chatting!"
            }]);
          }, 500);
        }
      } catch (error) {
        console.error('Chat error:', error);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: "Hmm, I'm having trouble connecting right now. Can you try that again?",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener('onboardingSmartSend', handleSend as EventListener);
    return () => window.removeEventListener('onboardingSmartSend', handleSend as EventListener);
  }, [
    inputValue,
    messages,
    isLoading,
    conversationCount,
    contextData,
    hasCompleted,
    showDocumentUpload,
    onInputChange,
    onComplete,
    onContextUpdate,
  ]);

  return (
    <>
      {messages.map((message, idx) => (
        <div
          key={idx}
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-md ${
              message.role === 'assistant'
                ? 'bg-white/95 border-2 border-[#9BCBFF]/40 text-slate-800 rounded-tl-sm'
                : 'bg-gradient-to-br from-[#E5E0FF] to-[#F4E4FF] border-2 border-[#C7B9FF]/60 text-slate-800 rounded-tr-sm'
            }`}
          >
            {message.role === 'assistant' && (
              <p className="text-xs font-semibold text-[#9BCBFF] mb-1">Mirae</p>
            )}
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-md bg-white/95 border-2 border-[#9BCBFF]/40 text-slate-800 rounded-tl-sm">
            <p className="text-xs font-semibold text-[#9BCBFF] mb-1">Mirae</p>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#9BCBFF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#9BCBFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#9BCBFF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Options */}
      {showDocumentUpload && !showUploadUI && (
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => setShowUploadUI(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-br from-[#E5E0FF] to-[#F4E4FF] border-2 border-[#C7B9FF]/60 text-slate-800 font-semibold hover:shadow-lg transition"
          >
            📤 Upload something
          </button>
          <button
            onClick={() => {
              setShowDocumentUpload(false);
              onComplete();
            }}
            className="px-6 py-3 rounded-full bg-white/70 border-2 border-slate-300 text-slate-700 font-semibold hover:bg-white/90 transition"
          >
            Skip for now
          </button>
        </div>
      )}

      {/* File Upload UI */}
      {showUploadUI && (
        <div className="mt-4 space-y-4">
          <div className="bg-white/95 rounded-2xl border-2 border-[#9BCBFF]/40 p-6">
            <FileUploadZone
              onFilesSelected={setUploadedFiles}
              maxFiles={6}
              maxFileSize={5 * 1024 * 1024}
              acceptedTypes={['image/png', 'image/jpeg', 'application/pdf']}
            />

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded files ({uploadedFiles.length}/6):
                </p>
                <ul className="space-y-1">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📄</span>
                      <span>{file.name}</span>
                      <span className="text-xs text-gray-400">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                if (uploadedFiles.length > 0) {
                  // Files uploaded - could process them here
                  setShowUploadUI(false);
                  setShowDocumentUpload(false);
                  onComplete();
                }
              }}
              disabled={uploadedFiles.length === 0}
              className="px-6 py-3 rounded-full bg-gradient-to-br from-[#E5E0FF] to-[#F4E4FF] border-2 border-[#C7B9FF]/60 text-slate-800 font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Done uploading
            </button>
            <button
              onClick={() => {
                setShowUploadUI(false);
                setShowDocumentUpload(false);
                onComplete();
              }}
              className="px-6 py-3 rounded-full bg-white/70 border-2 border-slate-300 text-slate-700 font-semibold hover:bg-white/90 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );
};
