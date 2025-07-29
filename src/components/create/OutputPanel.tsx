"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Send, MessageSquare, X } from "lucide-react";
import { ResumeData } from "@/lib/types/types";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OutputPanelProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  loading: boolean;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function OutputPanel({ data,onDataChange, loading }: OutputPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setShowChat(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
      setProcessing(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("concise") || lowerMessage.includes("shorter")) {
      return "I've made your resume more concise by removing redundant phrases and tightening the language while maintaining impact.";
    } else if (
      lowerMessage.includes("highlight") ||
      lowerMessage.includes("emphasize")
    ) {
      return "I've restructured your resume to better highlight your key achievements and skills, making them more prominent to recruiters.";
    } else if (
      lowerMessage.includes("technical") ||
      lowerMessage.includes("skills")
    ) {
      return "I've reorganized your technical skills section and added relevant keywords to improve ATS compatibility.";
    } else if (
      lowerMessage.includes("experience") ||
      lowerMessage.includes("work")
    ) {
      return "I've enhanced your work experience descriptions with stronger action verbs and quantifiable achievements.";
    } else {
      return "I've updated your resume based on your request. The changes should improve readability and impact while maintaining professional standards.";
    }
  };

  const handleDownload = () => {
    console.log("Downloading resume...");
  };

  return (
    <div className="w-full  h-full flex flex-col bg-white">
      {/* Header */}
      <CardHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between w-full">
          <span>Resume Preview</span>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-500">
          Live preview of your AI-generated resume
        </CardDescription>
      </CardHeader>

      {/* Resume Preview */}
      <CardContent className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg shadow p-6 space-y-6"
          >
            {/* Header */}
            <div className="text-center border-b pb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.personalInfo.fullName || "Your Name"}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {data.personalInfo.email} • {data.personalInfo.phone} •{" "}
                {data.personalInfo.location}
              </p>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 text-sm">
                  {data.personalInfo.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Experience
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">
                            {exp.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} -{" "}
                          {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm mt-1">
                        {exp.description.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {data.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p>{edu.institution}</p>
                      </div>
                      <p className="text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Skills
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="flex justify-between">
                      <span>{skill.name}</span>
                      <span className="text-gray-500">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </CardContent>

      {/* Chat Interface */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-2 bg-white">
        {showChat && (
        <div className="flex items-center justify-between mb-1 text-gray-700">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">AI Chat</h3>
          </div>
          <button
            onClick={() => setShowChat(false)} 
            aria-label="Close chat"
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        )}

        {showChat && (
          <ScrollArea className="h-28 mb-3 p-2 bg-gray-50 border rounded-lg overflow-y-auto">
            <div className="space-y-2">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {processing && (
                <div className="flex justify-start">
                  <div className="bg-white p-2 rounded-lg text-sm text-gray-500 shadow-sm">
                    AI is typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI to improve your resume..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={processing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || processing}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
