'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputPanel from '@/components/create/InputPanel';
import OutputPanel from '@/components/create/OutputPanel';
import { ResumeData, PersonalInfo } from '@/lib/types/types';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: ''
};

const initialData: ResumeData = {
  personalInfo: initialPersonalInfo,
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: []
};

export default function CreateResumePage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [aiGeneratedHtml, setAiGeneratedHtml] = useState<string | null>(null);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Clear AI content when selected resume changes to avoid showing old AI edits
  useEffect(() => {
    setAiGeneratedHtml(null);
    setLatexCode(null);
  }, [selectedResumeId]);

  // ✅ AUTH CHECK (SAFE)
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      router.replace('/auth/signin');
    } else {
      setEmail(storedEmail);
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: storedEmail
        }
      }));
    }
  }, [router]);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleGenerate = async () => {
    if (!email) return;

    if (!selectedResumeId) {
      toast.error('Please upload or select a resume first!');
      return;
    }

    try {
      setLoading(true);
      toast('Generating your optimized resume...');

      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          prompt: 'Optimize this resume and provide a professional HTML version.',
          resume_id: selectedResumeId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const result = await response.json();
      if (result.updated_content) {
        setAiGeneratedHtml(result.updated_content);
      }

      toast.success('AI resume generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading screen (SAFE)
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="animate-spin h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between items-start gap-4 mb-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight mb-2">
                Create Your Resume
              </h1>
              <p className="text-base text-gray-600 max-w-2xl">
                Build a professional, AI-powered resume in minutes. Upload your existing PDF or start from scratch.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                AI Powered
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[820px]">
            {/* Input Panel */}
            <div className="w-full lg:w-[56%] bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <InputPanel
                data={resumeData}
                onDataChange={handleDataChange}
                onGenerate={handleGenerate}
                loading={loading}
                aiContent={aiGeneratedHtml}
                onResumeSelect={setSelectedResumeId}
                setLatexCode={setLatexCode}
              />
            </div>

            {/* Output Panel / Chat */}
            <div className="w-full lg:w-[44%] bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <OutputPanel
                data={resumeData}
                onDataChange={handleDataChange}
                loading={loading}
                aiGeneratedHtml={aiGeneratedHtml}
                setAiGeneratedHtml={setAiGeneratedHtml}
                latexCode={latexCode}
                setLatexCode={setLatexCode}
                selectedResumeId={selectedResumeId}
                onAiUpdate={() => {
                  // This will be called when AI updates the resume
                  // InputPanel will auto-switch to AI Redefined tab via aiContent effect
                }}
              />
            </div>
          </div>
        </motion.div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
