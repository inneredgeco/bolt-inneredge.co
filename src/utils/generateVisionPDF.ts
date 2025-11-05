import jsPDF from 'jspdf';

interface VisionPDFData {
  name: string;
  areaOfLife: string;
  visionNarrative: string;
  actionPlan: string;
  createdDate: string;
  visionDate: string;
}

const BRAND_COLOR = '#2d7471';
const TEXT_COLOR = '#1c1917';
const LIGHT_TEXT_COLOR = '#57534e';

export function generateVisionPDF(data: VisionPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25.4;
  const contentWidth = pageWidth - (margin * 2);
  let currentPage = 1;

  const addPageNumber = () => {
    doc.setFontSize(10);
    doc.setTextColor(LIGHT_TEXT_COLOR);
    doc.text(
      `Page ${currentPage}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
    currentPage++;
  };

  const addNewPage = () => {
    doc.addPage();
    addPageNumber();
  };

  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  const addCoverPage = () => {
    doc.setFillColor(BRAND_COLOR);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const titleLines = wrapText(`${data.name}'s Vision`, contentWidth);
    let yPosition = pageHeight / 3;
    titleLines.forEach((line) => {
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 12;
    });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    const subtitleLines = wrapText(
      `${data.areaOfLife} - 1 Year Vision`,
      contentWidth
    );
    subtitleLines.forEach((line) => {
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    });

    doc.setFontSize(12);
    yPosition = (pageHeight * 2) / 3;
    doc.text(`Created: ${data.createdDate}`, pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 8;
    doc.text(`Vision Date: ${data.visionDate}`, pageWidth / 2, yPosition, {
      align: 'center',
    });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INNER EDGE', pageWidth / 2, pageHeight - 30, {
      align: 'center',
    });

    addNewPage();
  };

  const addVisionNarrative = () => {
    let yPosition = margin;

    doc.setTextColor(BRAND_COLOR);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Vision Narrative', margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setTextColor(TEXT_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const paragraphs = data.visionNarrative.split('\n').filter((p) => p.trim());

    paragraphs.forEach((paragraph) => {
      const lines = wrapText(paragraph.trim(), contentWidth);

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin - 20) {
          addNewPage();
          yPosition = margin;
        }

        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      yPosition += 3;
    });

    if (yPosition > pageHeight - margin - 40) {
      addNewPage();
    }
  };

  const addActionPlan = () => {
    let yPosition = margin;

    if (currentPage > 2) {
      addNewPage();
      yPosition = margin;
    }

    doc.setTextColor(BRAND_COLOR);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Your 12-Month Action Plan', margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const monthSections = data.actionPlan.split(/MONTH \d+:/i);

    monthSections.forEach((section, index) => {
      if (index === 0 || !section.trim()) return;

      const lines = section.split('\n').filter((line) => line.trim());
      if (lines.length === 0) return;

      if (yPosition > pageHeight - margin - 60) {
        addNewPage();
        yPosition = margin;
      }

      const monthTitle = lines[0].trim();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(BRAND_COLOR);
      doc.text(`Month ${index}: ${monthTitle}`, margin, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(TEXT_COLOR);

      lines.slice(1).forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          yPosition += 3;
          return;
        }

        if (yPosition > pageHeight - margin - 15) {
          addNewPage();
          yPosition = margin;
        }

        if (trimmedLine.startsWith('SMART Goal:')) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(BRAND_COLOR);
          const goalText = trimmedLine.replace('SMART Goal:', '').trim();
          const goalLines = wrapText(`SMART Goal: ${goalText}`, contentWidth - 10);
          goalLines.forEach((goalLine) => {
            doc.text(goalLine, margin + 5, yPosition);
            yPosition += 6;
          });
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(TEXT_COLOR);
          yPosition += 2;
        } else if (trimmedLine.match(/Week \d+:/i)) {
          const weekLines = wrapText(`• ${trimmedLine}`, contentWidth - 10);
          weekLines.forEach((weekLine) => {
            doc.text(weekLine, margin + 5, yPosition);
            yPosition += 6;
          });
        } else if (trimmedLine.startsWith('Monthly Check-in:')) {
          yPosition += 2;
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(LIGHT_TEXT_COLOR);
          const checkinText = trimmedLine.replace('Monthly Check-in:', '').trim();
          const checkinLines = wrapText(
            `Check-in: ${checkinText}`,
            contentWidth - 10
          );
          checkinLines.forEach((checkinLine) => {
            doc.text(checkinLine, margin + 5, yPosition);
            yPosition += 6;
          });
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(TEXT_COLOR);
        } else {
          const otherLines = wrapText(trimmedLine, contentWidth - 10);
          otherLines.forEach((otherLine) => {
            doc.text(otherLine, margin + 5, yPosition);
            yPosition += 6;
          });
        }
      });

      yPosition += 8;
    });
  };

  addCoverPage();
  addVisionNarrative();
  addActionPlan();

  const nameParts = data.name.split(' ');
  const firstName = nameParts[0] || 'Vision';
  const lastName = nameParts.slice(1).join('_') || 'Document';
  const areaSlug = data.areaOfLife.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${firstName}_${lastName}_Vision_${areaSlug}_${dateStr}.pdf`;

  doc.save(filename);
}
