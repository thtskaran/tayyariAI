'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import InputPanel from '@/components/create/InputPanel';
import OutputPanel from '@/components/create/OutputPanel';
import { ResumeData, PersonalInfo } from '@/lib/types/types';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { toast } from "sonner";


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

function CreateResumeContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   // Simulate AI processing
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   setLoading(false);
  // };

    const handleGenerate = async () => {
    try {
      setLoading(true);
      toast('Generating your resume with AI...');

      const response = await fetch(`${API_BASE_URL}/generate_resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const result = await response.json();

      // ✅ Update resume data with AI-generated fields
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: result.summary || prev.personalInfo.summary
        },
        experience: result.experience || prev.experience,
        projects: result.projects || prev.projects,
        skills: result.skills || prev.skills,
        education: result.education || prev.education
      }));

      toast.success('AI Resume generated successfully!');
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full">
      <main className="w-full min-h-[calc(100vh-64px)]  px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-full w-full"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Resume</h1>
            <p className="text-gray-600 mt-2">
              Build your professional resume with AI assistance
            </p>
          </div>

          <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-240px)] border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
            {/* Left Panel - Input */}
            <div className="w-full lg:w-1/2 border-r border-gray-200">
              <InputPanel
                data={resumeData}
                onDataChange={handleDataChange}
                onGenerate={handleGenerate}
                loading={loading}
              />
            </div>

            {/* Right Panel - Output */}
            <div className="w-full lg:w-1/2">
              <OutputPanel
                data={resumeData}
                onDataChange={handleDataChange}
                loading={loading}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function CreateResume() {
  return (
    <AuthProvider>
      <CreateResumeContent />
      <Toaster />
    </AuthProvider>
  );
}