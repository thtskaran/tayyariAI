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
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


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

  // useEffect(() => {
  //   const loadResumes = async () => {
  //     setLoading(true);
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     // Mock data
  //     const mockResumes: Resume[] = [
  //       {
  //         id: '1',
  //         userId: user?.uid || '',
  //         title: 'Software Engineer Resume',
  //         content: {},
  //         createdAt: new Date('2024-01-15'),
  //         updatedAt: new Date('2024-01-20'),
  //       },
  //       {
  //         id: '2',
  //         userId: user?.uid || '',
  //         title: 'Product Manager Resume',
  //         content: {},
  //         createdAt: new Date('2024-01-10'),
  //         updatedAt: new Date('2024-01-18'),
  //       }
  //     ];
      
  //     setResumes(mockResumes);
  //     setLoading(false);
  //   };

  //   if (user) {
  //     loadResumes();
  //   }
  // }, [user]);

  // const filteredResumes = resumes.filter(resume =>
  //   resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleEdit = (id: string) => {
  //   router.push(`/create?resume=${id}`);
  // };

  // const handleDelete = (id: string) => {
  //   setResumes(resumes.filter(resume => resume.id !== id));
  // };

  // const handleDownload = (id: string) => {
  //   console.log('Downloading resume:', id);
  // };

  // const handlePreview = (id: string) => {
  //   console.log('Previewing resume:', id);
  // };

  // useEffect(() => {
  //   const loadResumes = async () => {
  //     if (!user?.email) return;

  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `${API_BASE_URL}/api/resumes?email=${encodeURIComponent(user.email)}`
  //       );
  //       const data = await response.json();

  //       if (response.ok && Array.isArray(data.resume_ids)) {
  //         // data.resume_ids = [id1, id2, ...]
  //         const formattedResumes = data.resume_ids.map((id: string) => ({
  //           id,
  //           userId: user.email,
  //           title: `Resume ${id.substring(0, 6)}`,
  //           content: {},
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //         }));
  //         setResumes(formattedResumes);
  //       } else {
  //         setResumes([]);
  //         toast.error(data.error || 'Failed to load resumes');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       toast.error('Error fetching resumes');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (!authLoading && user) {
  //     loadResumes();
  //   }
  // }, [user,authLoading]);

  useEffect(() => {
  const loadResumes = async () => {
    if (!user?.email) {
    setLoading(false); // <-- Add this line
    return;
  }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resumes?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (response.ok && Array.isArray(data.resume_ids)) {
        const formattedResumes = data.resume_ids.map((id: string) => ({
          id,
          userId: user.email,
          title: `Resume ${id.substring(0, 6)}`,
          content: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        setResumes(formattedResumes);
      } else {
        setResumes([]); // <-- prevent infinite loading
        toast.error(data.error || 'Failed to load resumes');
      }
    } catch (error) {
      console.error(error);
      setResumes([]); // <-- prevent infinite loading
      toast.error('Error fetching resumes');
    } finally {
      setLoading(false); // <-- always stop loading
    }
  };

  // only run once after auth finishes
  if (!authLoading && user) {
    loadResumes();
  }
}, [user, authLoading]);


  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/create?resume=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!user?.email) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(user.email)}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Resume deleted successfully');
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(data.error || 'Failed to delete resume');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting resume');
    }
  };

  const handleDownload = async (id: string) => {
    if (!user?.email) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(user.email)}`
      );

      if (!response.ok) {
        toast.error('Failed to download resume');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${id}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error downloading resume');
    }
  };

  const handlePreview = async (id: string) => {
    if (!user?.email) return;
    const url = `${API_BASE_URL}/api/resumes/${id}?email=${encodeURIComponent(user.email)}`;
    window.open(url, '_blank');
  };


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
  router.push('/auth/signin');
  return null;
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
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
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