'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeCard from '@/components/dashboard/ResumeCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Resume } from '@/lib/types/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { getResumes, deleteResume } from '@/lib/api/resumes';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ AUTH CHECK (CORRECT WAY)
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');

    if (!storedEmail) {
      router.replace('/auth/signin');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // ✅ LOAD RESUMES
  useEffect(() => {
    if (!email) return;

    const loadResumes = async () => {
      setLoading(true);
      try {
        const data = await getResumes(email);

        if (Array.isArray(data.resume_ids)) {
          const allResumeIds = new Set<string>(data.resume_ids);

          // Proactively look for AI versions of each resume in the list
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
          const aiCheckPromises = data.resume_ids
            .filter((id: string) => !id.endsWith('_ai'))
            .map(async (id: string) => {
              const aiId = `${id}_ai`;
              if (allResumeIds.has(aiId)) return null; // Already in list

              try {
                // Check if the AI version exists by trying to fetch its metadata/content
                const response = await fetch(`${API_BASE}/resumes/${aiId}?email=${encodeURIComponent(email)}`);
                if (response.ok) return aiId;
              } catch {
                return null;
              }
              return null;
            });

          const discoveredAiIds = (await Promise.all(aiCheckPromises)).filter((id): id is string => id !== null);

          // Combine original list with discovered AI versions and filter for AI ONLY
          const finalIds = Array.from(new Set([...data.resume_ids, ...discoveredAiIds]))
            .filter((id: string) => id.endsWith('_ai'));

          setResumes(
            finalIds.map((id: string) => ({
              id,
              userId: email,
              title: `Professional Resume`,
              content: {},
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
          );
        } else {
          setResumes([]);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Error fetching resumes');
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, [email]);

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/create?resume=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!email) return;

    try {
      await deleteResume(id, email);
      toast.success('Resume deleted');
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error deleting resume');
    }
  };

  const handleDownload = async (id: string) => {
    if (!email) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
    const url = `${API_BASE}/resumes/${id}?email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `resume_${id}.html`;
      a.click();
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handlePreview = (id: string) => {
    if (!email) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
    window.open(
      `${API_BASE}/resumes/${id}?email=${encodeURIComponent(email)}`,
      '_blank'
    );
  };

  if (!email || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Background Orbs for Premium Feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                Your <span className="text-blue-600">Resumes</span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and refine your professional profiles with AI.</p>
            </div>
            <Link href="/create">
              <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-12 px-6 shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 text-base font-bold">
                <Plus className="mr-2 h-5 w-5" />
                Create New Resume
              </Button>
            </Link>
          </div>

          {/* Search & Stats Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-10 w-full">
            <div className="relative flex-1 w-full max-w-md">
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-gray-100 p-1.5 rounded-2xl shadow-sm">
              <div className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white shadow-sm border border-gray-50">
                Total: {resumes.length}
              </div>
              <div className="px-4 py-2 rounded-xl text-sm font-bold text-blue-600">
                AI: {resumes.filter(r => r.id.endsWith('_ai')).length}
              </div>
            </div>
          </div>

          {/* Content Area */}
          {filteredResumes.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-sm border border-dashed border-gray-200 rounded-[32px] p-20">
              <EmptyState />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Toaster />
    </div>
  );
}

