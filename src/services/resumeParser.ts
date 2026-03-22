// 简历解析服务 - 处理文件上传和文本提取

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export type SupportedFileType = 'pdf' | 'docx' | 'doc' | 'txt' | 'text';

export interface ParseResult {
  success: boolean;
  text: string;
  error?: string;
  pageCount?: number;
  wordCount?: number;
}

// 检测文件类型
export function detectFileType(file: File): SupportedFileType | null {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;

  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  }
  if (extension === 'doc' || mimeType === 'application/msword') {
    return 'doc';
  }
  if (extension === 'txt' || mimeType === 'text/plain') {
    return 'txt';
  }
  if (mimeType.startsWith('text/')) {
    return 'text';
  }

  return null;
}

// 解析 PDF 文件
async function parsePDF(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');
      fullText += pageText + '\n\n';
    }

    // 清理文本
    fullText = cleanText(fullText);

    return {
      success: true,
      text: fullText,
      pageCount: numPages,
      wordCount: fullText.split(/\s+/).filter(Boolean).length,
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      error: `PDF 解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

// 解析 Word 文件
async function parseWord(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    const text = cleanText(result.value);

    return {
      success: true,
      text,
      wordCount: text.split(/\s+/).filter(Boolean).length,
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      error: `Word 解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

// 解析纯文本文件
async function parseText(file: File): Promise<ParseResult> {
  try {
    const text = await file.text();
    const cleanedText = cleanText(text);

    return {
      success: true,
      text: cleanedText,
      wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      error: `文本解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}

// 清理文本
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')           // 统一换行符
    .replace(/\r/g, '\n')             // 统一换行符
    .replace(/\n{3,}/g, '\n\n')       // 最多两个连续换行
    .replace(/[ \t]{2,}/g, ' ')       // 多个空格变成一个
    .replace(/^\s+|\s+$/gm, '')       // 去除行首行尾空格
    .trim();
}

// 主解析函数
export async function parseResumeFile(file: File): Promise<ParseResult> {
  const fileType = detectFileType(file);

  if (!fileType) {
    return {
      success: false,
      text: '',
      error: `不支持的文件类型: ${file.name}。支持格式: PDF, DOCX, DOC, TXT`,
    };
  }

  switch (fileType) {
    case 'pdf':
      return parsePDF(file);
    case 'docx':
    case 'doc':
      return parseWord(file);
    case 'txt':
    case 'text':
      return parseText(file);
    default:
      return {
        success: false,
        text: '',
        error: '不支持的文件类型',
      };
  }
}

// 解析粘贴的文本
export function parsePastedText(text: string): ParseResult {
  const cleanedText = cleanText(text);
  
  if (!cleanedText.trim()) {
    return {
      success: false,
      text: '',
      error: '文本内容为空',
    };
  }

  return {
    success: true,
    text: cleanedText,
    wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
  };
}