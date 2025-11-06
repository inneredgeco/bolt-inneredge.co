import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface VisionPDFData {
  name: string;
  areaOfLife: string;
  visionNarrative: string;
  actionPlan: string;
  createdDate: string;
  visionDate: string;
}

const BRAND_COLOR_RGB = rgb(0.059, 0.463, 0.431); // #2d7471
const TEXT_COLOR_RGB = rgb(0.11, 0.098, 0.09); // #1c1917
const LIGHT_TEXT_COLOR_RGB = rgb(0.341, 0.325, 0.306); // #57534e

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

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export async function generateVisionPDF(data: VisionPDFData): Promise<void> {
  // Fetch pre-designed cover template
  const coverUrl = 'https://inner-edge.b-cdn.net/Vision-Cover.pdf';
  const coverResponse = await fetch(coverUrl);
  const coverBytes = await coverResponse.arrayBuffer();

  // Load cover PDF
  const pdfDoc = await PDFDocument.load(coverBytes);

  // Get cover page (first page)
  const coverPage = pdfDoc.getPage(0);
  const { width, height } = coverPage.getSize();

  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add dynamic text to cover
  // Name's Vision (centered)
  const nameText = `${data.name}'s Vision`;
  const nameSize = 32;
  const nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);

  coverPage.drawText(nameText, {
    x: (width - nameWidth) / 2,
    y: height - 380,
    size: nameSize,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  // Area of Life subtitle
  const areaText = `${data.areaOfLife} - 1 Year Vision`;
  const areaSize = 18;
  const areaWidth = fontRegular.widthOfTextAtSize(areaText, areaSize);

  coverPage.drawText(areaText, {
    x: (width - areaWidth) / 2,
    y: height - 420,
    size: areaSize,
    font: fontRegular,
    color: rgb(1, 1, 1)
  });

  // Created date
  const createdText = `Created: ${data.createdDate}`;
  const createdSize = 12;
  const createdWidth = fontRegular.widthOfTextAtSize(createdText, createdSize);

  coverPage.drawText(createdText, {
    x: (width - createdWidth) / 2,
    y: 220,
    size: createdSize,
    font: fontRegular,
    color: rgb(1, 1, 1)
  });

  // Vision date
  const visionDateText = `Vision Date: ${data.visionDate}`;
  const visionDateSize = 12;
  const visionDateWidth = fontRegular.widthOfTextAtSize(visionDateText, visionDateSize);

  coverPage.drawText(visionDateText, {
    x: (width - visionDateWidth) / 2,
    y: 200,
    size: visionDateSize,
    font: fontRegular,
    color: rgb(1, 1, 1)
  });

  // Add Vision Narrative page
  const narrativePage = pdfDoc.addPage();
  const pageSize = narrativePage.getSize();
  const margin = 50;
  const maxWidth = pageSize.width - (margin * 2);

  let currentPage = narrativePage;
  let yPosition = pageSize.height - margin;

  // Add "Your Vision Narrative" header
  currentPage.drawText('Your Vision Narrative', {
    x: margin,
    y: yPosition,
    size: 18,
    font: fontBold,
    color: BRAND_COLOR_RGB
  });

  yPosition -= 10;

  // Add horizontal line
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageSize.width - margin, y: yPosition },
    thickness: 2,
    color: BRAND_COLOR_RGB
  });

  yPosition -= 20;

  // Add vision narrative text with word wrapping
  const cleanNarrative = stripMarkdown(data.visionNarrative);
  const paragraphs = cleanNarrative.split('\n').filter((p) => p.trim());
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;

  for (const paragraph of paragraphs) {
    const processedParagraph = paragraph.trim();
    if (!processedParagraph) continue;

    const lines = wrapText(processedParagraph, fontRegular, fontSize, maxWidth);

    for (const line of lines) {
      if (yPosition < margin + 20) {
        currentPage = pdfDoc.addPage();
        yPosition = pageSize.height - margin;
      }

      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: fontRegular,
        color: TEXT_COLOR_RGB
      });

      yPosition -= lineHeight;
    }

    yPosition -= 8; // Paragraph spacing
  }

  // Add Action Plan pages
  currentPage = pdfDoc.addPage();
  yPosition = pageSize.height - margin;

  currentPage.drawText('Your 12-Month Action Plan', {
    x: margin,
    y: yPosition,
    size: 18,
    font: fontBold,
    color: BRAND_COLOR_RGB
  });

  yPosition -= 10;

  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageSize.width - margin, y: yPosition },
    thickness: 2,
    color: BRAND_COLOR_RGB
  });

  yPosition -= 20;

  // Parse and add action plan content
  const months = parseActionPlan(data.actionPlan);

  for (const month of months) {
    // Check if we need a new page for this month
    if (yPosition < margin + 100) {
      currentPage = pdfDoc.addPage();
      yPosition = pageSize.height - margin;
    }

    const cleanTitle = stripMarkdown(month.title);
    const cleanDate = stripMarkdown(month.date);

    // Month header
    const monthHeader = `Month ${month.number}: ${cleanTitle}`;
    currentPage.drawText(monthHeader, {
      x: margin,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: BRAND_COLOR_RGB
    });

    yPosition -= 18;

    // Date subtitle
    if (cleanDate) {
      currentPage.drawText(cleanDate, {
        x: margin,
        y: yPosition,
        size: 11,
        font: fontRegular,
        color: LIGHT_TEXT_COLOR_RGB
      });

      yPosition -= 16;
    }

    // SMART Goal
    if (month.goal) {
      const cleanGoal = stripMarkdown(month.goal);

      currentPage.drawText('SMART Goal:', {
        x: margin + 5,
        y: yPosition,
        size: 11,
        font: fontBold,
        color: TEXT_COLOR_RGB
      });

      yPosition -= 14;

      const goalLines = wrapText(cleanGoal, fontRegular, 10, maxWidth - 10);

      for (const goalLine of goalLines) {
        if (yPosition < margin + 20) {
          currentPage = pdfDoc.addPage();
          yPosition = pageSize.height - margin;
        }

        currentPage.drawText(goalLine, {
          x: margin + 5,
          y: yPosition,
          size: 10,
          font: fontRegular,
          color: TEXT_COLOR_RGB
        });

        yPosition -= 13;
      }

      yPosition -= 5;
    }

    // Weekly breakdown
    if (month.weeks.length > 0) {
      currentPage.drawText('Weekly Breakdown:', {
        x: margin + 5,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: TEXT_COLOR_RGB
      });

      yPosition -= 14;

      month.weeks.forEach((week, index) => {
        if (yPosition < margin + 20) {
          currentPage = pdfDoc.addPage();
          yPosition = pageSize.height - margin;
        }

        const cleanWeek = stripMarkdown(week);
        const weekText = `  • Week ${index + 1}: ${cleanWeek}`;
        const weekLines = wrapText(weekText, fontRegular, 10, maxWidth - 10);

        for (const weekLine of weekLines) {
          currentPage.drawText(weekLine, {
            x: margin + 5,
            y: yPosition,
            size: 10,
            font: fontRegular,
            color: TEXT_COLOR_RGB
          });

          yPosition -= 12;
        }
      });

      yPosition -= 5;
    }

    // Monthly check-in
    if (month.checkin) {
      const cleanCheckin = stripMarkdown(month.checkin);

      currentPage.drawText('Monthly Check-in:', {
        x: margin + 5,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: TEXT_COLOR_RGB
      });

      yPosition -= 14;

      const checkinLines = wrapText(cleanCheckin, fontRegular, 10, maxWidth - 10);

      for (const checkinLine of checkinLines) {
        if (yPosition < margin + 20) {
          currentPage = pdfDoc.addPage();
          yPosition = pageSize.height - margin;
        }

        currentPage.drawText(checkinLine, {
          x: margin + 5,
          y: yPosition,
          size: 10,
          font: fontRegular,
          color: LIGHT_TEXT_COLOR_RGB
        });

        yPosition -= 12;
      }

      yPosition -= 10;
    }

    yPosition -= 10; // Space between months
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();

  // Create download
  const nameParts = data.name.split(' ');
  const firstName = nameParts[0] || 'Vision';
  const lastName = nameParts.slice(1).join('_') || 'Document';
  const areaSlug = data.areaOfLife.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${firstName}_${lastName}_Vision_${areaSlug}_${dateStr}.pdf`;

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
