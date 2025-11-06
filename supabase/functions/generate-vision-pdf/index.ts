import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VisionPDFRequest {
  name: string;
  areaOfLife: string;
  visionNarrative: string;
  actionPlan: string;
  createdDate: string;
  visionDate: string;
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
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

function addContentPages(
  pdfDoc: any,
  title: string,
  content: string,
  fontBold: any,
  fontRegular: any
) {
  const pageWidth = 612; // Letter size
  const pageHeight = 792;
  const margin = 50;
  const maxWidth = pageWidth - (margin * 2);
  const lineHeight = 11 * 1.5;
  const headerSize = 18;
  const bodySize = 11;
  const tealColor = rgb(0.13, 0.55, 0.55); // Teal color

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  // Add header
  page.drawText(title, {
    x: margin,
    y: yPosition,
    size: headerSize,
    font: fontBold,
    color: tealColor,
  });

  yPosition -= headerSize * 2;

  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim());

  for (const paragraph of paragraphs) {
    const lines = wrapText(paragraph, maxWidth, fontRegular, bodySize);

    for (const line of lines) {
      // Check if we need a new page
      if (yPosition < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }

      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: bodySize,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
    }

    // Add paragraph spacing
    yPosition -= lineHeight * 0.5;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, areaOfLife, visionNarrative, actionPlan, createdDate, visionDate }: VisionPDFRequest = await req.json();

    // Validate inputs
    if (!name || !areaOfLife || !visionNarrative || !actionPlan || !createdDate || !visionDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch the PDF cover template from CDN
    const coverResponse = await fetch('https://inner-edge.b-cdn.net/Vision-Cover.pdf');
    
    if (!coverResponse.ok) {
      throw new Error(`Failed to fetch cover template: ${coverResponse.statusText}`);
    }

    const coverBytes = await coverResponse.arrayBuffer();

    // Load the cover PDF
    const pdfDoc = await PDFDocument.load(coverBytes);
    const coverPage = pdfDoc.getPage(0);
    const { width, height } = coverPage.getSize();

    // Embed fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add dynamic text to cover (centered, white color for teal background)
    
    // Name's Vision
    const nameText = `${name}'s Vision`;
    const nameSize = 32;
    const nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);

    coverPage.drawText(nameText, {
      x: (width - nameWidth) / 2,
      y: height - 380,
      size: nameSize,
      font: fontBold,
      color: rgb(1, 1, 1), // white
    });

    // Area of Life subtitle
    const areaText = `${areaOfLife} - 1 Year Vision`;
    const areaSize = 18;
    const areaWidth = fontRegular.widthOfTextAtSize(areaText, areaSize);

    coverPage.drawText(areaText, {
      x: (width - areaWidth) / 2,
      y: height - 420,
      size: areaSize,
      font: fontRegular,
      color: rgb(1, 1, 1),
    });

    // Created date
    const createdText = `Created: ${createdDate}`;
    const createdSize = 12;
    const createdWidth = fontRegular.widthOfTextAtSize(createdText, createdSize);

    coverPage.drawText(createdText, {
      x: (width - createdWidth) / 2,
      y: 220,
      size: createdSize,
      font: fontRegular,
      color: rgb(1, 1, 1),
    });

    // Vision date
    const visionDateText = `Vision Date: ${visionDate}`;
    const visionDateWidth = fontRegular.widthOfTextAtSize(visionDateText, createdSize);

    coverPage.drawText(visionDateText, {
      x: (width - visionDateWidth) / 2,
      y: 200,
      size: createdSize,
      font: fontRegular,
      color: rgb(1, 1, 1),
    });

    // Add Vision Narrative page(s)
    addContentPages(
      pdfDoc,
      'Your Vision Narrative',
      visionNarrative,
      fontBold,
      fontRegular
    );

    // Add Action Plan page(s)
    addContentPages(
      pdfDoc,
      'Your 12-Month Action Plan',
      actionPlan,
      fontBold,
      fontRegular
    );

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Generate filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedArea = areaOfLife.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStamp = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedName}_Vision_${sanitizedArea}_${dateStamp}.pdf`;

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate PDF', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});