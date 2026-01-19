'use client';

import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, FileText, Download, MessageSquare, Zap, Shield, Users, Target, Star, Quote } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Hero Section
function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Build Your Perfect Resume with{' '}
            <span className="text-blue-600">AI Power</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Create professional, ATS-friendly resumes in minutes. Our AI analyzes your content 
            and provides intelligent suggestions to help you stand out from the crowd.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Writing</h3>
              <p className="text-gray-600">
                Our AI analyzes your experience and suggests improvements for maximum impact.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Sparkles className="h-12 w-12 text-green-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-gray-600">
                See your resume come to life with real-time preview and instant feedback.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Download className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Export Ready</h3>
              <p className="text-gray-600">
                Download your resume as a perfectly formatted PDF ready for applications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Resume Enhancement',
      description: 'Our advanced AI analyzes your resume and provides intelligent suggestions to improve impact, clarity, and ATS compatibility.',
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: 'Live Preview',
      description: 'See your resume come to life with real-time preview. Every change is instantly reflected in professional formatting.',
      color: 'text-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Chat-based Editing',
      description: 'Simply tell our AI what you want to change. "Make it more concise" or "Highlight my leadership skills" - it understands.',
      color: 'text-purple-600'
    },
    {
      icon: Download,
      title: 'Export Ready',
      description: 'Download your resume as a perfectly formatted PDF that works with all ATS systems and looks great on any device.',
      color: 'text-orange-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create a professional resume in minutes, not hours. Our streamlined process gets you results quickly.',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. We never share your information and you maintain full control over your content.',
      color: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Multi-Industry Support',
      description: 'Whether you\'re in tech, healthcare, finance, or any other field, our AI understands industry-specific requirements.',
      color: 'text-indigo-600'
    },
    {
      icon: Target,
      title: 'ATS Optimized',
      description: 'All resumes are optimized for Applicant Tracking Systems to ensure your resume gets past the initial screening.',
      color: 'text-pink-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Perfect Resumes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, customize, and optimize your resume for maximum impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Google',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'AI Resume helped me land my dream job at Google. The AI suggestions were spot-on and the chat feature made editing so intuitive.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Microsoft',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The best resume builder I\'ve ever used. The AI understood exactly what I wanted to convey and helped me articulate it perfectly.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Spotify',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'I got 3x more interview calls after using AI Resume. The ATS optimization really works!',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Netflix',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The live preview feature is amazing. I could see exactly how my resume would look while making changes.',
      rating: 5
    },
    {
      name: 'Lisa Thompson',
      role: 'UX Designer',
      company: 'Adobe',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Finally, a resume builder that understands design principles. Clean, professional, and effective.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Finance Manager',
      company: 'Goldman Sachs',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The AI chat feature is revolutionary. I just told it what I wanted and it delivered perfectly.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of professionals who have landed their dream jobs with AI Resume
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-gray-300 mb-4" />
              
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQ() {
  const faqs = [
    {
      question: 'How does the AI resume enhancement work?',
      answer: 'Our AI analyzes your resume content, industry standards, and job market trends to provide personalized suggestions for improvement. It can enhance your bullet points, optimize keywords for ATS systems, and ensure your resume follows best practices for your specific field.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We take privacy seriously and use industry-standard encryption to protect your data. Your resume content is never shared with third parties, and you maintain full control over your information. You can delete your data at any time.'
    },
    {
      question: 'Can I edit my resume after it\'s generated?',
      answer: 'Yes! Our chat-based editing feature allows you to make changes conversationally. Simply tell the AI what you want to modify, like "make this section more concise" or "highlight my leadership experience," and it will update your resume accordingly.'
    },
    {
      question: 'What file formats can I upload?',
      answer: 'You can upload resumes in PDF, DOCX, and TXT formats. Our AI will extract and analyze the content, then help you enhance and restructure it for maximum impact.'
    },
    {
      question: 'Are the resumes ATS-friendly?',
      answer: 'Yes, all resumes generated by our platform are optimized for Applicant Tracking Systems (ATS). We ensure proper formatting, keyword optimization, and structure that passes through ATS filters while maintaining visual appeal.'
    },
    {
      question: 'How long does it take to create a resume?',
      answer: 'With our AI assistance, you can create a professional resume in as little as 10-15 minutes. The process is streamlined - just upload your existing resume or fill out our form, and the AI will generate a polished version instantly.'
    },
    {
      question: 'Can I create multiple versions of my resume?',
      answer: 'Yes! You can create multiple versions of your resume tailored for different job applications or industries. All versions are saved in your dashboard for easy access and management.'
    },
    {
      question: 'Is there a free version available?',
      answer: 'Yes, we offer a free tier that allows you to create and download one resume. Premium features include unlimited resumes, advanced AI suggestions, and priority support.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about AI Resume
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
      <div className="min-h-screen bg-white">
        <main>
          <Hero />
          <Features />
          <Testimonials />
          <FAQ />
        </main>
        <Toaster />
      </div>
  );
}
