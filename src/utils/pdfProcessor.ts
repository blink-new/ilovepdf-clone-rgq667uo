import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import jsPDF from 'jspdf';

export interface ProcessingResult {
  success: boolean;
  file?: Blob;
  filename?: string;
  error?: string;
}

export class PDFProcessor {
  // Merge multiple PDFs into one
  static async mergePDFs(files: File[]): Promise<ProcessingResult> {
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        success: true,
        file: blob,
        filename: 'merged-document.pdf'
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to merge PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Split PDF into individual pages
  static async splitPDF(file: File, options: { startPage?: number; endPage?: number; extractPages?: number[] } = {}): Promise<ProcessingResult[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();
      
      const results: ProcessingResult[] = [];
      
      if (options.extractPages) {
        // Extract specific pages
        for (const pageNum of options.extractPages) {
          if (pageNum > 0 && pageNum <= totalPages) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1]);
            newPdf.addPage(copiedPage);
            
            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            results.push({
              success: true,
              file: blob,
              filename: `page-${pageNum}.pdf`
            });
          }
        }
      } else {
        // Split range or all pages
        const startPage = options.startPage || 1;
        const endPage = options.endPage || totalPages;
        
        for (let i = startPage; i <= endPage; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdf, [i - 1]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          
          results.push({
            success: true,
            file: blob,
            filename: `page-${i}.pdf`
          });
        }
      }
      
      return results;
    } catch (error) {
      return [{
        success: false,
        error: `Failed to split PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      }];
    }
  }

  // Compress PDF (basic compression by reducing quality)
  static async compressPDF(file: File, compressionLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<ProcessingResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // Basic compression by saving with different options
      const pdfBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 100 : 200
      });
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const originalSize = file.size;
      const compressedSize = blob.size;
      const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
      
      return {
        success: true,
        file: blob,
        filename: `compressed-${file.name}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Add watermark to PDF
  static async addWatermark(file: File, watermarkText: string, options: { opacity?: number; fontSize?: number; color?: string } = {}): Promise<ProcessingResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      
      const pages = pdf.getPages();
      const { opacity = 0.3, fontSize = 50, color = '#FF0000' } = options;
      
      // Convert hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : { r: 1, g: 0, b: 0 };
      };
      
      const rgbColor = hexToRgb(color);
      
      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        // Add watermark text diagonally across the page
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity,
          rotate: { type: 'degrees', angle: -45 }
        });
      });
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        success: true,
        file: blob,
        filename: `watermarked-${file.name}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to add watermark: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Rotate PDF pages
  static async rotatePDF(file: File, rotation: 90 | 180 | 270): Promise<ProcessingResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      
      pages.forEach(page => {
        page.setRotation({ type: 'degrees', angle: rotation });
      });
      
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        success: true,
        file: blob,
        filename: `rotated-${file.name}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to rotate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Convert images to PDF
  static async imagesToPDF(files: File[]): Promise<ProcessingResult> {
    try {
      const pdf = new jsPDF();
      let isFirstPage = true;
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate dimensions to fit image on page
        const imgAspectRatio = img.width / img.height;
        const pageAspectRatio = pageWidth / pageHeight;
        
        let imgWidth, imgHeight;
        if (imgAspectRatio > pageAspectRatio) {
          imgWidth = pageWidth;
          imgHeight = pageWidth / imgAspectRatio;
        } else {
          imgHeight = pageHeight;
          imgWidth = pageHeight * imgAspectRatio;
        }
        
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
        URL.revokeObjectURL(imageUrl);
        isFirstPage = false;
      }
      
      const pdfBlob = pdf.output('blob');
      
      return {
        success: true,
        file: pdfBlob,
        filename: 'converted-images.pdf'
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to convert images to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}