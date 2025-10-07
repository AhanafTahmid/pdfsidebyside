import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file1 = formData.get('pdf1') as File;
    const file2 = formData.get('pdf2') as File;

    if (!file1 || !file2) {
      return NextResponse.json(
        { error: 'Please upload both PDF files' },
        { status: 400 }
      );
    }

    // Read the PDF files
    const pdf1ArrayBuffer = await file1.arrayBuffer();
    const pdf2ArrayBuffer = await file2.arrayBuffer();

    // Load PDFs
    const pdf1 = await PDFDocument.load(pdf1ArrayBuffer);
    const pdf2 = await PDFDocument.load(pdf2ArrayBuffer);

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Get page count (use minimum of both PDFs)
    const pageCount = Math.min(pdf1.getPageCount(), pdf2.getPageCount());

    for (let i = 0; i < pageCount; i++) {
      // Get original pages
      const page1 = pdf1.getPage(i);
      const page2 = pdf2.getPage(i);

      // Get original page dimensions
      const { width: width1, height: height1 } = page1.getSize();
      const { width: width2, height: height2 } = page2.getSize();

      // Calculate dimensions for the merged page
      const maxHeight = Math.max(height1, height2);
      const totalWidth = width1 + width2;

      // Embed the first PDF as an entire document
      const [embeddedPdf1] = await mergedPdf.embedPdf(pdf1, [i]);
      const [embeddedPdf2] = await mergedPdf.embedPdf(pdf2, [i]);

      // Create a new page with combined width
      const mergedPage = mergedPdf.addPage([totalWidth, maxHeight]);

      // Draw first PDF page on the left
      mergedPage.drawPage(embeddedPdf1, {
        x: 0,
        y: maxHeight - height1,
        width: width1,
        height: height1,
      });

      // Draw second PDF page on the right
      mergedPage.drawPage(embeddedPdf2, {
        x: width1,
        y: maxHeight - height2,
        width: width2,
        height: height2,
      });
    }

    // Generate the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Convert to Buffer for Next.js response
    const buffer = Buffer.from(mergedPdfBytes);

    // Return the PDF as a response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged_translation.pdf"',
      },
    });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    );
  }
}