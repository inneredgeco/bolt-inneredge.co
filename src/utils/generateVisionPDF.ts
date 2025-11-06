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
  date: string;
  goal: string;
  weeks: string[];
  checkin: string;
}

function parseActionPlan(actionPlanText: string): MonthData[] {
  const months: MonthData[] = [];
  const monthMatches = actionPlanText.matchAll(/MONTH (\d+):(.*?)(?=MONTH \d+:|$)/gis);

  for (const match of monthMatches) {
    const monthNumber = parseInt(match[1], 10);
    const section = match[2];

    const lines = section.split('\n').filter(line => line.trim());

    let title = '';
    let date = '';
    let goal = '';
    const weeks: string[] = [];
    let checkin = '';

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();

      if (idx === 0 && !trimmedLine.startsWith('SMART Goal:') && !trimmedLine.match(/Week \d+:/i)) {
        title = trimmedLine;
      } else if (idx === 1 && !trimmedLine.startsWith('SMART Goal:') && !trimmedLine.match(/Week \d+:/i) && !trimmedLine.startsWith('Monthly Check-in:')) {
        date = trimmedLine;
      } else if (trimmedLine.startsWith('SMART Goal:')) {
        goal = trimmedLine.replace('SMART Goal:', '').trim();
      } else if (trimmedLine.match(/Week \d+:/i)) {
        weeks.push(trimmedLine.replace(/Week \d+:/i, '').trim());
      } else if (trimmedLine.startsWith('Monthly Check-in:')) {
        checkin = trimmedLine.replace('Monthly Check-in:', '').trim();
      }
    });

    months.push({
      number: monthNumber,
      title: title,
      date: date,
      goal,
      weeks,
      checkin,
    });
  }

  return months.sort((a, b) => a.number - b.number);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/##\s*/g, '')
    .replace(/---+/g, '')
    .replace(/\*/g, '')
    .trim();
}

export function generateVisionPDF(data: VisionPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 19.05; // 0.75 inch margins
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

    let yPosition = 40;

    try {
      const logoPath = '/inner-edge-logo.png';
      const img = new Image();
      img.src = logoPath;

      // Higher resolution logo - 120px equivalent (about 42mm)
      const logoWidth = 42;
      const logoHeight = 42;
      const logoX = (pageWidth - logoWidth) / 2;

      doc.addImage(img, 'PNG', logoX, yPosition, logoWidth, logoHeight, undefined, 'FAST');
      yPosition += logoHeight + 7; // 20px spacing equivalent
    } catch (error) {
      console.warn('Could not load logo, continuing without it');
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('inneredge.co', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20; // Proper spacing before title

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
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Vision Narrative', margin, yPosition);
    yPosition += 12;

    doc.setDrawColor(BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setTextColor(TEXT_COLOR);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const cleanNarrative = stripMarkdown(data.visionNarrative);
    const paragraphs = cleanNarrative.split('\n').filter((p) => p.trim());

    paragraphs.forEach((paragraph) => {
      const processedParagraph = paragraph.trim();
      if (!processedParagraph) return;

      const lines = wrapText(processedParagraph, contentWidth);
      const lineHeight = 5.5; // 1.4 line spacing for 11pt

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin - 20) {
          addNewPage();
          yPosition = margin;
        }

        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 3; // 8pt space between paragraphs
    });

    if (yPosition > pageHeight - margin - 60) {
      addNewPage();
    }
  };

  const addActionPlan = () => {
    let yPosition = margin;

    // Always start action plan on a new page for better organization
    addNewPage();
    yPosition = margin;

    doc.setTextColor(BRAND_COLOR);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Your 12-Month Action Plan', margin, yPosition);
    yPosition += 12;

    doc.setDrawColor(BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const months = parseActionPlan(data.actionPlan);

    months.forEach((month, monthIndex) => {
      // Check if we need a new page for this month
      if (yPosition > pageHeight - margin - 80) {
        addNewPage();
        yPosition = margin;
      }

      // Add spacing between months (16pt space)
      if (monthIndex > 0) {
        yPosition += 6;
      }

      const cleanTitle = stripMarkdown(month.title);
      const cleanDate = stripMarkdown(month.date);

      // Month header - 16pt bold
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(BRAND_COLOR);
      doc.text(`Month ${month.number}: ${cleanTitle}`, margin, yPosition);
      yPosition += 8;

      // Date subtitle - 12pt
      if (cleanDate) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(LIGHT_TEXT_COLOR);
        doc.text(cleanDate, margin, yPosition);
        yPosition += 7;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(TEXT_COLOR);

      // SMART Goal section - 11pt
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
          yPosition += 5.5;
        });
        yPosition += 3;
      }

      // Weekly breakdown section - 10pt
      if (month.weeks.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Weekly Breakdown:', margin + 5, yPosition);
        yPosition += 5.5;
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
        yPosition += 3;
      }

      // Monthly check-in section - 10pt italic
      if (month.checkin) {
        const cleanCheckin = stripMarkdown(month.checkin);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(TEXT_COLOR);
        doc.text('Monthly Check-in:', margin + 5, yPosition);
        yPosition += 5.5;

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
