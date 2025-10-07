'use client';

import React, { useState } from 'react';
import PdfUploader from '../components/PdfUploader';

export default function Home() {
  const [files, setFiles] = useState<{ pdf1: File | null; pdf2: File | null }>({
    pdf1: null,
    pdf2: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedPdfData, setMergedPdfData] = useState<Blob | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFilesSelected = (selectedFiles: { pdf1: File | null; pdf2: File | null }) => {
    setFiles(selectedFiles);
    setError(null);
    setMergedPdfData(null);
    setIsSuccess(false);
  };

  const handleMergePdfs = async () => {
    if (!files.pdf1 || !files.pdf2) {
      setError('Please select both PDF files');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMergedPdfData(null);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append('pdf1', files.pdf1);
      formData.append('pdf2', files.pdf2);

      const response = await fetch('/api/merge-pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to merge PDFs');
      }

      // Store the merged PDF data
      const blob = await response.blob();
      setMergedPdfData(blob);
      setIsSuccess(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdfData) return;

    const url = window.URL.createObjectURL(mergedPdfData);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'merged_translation.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            PDF Side-by-Side Merger
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload two PDF files and merge them side by side into a single document. 
            Perfect for creating bilingual documents or comparing versions.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <PdfUploader 
            onFilesSelected={handleFilesSelected} 
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.53 10.53a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">PDFs merged successfully!</p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleMergePdfs}
              disabled={!files.pdf1 || !files.pdf2 || isLoading}
              className={`inline-flex items-center px-8 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                !files.pdf1 || !files.pdf2 || isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-500 shadow-sm hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Merge PDFs Side by Side
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">How it works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">1</span>
                  </div>
                  <p className="text-sm text-slate-700">Upload your first PDF file (appears on the left side)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">2</span>
                  </div>
                  <p className="text-sm text-slate-700">Upload your second PDF file (appears on the right side)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">3</span>
                  </div>
                  <p className="text-sm text-slate-700">Click "Merge PDFs Side by Side" to process</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">4</span>
                  </div>
                  <p className="text-sm text-slate-700">Download your merged PDF when ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}