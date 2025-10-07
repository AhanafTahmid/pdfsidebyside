'use client';

import React, { useState } from 'react';

interface PdfUploaderProps {
  onFilesSelected: (files: { pdf1: File | null; pdf2: File | null }) => void;
  isLoading: boolean;
}

export default function PdfUploader({ onFilesSelected, isLoading }: PdfUploaderProps) {
  const [pdf1, setPdf1] = useState<File | null>(null);
  const [pdf2, setPdf2] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<number | null>(null);

  const handleFileChange = (file: File | null, pdfNumber: 1 | 2) => {
    if (file && file.type !== 'application/pdf') {
      alert('Please select only PDF files');
      return;
    }

    if (pdfNumber === 1) {
      setPdf1(file);
      onFilesSelected({ pdf1: file, pdf2 });
    } else {
      setPdf2(file);
      onFilesSelected({ pdf1, pdf2: file });
    }
  };

  const handleDrag = (e: React.DragEvent, pdfNumber: 1 | 2) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(pdfNumber);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, pdfNumber: 1 | 2) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0], pdfNumber);
    }
  };

  const UploadArea = ({ pdfNumber, file, label }: { pdfNumber: 1 | 2; file: File | null; label: string }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive === pdfNumber
            ? 'border-slate-400 bg-slate-50 scale-[1.02]'
            : file
            ? 'border-green-300 bg-green-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={(e) => handleDrag(e, pdfNumber)}
        onDragLeave={(e) => handleDrag(e, pdfNumber)}
        onDragOver={(e) => handleDrag(e, pdfNumber)}
        onDrop={(e) => handleDrop(e, pdfNumber)}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null, pdfNumber)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        <div className="space-y-4">
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700 mb-1">{file.name}</p>
              <p className="text-xs text-green-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Drop your PDF here, or{' '}
                <span className="text-slate-900 underline">click to browse</span>
              </p>
              <p className="text-xs text-slate-500">PDF files only, up to 10MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <UploadArea 
          pdfNumber={1} 
          file={pdf1} 
          label="First PDF (Left Side)" 
        />
        <UploadArea 
          pdfNumber={2} 
          file={pdf2} 
          label="Second PDF (Right Side)" 
        />
      </div>
      
      {(pdf1 || pdf2) && (
        <div className="text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            pdf1 && pdf2 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {pdf1 && pdf2 ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Both files ready for merging
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.994-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Please select both PDF files to continue
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}