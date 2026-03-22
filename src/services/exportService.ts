import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import type { ResumeData } from '../types/resume';

// 导出为 PDF
export async function exportToPDF(element: HTMLElement, filename: string): Promise<void> {
  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  };

  await html2pdf().set(opt).from(element).save();
}

// 导出为 Word (docx)
export async function exportToWord(data: ResumeData, filename: string): Promise<void> {
  const { personalInfo, education, experience, projects, skills } = data;

  const children: Paragraph[] = [];

  // 个人信息 - 姓名
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.name || '简历',
          bold: true,
          size: 48, // 24pt
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // 职位标题
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.title,
            size: 24, // 12pt
            color: '666666',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // 联系信息
  const contactInfo: string[] = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);
  if (contactInfo.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(' | '),
            size: 20, // 10pt
            color: '444444',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
  }

  // 链接信息
  const links: string[] = [];
  if (personalInfo.website) links.push(personalInfo.website);
  if (personalInfo.linkedin) links.push(personalInfo.linkedin);
  if (personalInfo.github) links.push(personalInfo.github);
  if (links.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: links.join(' | '),
            size: 20,
            color: '2563eb',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // 分隔线
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: 'cccccc',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { after: 300 },
    })
  );

  // 个人简介
  if (personalInfo.summary) {
    children.push(createSectionTitle('个人简介'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // 工作经历
  if (experience.length > 0) {
    children.push(createSectionTitle('工作经历'));
    experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: ' - ',
              size: 24,
            }),
            new TextRun({
              text: exp.company,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} - ${exp.current ? '至今' : exp.endDate}`,
              size: 20,
              color: '666666',
            }),
            exp.location
              ? new TextRun({
                  text: ` | ${exp.location}`,
                  size: 20,
                  color: '666666',
                })
              : new TextRun({ text: '' }),
          ],
          spacing: { after: 100 },
        })
      );
      if (exp.responsibilities) {
        const respLines = exp.responsibilities.split('\n').filter((line) => line.trim());
        respLines.forEach((line) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`,
                  size: 22,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // 项目经历
  if (projects.length > 0) {
    children.push(createSectionTitle('项目经历'));
    projects.forEach((project) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 24,
            }),
            project.link
              ? new TextRun({
                  text: ` (${project.link})`,
                  size: 20,
                  color: '2563eb',
                })
              : new TextRun({ text: '' }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      if (project.technologies) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `技术栈: ${project.technologies}`,
                size: 20,
                color: '666666',
              }),
            ],
            spacing: { after: 50 },
          })
        );
      }
      if (project.description) {
        const descLines = project.description.split('\n').filter((line) => line.trim());
        descLines.forEach((line) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`,
                  size: 22,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // 教育背景
  if (education.length > 0) {
    children.push(createSectionTitle('教育背景'));
    education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.school,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 50 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} - ${edu.field}`,
              size: 22,
            }),
            new TextRun({
              text: ` | ${edu.startDate} - ${edu.endDate}`,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 50 },
        })
      );
      if (edu.gpa) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `GPA: ${edu.gpa}`,
                size: 20,
                color: '666666',
              }),
            ],
            spacing: { after: 50 },
          })
        );
      }
      if (edu.achievements) {
        const achieveLines = edu.achievements.split('\n').filter((line) => line.trim());
        achieveLines.forEach((line) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`,
                  size: 22,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
      }
      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // 技能
  if (skills.length > 0) {
    children.push(createSectionTitle('专业技能'));
    skills.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${skill.category}: `,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: skill.items,
              size: 22,
            }),
          ],
          spacing: { before: 100, after: 50 },
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

// 创建节标题
function createSectionTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28, // 14pt
        color: '2563eb',
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 200 },
    border: {
      bottom: {
        color: '2563eb',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 12,
      },
    },
  });
}

// 导出为图片 (PNG)
export async function exportToImage(element: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2, // 高清
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}