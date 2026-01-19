'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription,CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Plus, Trash2,FileText, X, Sparkles } from 'lucide-react';
import { ResumeData, PersonalInfo, Education, Experience, Skill } from '@/lib/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { getResumes, getResumeById, uploadResume, deleteResume, getResumeLatexById } from '@/lib/api/resumes';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";


interface InputPanelProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  onGenerate: () => void;
  loading: boolean;
  aiContent?: string | null;
  onResumeSelect?: (resumeId: string | null) => void;
  onAiReady?: () => void; // Callback when AI updates are ready
  setLatexCode?: (code: string | null) => void;
}

export default function InputPanel({ data, onDataChange, onGenerate, loading, aiContent, onResumeSelect, onAiReady, setLatexCode }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [previewTab, setPreviewTab] = useState<'original' | 'redefined'>('original');
  const [resumeList, setResumeList] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [hasAiVersion, setHasAiVersion] = useState<boolean>(false);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (aiPreviewUrl) URL.revokeObjectURL(aiPreviewUrl);
    };
  }, [aiPreviewUrl]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      window.location.href = "/auth/signin";
    } else {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchResumes();
    }
  }, [userEmail]);

  // Auto-load first resume if none selected
  useEffect(() => {
    if (resumeList.length > 0 && !selectedResumeId && !previewUrl) {
      handleViewResume(resumeList[0]);
    }
  }, [resumeList]);

  const fetchResumes = async () => {
    if (!userEmail) return;
    try {
      const res = await getResumes(userEmail);
      setResumeList(res.resume_ids || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.html', '.pdf', '.docx'];
    if (!allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      toast.error('Only HTML, PDF, and DOCX files are allowed.');
      return;
    }

    try {
      setUploading(true);
      const resumeId = uuidv4();
      await uploadResume(resumeId, file, userEmail);
      toast.success('Resume uploaded successfully!');
      await fetchResumes();
      handleViewResume(resumeId);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  // Check if AI version exists for selected resume
  const checkForAiVersion = async (resumeId: string) => {
    try {
      const aiResumeId = `${resumeId}_ai`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/resumes/${aiResumeId}?email=${userEmail}`);
      if (response.ok) {
        setHasAiVersion(true);
        return true;
      }
      setHasAiVersion(false);
      return false;
    } catch (err) {
      // Silently handle - AI version doesn't exist yet (expected)
      setHasAiVersion(false);
      return false;
    }
  };

  const handleViewResume = async (resumeId: string) => {
    try {
      setUploading(true);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (aiPreviewUrl) URL.revokeObjectURL(aiPreviewUrl);

      const blob = await getResumeById(resumeId, userEmail!);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setSelectedResumeId(resumeId);
      setPreviewTab('original');
      setAiPreviewUrl(null);

      // Check if AI version exists
      await checkForAiVersion(resumeId);

      // Notify parent component
      if (onResumeSelect) {
        onResumeSelect(resumeId);
      }

      // Check if AI version exists
      await checkForAiVersion(resumeId);
    } catch (err) {
      console.error('Error fetching resume:', err);
      toast.error('Failed to load resume preview');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!userEmail) return;
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      setUploading(true);
      await deleteResume(resumeId, userEmail);
      toast.success('Resume deleted successfully!');
      if (selectedResumeId === resumeId) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedResumeId(null);
      }
      await fetchResumes();
    } catch (err) {
      console.error('Error deleting resume:', err);
      toast.error('Failed to delete resume');
    } finally {
      setUploading(false);
    }
  };

  // const handleEditResume = (resumeId: string) => {
  //   handleViewResume(resumeId);
  //   toast.info('Direct editing of uploaded resumes is coming soon. For now, you can view and use it as a reference.');
  // };


  // Load AI version when switching to redefined tab
  const loadAiVersion = async () => {
    if (!selectedResumeId || !userEmail) return;

    // Try to fetch LaTeX code
    const aiResumeId = selectedResumeId.endsWith('_ai') ? selectedResumeId : `${selectedResumeId}_ai`;

    // Only fetch if we don't have current session content or if we want to refresh
    try {
      if (setLatexCode) {
        const latex = await getResumeLatexById(aiResumeId, userEmail);
        setLatexCode(latex);
      }
    } catch (err: any) {
      // If 404 and we don't have session content, then it's actually missing
      if (err.response?.status !== 404) {
        console.error('Error fetching LaTeX:', err);
      }
      // Only set to null if we really don't have anything
      if (!aiContent && setLatexCode) setLatexCode(null);
    }

    // First check if we have aiContent from current session
    if (aiContent) {
      const blob = new Blob([aiContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      if (aiPreviewUrl) URL.revokeObjectURL(aiPreviewUrl);
      setAiPreviewUrl(url);
      return;
    }

    // Otherwise try to fetch from server
    try {
      setUploading(true);
      const aiResumeId = `${selectedResumeId}_ai`;
      const blob = await getResumeById(aiResumeId, userEmail);
      const url = URL.createObjectURL(blob);
      if (aiPreviewUrl) URL.revokeObjectURL(aiPreviewUrl);
      setAiPreviewUrl(url);
      setHasAiVersion(true);
    } catch (err) {
      // Silently handle - no AI version exists yet (expected behavior)
      setHasAiVersion(false);
    } finally {
      setUploading(false);
    }
  };

  // Load AI version when switching to redefined tab
  useEffect(() => {
    if (previewTab === 'redefined' && selectedResumeId) {
      loadAiVersion();
    }
  }, [previewTab, selectedResumeId]);

  // Update AI preview when aiContent changes
  useEffect(() => {
    if (aiContent) {
      const blob = new Blob([aiContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      if (aiPreviewUrl) URL.revokeObjectURL(aiPreviewUrl);
      setAiPreviewUrl(url);
      setHasAiVersion(true);

      // Auto-switch to AI Redefined tab when new AI content arrives
      if (selectedResumeId && previewTab !== 'redefined') {
        setPreviewTab('redefined');
      }

      // Notify parent if callback exists
      if (onAiReady) {
        onAiReady();
      }
    }
  }, [aiContent]);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    onDataChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
    };
    onDataChange({
      ...data,
      education: [...data.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onDataChange({
      ...data,
      education: data.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onDataChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: []
    };
    onDataChange({
      ...data,
      experience: [...data.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onDataChange({
      ...data,
      experience: data.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onDataChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
      category: 'Technical'
    };
    onDataChange({
      ...data,
      skills: [...data.skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onDataChange({
      ...data,
      skills: data.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    onDataChange({
      ...data,
      skills: data.skills.filter(skill => skill.id !== id)
    });
  };


  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between w-full">
          <span>Resume Input</span>
          <div className="flex bg-gray-200/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('scratch')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'scratch' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Scratch
            </button>
          </div>
        </CardTitle>
        <CardDescription className="mt-1">
          Choose how you'd like to create your resume
        </CardDescription>
      </div>

      <ScrollArea className="flex-1">
        <CardContent className="p-0">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="upload" className="m-0 focus-visible:ring-0 border-0">
              <div className="p-8">
                {resumeList.length === 0 && !previewUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center bg-gray-50/50 hover:bg-white hover:border-blue-400 transition-all duration-500 group"
                  >
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload your resume</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                      Upload a PDF, HTML or DOCX file and let our AI personalize it for you.
                    </p>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button asChild disabled={uploading} size="lg" className="px-10 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 text-lg font-bold">
                        <span>{uploading ? 'Analyzing...' : 'Select File'}</span>
                      </Button>
                      <input id="file-upload" type="file" accept=".pdf,.docx,.html" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {previewUrl && (
                    <motion.div
                      key={selectedResumeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                              onClick={() => setPreviewTab('original')}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${previewTab === 'original' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                            >
                              Original PDF
                            </button>
                            <button
                              onClick={() => setPreviewTab('redefined')}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${previewTab === 'redefined' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                            >
                              AI Redefined
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600 rounded-xl" onClick={() => handleDeleteResume(selectedResumeId!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <label htmlFor="file-upload-header" className="cursor-pointer">
                            <Button variant="default" size="sm" asChild disabled={uploading} className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                              <span className="flex items-center gap-2 font-bold">
                                <Plus className="h-4 w-4" /> Upload Other Resume
                              </span>
                            </Button>
                            <input id="file-upload-header" type="file" accept=".pdf,.docx,.html" onChange={handleFileUpload} className="hidden" />
                          </label>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                            setSelectedResumeId(null);
                          }} className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="relative group rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
                        <div className="h-[800px] w-full bg-white flex justify-center overflow-hidden">
                          <iframe
                            src={previewTab === 'original' ? previewUrl : (aiPreviewUrl || undefined)}
                            srcDoc={previewTab === 'redefined' && !aiPreviewUrl ? (aiContent || undefined) : undefined}
                            className="w-full h-full border-0"
                          />
                        </div>
                        {previewTab === 'redefined' && !aiPreviewUrl && !aiContent && (
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                              <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">No AI Version Yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                              Use the AI Assistant on the right to optimize this resume!
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {resumeList.length > 0 && !previewUrl && (
                  <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Saved Resumes
                      </h4>
                      <label htmlFor="file-upload-list" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild disabled={uploading} className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50">
                          <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Upload Other
                          </span>
                        </Button>
                        <input id="file-upload-list" type="file" accept=".pdf,.docx,.html" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {resumeList.map(id => (
                        <div key={id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 truncate max-w-[200px] font-mono text-xs">{id}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Document</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="rounded-xl font-bold" onClick={() => handleViewResume(id)}>Open</Button>
                            <Button size="sm" variant="ghost" className="rounded-xl text-red-500 hover:text-red-700 font-bold" onClick={() => handleDeleteResume(id)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scratch" className="m-0 focus-visible:ring-0 border-0">
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="block mb-1">Full Name</Label>
                        <Input
                          id="fullName"
                          value={data.personalInfo.fullName}
                          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="block mb-1">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="block mb-1">Phone</Label>
                        <Input
                          id="phone"
                          value={data.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="block mb-1">Location</Label>
                        <Input
                          id="location"
                          value={data.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary" className="block mb-1">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={data.personalInfo.summary}
                        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                        placeholder="A brief professional summary..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button onClick={addEducation} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    {data.education.map((edu) => (
                      <Card key={edu.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Education Entry</h4>
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-1">Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">Start Date</Label>
                            <Input
                              type="date"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">End Date</Label>
                            <Input
                              type="date"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Experience</h3>
                      <Button onClick={addExperience} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    {data.experience.map((exp) => (
                      <Card key={exp.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Experience Entry</h4>
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-1">Job Title</Label>
                            <Input
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">Start Date</Label>
                            <Input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">End Date</Label>
                            <Input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              disabled={exp.current}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label className="block mb-1">Description</Label>
                          <Textarea
                            value={exp.description.join('\n')}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                            placeholder="• Developed web applications using React and Node.js&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 30%"
                            rows={3}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <Button onClick={addSkill} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                    {data.skills.map((skill) => (
                      <Card key={skill.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Skill Entry</h4>
                          <Button
                            onClick={() => removeSkill(skill.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="block mb-1">Skill Name</Label>
                            <Input
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              placeholder="JavaScript"
                            />
                          </div>
                          <div>
                            <Label className="block mb-1">Level</Label>
                            <select
                              value={skill.level}
                              onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                              className="w-full p-1.5 border rounded-md"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          <div>
                            <Label className="block mb-1">Category</Label>
                            <Input
                              value={skill.category}
                              onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                              placeholder="Technical"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={onGenerate}
                    className="w-full py-8 text-xl font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate AI Resume'}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </ScrollArea>
    </div>
  );
}
