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

interface MonthData {
  number: number;
  title: string;
  goal: string;
  weeks: string[];
  checkin: string;
}

function parseActionPlan(actionPlanText: string): MonthData[] {
  const months: MonthData[] = [];
  const monthSections = actionPlanText.split(/MONTH \d+:/i);

  monthSections.forEach((section, index) => {
    if (index === 0 || !section.trim()) return;

    const lines = section.split('\n').filter(line => line.trim());
    const titleLine = lines[0]?.trim() || '';

    let goal = '';
    const weeks: string[] = [];
    let checkin = '';

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('SMART Goal:')) {
        goal = trimmedLine.replace('SMART Goal:', '').trim();
      } else if (trimmedLine.match(/Week \d+:/i)) {
        weeks.push(trimmedLine.replace(/Week \d+:/i, '').trim());
      } else if (trimmedLine.startsWith('Monthly Check-in:')) {
        checkin = trimmedLine.replace('Monthly Check-in:', '').trim();
      }
    });

    months.push({
      number: index,
      title: titleLine,
      goal,
      weeks,
      checkin,
    });
  });

  return months;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/##\s*/g, '')
    .replace(/---+/g, '')
    .replace(/\*/g, '')
    .trim();
}

function getMonthDate(monthNumber: number): string {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setMonth(now.getMonth() + monthNumber);

  return targetDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

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
    doc.setFont('helvetica', 'normal');
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

    let yPosition = 50;

    try {
      const logoPath = '/inner-edge-logo.png';
      const img = new Image();
      img.src = logoPath;

      const logoWidth = 40;
      const logoHeight = 40;
      const logoX = (pageWidth - logoWidth) / 2;

      doc.addImage(img, 'PNG', logoX, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 10;
    } catch (error) {
      console.warn('Could not load logo, continuing without it');
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('inneredge.co', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const titleLines = wrapText(`${data.name}'s Vision`, contentWidth);
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
    yPosition = (pageHeight * 2) / 3 + 10;
    doc.text(`Created: ${data.createdDate}`, pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 8;
    doc.text(`Vision Date: ${data.visionDate}`, pageWidth / 2, yPosition, {
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

    const cleanNarrative = stripMarkdown(data.visionNarrative);
    const paragraphs = cleanNarrative.split('\n').filter((p) => p.trim());

    paragraphs.forEach((paragraph) => {
      const processedParagraph = paragraph.trim();
      if (!processedParagraph) return;

      const lines = wrapText(processedParagraph, contentWidth);

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
    } else {
      yPosition = margin + 20;
    }

    doc.setTextColor(BRAND_COLOR);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Your 12-Month Action Plan', margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    const months = parseActionPlan(data.actionPlan);

    months.forEach((month) => {
      if (yPosition > pageHeight - margin - 70) {
        addNewPage();
        yPosition = margin;
      }

      yPosition += 5;

      const cleanTitle = stripMarkdown(month.title);
      const monthDate = getMonthDate(month.number - 1);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(BRAND_COLOR);
      doc.text(`Month ${month.number}: ${cleanTitle}`, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(LIGHT_TEXT_COLOR);
      doc.text(monthDate, margin, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(TEXT_COLOR);

      if (month.goal) {
        const cleanGoal = stripMarkdown(month.goal);

        doc.setFont('helvetica', 'bold');
        doc.text('SMART Goal:', margin + 5, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const goalLines = wrapText(cleanGoal, contentWidth - 10);
        goalLines.forEach((goalLine) => {
          if (yPosition > pageHeight - margin - 15) {
            addNewPage();
            yPosition = margin;
          }
          doc.text(goalLine, margin + 5, yPosition);
          yPosition += 5;
        });
        yPosition += 4;
      }

      if (month.weeks.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Weekly Breakdown:', margin + 5, yPosition);
        yPosition += 6;
        doc.setFont('helvetica', 'normal');

        month.weeks.forEach((week, index) => {
          if (yPosition > pageHeight - margin - 15) {
            addNewPage();
            yPosition = margin;
          }

          const cleanWeek = stripMarkdown(week);
          const weekLines = wrapText(`  • Week ${index + 1}: ${cleanWeek}`, contentWidth - 10);
          weekLines.forEach((weekLine) => {
            doc.text(weekLine, margin + 5, yPosition);
            yPosition += 5;
          });
        });
        yPosition += 4;
      }

      if (month.checkin) {
        const cleanCheckin = stripMarkdown(month.checkin);

        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Check-in:', margin + 5, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'italic');
        doc.setTextColor(LIGHT_TEXT_COLOR);
        const checkinLines = wrapText(cleanCheckin, contentWidth - 10);
        checkinLines.forEach((checkinLine) => {
          if (yPosition > pageHeight - margin - 15) {
            addNewPage();
            yPosition = margin;
          }
          doc.text(checkinLine, margin + 5, yPosition);
          yPosition += 5;
        });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(TEXT_COLOR);
        yPosition += 2;
      }

      yPosition += 6;
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
