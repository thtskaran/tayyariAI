// src/lib/api/resumes.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

/**
 * Get all resume IDs for a specific user
 * @param email User's email address
 */
export const getResumes = async (email: string) => {
  if (!email) throw new Error("Email is required to fetch resumes");
  const res = await axios.get(`${BASE_URL}/resumes`, {
    params: { email },
  });
  return res.data; // { resume_ids: [] }
};

/**
 * Get a specific resume's HTML content
 * @param resumeId Resume ID
 * @param email User's email address
 */
export const getResumeById = async (resumeId: string, email: string) => {
  if (!email) throw new Error("Email is required to fetch resume");
  const res = await axios.get(`${BASE_URL}/resumes/${resumeId}`, {
    params: { email },
    responseType: "blob",
  });
  return res.data; // Returns Blob
};

/**
 * Get a specific resume's LaTeX content
 * @param resumeId Resume ID
 * @param email User's email address
 */
export const getResumeLatexById = async (resumeId: string, email: string) => {
  if (!email) throw new Error("Email is required to fetch LaTeX");
  const res = await axios.get(`${BASE_URL}/resumes/${resumeId}/latex`, {
    params: { email },
  });
  return res.data; // Returns string content
};

/**
 * Upload or update a resume file (must be .html)
 * @param resumeId Resume ID
 * @param file File object (.html)
 * @param email User's email address
 */
export const uploadResume = async (
  resumeId: string,
  file: File,
  email: string
) => {
  if (!email) throw new Error("Email is required to upload resume");
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.put(
    `${BASE_URL}/resumes/${resumeId}`,
    formData,
    {
      params: { email },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

/**
 * Delete a resume
 * @param resumeId Resume ID
 * @param email User's email address
 */
export const deleteResume = async (resumeId: string, email: string) => {
  if (!email) throw new Error("Email is required to delete resume");
  const res = await axios.delete(`${BASE_URL}/resumes/${resumeId}`, {
    params: { email },
  });
  return res.data;
};

/**
 * Generate resume using AI
 * @param payload Resume data for AI generation
 */
export const generateAIResume = async (payload: any) => {
  const res = await axios.post(`${BASE_URL}/ai/generate`, payload);
  return res.data; // { updated_content, resume_id }
};
