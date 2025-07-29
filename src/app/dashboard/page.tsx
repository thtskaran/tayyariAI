'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ResumeCard from '@/components/dashboard/ResumeCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Resume } from '@/lib/types/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockResumes: Resume[] = [
        {
          id: '1',
          userId: user?.uid || '',
          title: 'Software Engineer Resume',
          content: {},
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
        },
        {
          id: '2',
          userId: user?.uid || '',
          title: 'Product Manager Resume',
          content: {},
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
        }
      ];
      
      setResumes(mockResumes);
      setLoading(false);
    };

    if (user) {
      loadResumes();
    }
  }, [user]);

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/create?resume=${id}`);
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleDownload = (id: string) => {
    console.log('Downloading resume:', id);
  };

  const handlePreview = (id: string) => {
    console.log('Previewing resume:', id);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Resumes</h1>
              <p className="text-gray-600 mt-2">
                Manage and create your AI-powered resumes
              </p>
            </div>
            <Link href="/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Resume
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          {/* Resume Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResumes.length === 0 ? (
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
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardContent />
      <Toaster />
    </AuthProvider>
  );
}