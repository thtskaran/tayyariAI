'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { ResumeData, PersonalInfo, Education, Experience, Skill } from '@/lib/types/types';
import { motion } from 'framer-motion';

interface InputPanelProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function InputPanel({ data, onDataChange, onGenerate, loading }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState('upload');

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="h-full">
        <CardHeader className="flex-shrink-0 px-6 py-4">
          <CardTitle className="flex items-center justify-between w-full">Resume Input</CardTitle>
          <CardDescription>
            Choose how you'd like to create your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="scratch">Create from Scratch</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload your resume</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a PDF or DOCX file and let AI enhance it
                  </p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="scratch" className="space-y-6">
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
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Generating Resume...' : 'Generate Resume with AI'}
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </div>
    </div>
  );
}