'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Download, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Resume } from '@/lib/types/types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ResumeCardProps {
  resume: Resume;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
}

export default function ResumeCard({ resume, onEdit, onDelete, onDownload, onPreview }: ResumeCardProps) {
  const isAiGenerated = resume.id.endsWith('_ai');
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
  const previewUrl = `${API_BASE}/resumes/${resume.id}?email=${encodeURIComponent(resume.userId)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden border-gray-100 hover:shadow-2xl transition-all duration-300 group bg-white">
        {/* Preview Section */}
        <div
          className="aspect-[3/4] w-full bg-slate-50 relative overflow-hidden border-b border-gray-100 cursor-pointer"
          onClick={() => onPreview(resume.id)}
        >
          <iframe
            src={previewUrl}
            className="w-[200%] h-[200%] border-0 pointer-events-none scale-[0.5] origin-top-left opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            title={resume.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-10" />

          {/* AI Badge removed as requested */}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 z-20">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <CardHeader className="p-3 pb-1">
          <div className="flex items-center justify-between gap-1">
            <CardTitle className="text-sm font-bold truncate text-gray-800">
              {resume.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-xl">
                <DropdownMenuItem onClick={() => onPreview(resume.id)} className="rounded-lg text-xs">
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(resume.id)} className="rounded-lg text-xs">
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(resume.id)} className="rounded-lg text-xs">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 rounded-lg text-xs"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl max-w-sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-sm">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs">
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-start">
                      <AlertDialogCancel className="rounded-lg h-8 text-[10px]">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(resume.id)}
                        className="bg-red-600 hover:bg-red-700 rounded-lg h-8 text-[10px]"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                {formatDistanceToNow(new Date(resume.updatedAt))} ago
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 text-[10px] font-bold h-7 px-0"
                onClick={() => onPreview(resume.id)}
              >
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 text-[10px] font-bold h-7 px-0"
                onClick={() => onDownload(resume.id)}
              >
                <Download className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
