"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Send, MessageSquare, Sparkles, FileText } from "lucide-react";
import { ResumeData } from "@/lib/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { generateAIResume } from "@/lib/api/resumes";

interface OutputPanelProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  loading: boolean;
  aiGeneratedHtml: string | null;
  setAiGeneratedHtml: (html: string | null) => void;
  latexCode: string | null;
  setLatexCode: (code: string | null) => void;
  selectedResumeId?: string | null;
  onAiUpdate?: () => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function OutputPanel({
 aiGeneratedHtml, setAiGeneratedHtml,
  latexCode, setLatexCode, selectedResumeId, onAiUpdate
}: OutputPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hi! I'm your AI Resume Assistant. How can I help you refine your resume today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'latex'>('chat');

  // Auto-switch to latex mode when new latex code arrives
  useEffect(() => {
    if (latexCode) {
      setViewMode('latex');
    }
  }, [latexCode]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Update preview URL when HTML changes
  useEffect(() => {
    if (aiGeneratedHtml) {
      const blob = new Blob([aiGeneratedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
    }
  }, [aiGeneratedHtml]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || processing) return;

    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Please sign in to use the AI assistant.");
      return;
    }

    if (!selectedResumeId && !activeResumeId) {
      toast.warning("Please upload a resume first to use the AI assistant.");
      return;
    }

    const userMsgText = inputMessage;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userMsgText,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setProcessing(true);

    try {
      const payload = {
        email: email,
        prompt: userMsgText,
        resume_id: selectedResumeId || activeResumeId
      };

      const response = await generateAIResume(payload);

      if (response.latex_code) {
        setLatexCode(response.latex_code);
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.message || "I've updated your resume.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);

      if (response.resume_id) {
        setActiveResumeId(response.resume_id);
      }

      if (response.updated_content) {
        setAiGeneratedHtml(response.updated_content);
        if (onAiUpdate) onAiUpdate();
      }

      toast.success("AI updated your resume!");

    } catch (error: any) {
      console.error("AI Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
      toast.error("Failed to process AI request.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    toast.info("Preparing download...");
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header with View Toggle */}
      <CardHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between w-full">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('chat')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              AI Chat
            </button>
            <button
              disabled={!latexCode}
              onClick={() => setViewMode('latex')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'latex' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                } ${!latexCode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FileText className="h-3.5 w-3.5" />
              LaTeX Code
            </button>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm" className="h-9 rounded-xl px-4">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardHeader>

      {/* Main Content Area */}
      <CardContent className="flex-1 flex flex-col p-0 bg-white overflow-hidden">
        {viewMode === 'latex' && latexCode ? (
          <div className="h-full flex flex-col bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
              <span className="text-xs font-bold text-gray-400 font-mono">latex_source.tex</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(latexCode);
                  toast.success("LaTeX copied!");
                }}
                className="h-7 text-[10px] text-gray-300 hover:text-white"
              >
                Copy All
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 font-mono text-[13px] leading-relaxed text-gray-300 whitespace-pre">
                <code>{latexCode}</code>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="h-full flex flex-col bg-gray-50/30 overflow-hidden">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-2xl mx-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm max-w-[85%] ${message.type === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-100"
                      }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {processing && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-2 rounded-xl text-xs text-gray-400 border border-gray-100 animate-pulse">
                      AI is thinking...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area (Only in Chat Mode) */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me to change something..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={processing}
                    className="pr-10 py-5 rounded-xl border-gray-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-blue-300" />
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || processing}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
