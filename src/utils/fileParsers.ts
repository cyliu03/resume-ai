import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ResumeData, ExportData } from '../types/resume';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// 解析 PDF 文件
export async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

// 解析 Word 文档
export async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// 解析 JSON 文件
export async function parseJSON(file: File): Promise<ExportData | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data as ExportData);
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}

// 从文本中提取简历信息（简单解析）
export function extractResumeFromText(text: string): Partial<ResumeData> {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const result: Partial<ResumeData> = {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: '',
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
  };

  // 尝试提取邮箱
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    result.personalInfo!.email = emailMatch[0];
  }

  // 尝试提取电话
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    result.personalInfo!.phone = phoneMatch[0];
  }

  // 尝试提取姓名（通常在文档开头）
  if (lines.length > 0) {
    const firstLine = lines[0];
    // 姓名通常是2-4个中文字符或者英文名
    if (/^[\u4e00-\u9fa5]{2,4}$/.test(firstLine) || /^[A-Za-z\s]{2,30}$/.test(firstLine)) {
      result.personalInfo!.name = firstLine;
    }
  }

  // 尝试提取网址
  const urlRegex = /(https?:\/\/[^\s]+|github\.com\/[\w-]+|linkedin\.com\/in\/[\w-]+)/gi;
  const urlMatches = text.match(urlRegex);
  if (urlMatches) {
    urlMatches.forEach(url => {
      if (url.includes('github.com')) {
        result.personalInfo!.github = url;
      } else if (url.includes('linkedin.com')) {
        result.personalInfo!.linkedin = url;
      } else {
        result.personalInfo!.website = url;
      }
    });
  }

  return result;
}

// 解析文件并返回简历数据
export async function parseResumeFile(file: File): Promise<{
  type: 'json' | 'text';
  data: ExportData | Partial<ResumeData>;
}> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    const jsonData = await parseJSON(file);
    if (jsonData) {
      return { type: 'json', data: jsonData };
    }
    throw new Error('无法解析JSON文件');
  }

  let text = '';
  if (extension === 'pdf') {
    text = await parsePDF(file);
  } else if (extension === 'docx') {
    text = await parseDOCX(file);
  } else {
    throw new Error('不支持的文件格式');
  }

  const extractedData = extractResumeFromText(text);
  return { type: 'text', data: extractedData };
}