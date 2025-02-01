declare module 'pdfjs-dist/legacy/build/pdf.js' {
  const pdfjsLib: {
    getDocument: (data: Uint8Array) => PDFDocumentLoadingTask;
    GlobalWorkerOptions: {
      workerSrc: string;
      workerPort: any;
    };
  };

  interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getTextContent: () => Promise<{
      items: Array<{
        str: string;
        [key: string]: any;
      }>;
    }>;
  }

  export = pdfjsLib;
}

declare module 'pdfjs-dist/legacy/build/pdf.worker.js' {
  const worker: any;
  export default worker;
} 