'use client';

import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        No resumes yet
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Create your first AI-powered resume to get started. It only takes a few minutes!
      </p>
      <Link href="/create">
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Resume
        </Button>
      </Link>
    </motion.div>
  );
}