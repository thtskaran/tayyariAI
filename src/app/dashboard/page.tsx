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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        const response = await fetch(
          `${API_BASE_URL}/api/resumes?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data.resume_ids)) {
          setResumes(
            data.resume_ids.map((id: string) => ({
              id,
              userId: email,
              title: `Resume ${id.slice(0, 6)}`,
              content: {},
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
          );
        } else {
          setResumes([]);
          toast.error(data.error || 'Failed to load resumes');
        }
      } catch {
        toast.error('Error fetching resumes');
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
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(email)}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success('Resume deleted');
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Error deleting resume');
    }
  };

  const handleDownload = async (id: string) => {
    if (!email) return;

    const response = await fetch(
      `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(email)}`
    );
    if (!response.ok) return toast.error('Download failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${id}.html`;
    a.click();
  };

  const handlePreview = (id: string) => {
    if (!email) return;
    window.open(
      `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(email)}`,
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Resumes</h1>
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Resume
              </Button>
            </Link>
          </div>

          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-6 max-w-md"
          />

          {filteredResumes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
