import React, { useState, useRef } from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { UploadIcon } from './icons/UploadIcon';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the PDF.js worker using Vite's asset handling
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface DesireInputFormProps {
  description: string;
  setDescription: (description: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const DesireInputForm: React.FC<DesireInputFormProps> = ({ description, setDescription, onAnalyze, isLoading }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setDescription('');

    try {
      let text = '';
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => (item as { str: string }).str).join(' ');
          fullText += pageText + '\n';
        }
        text = fullText;
      } else {
        throw new Error('Unsupported file type. Please upload a .txt or .pdf file.');
      }
      setDescription(text);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError(error instanceof Error ? error.message : 'Failed to read file.');
    } finally {
      setIsUploading(false);
      // Reset file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-surface dark:bg-dark-surface border border-border-primary dark:border-dark-border-primary rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-content-primary dark:text-dark-content-primary flex items-center gap-3">
        <span className="text-oracle-red">1.</span>
        <span className="uppercase tracking-wider">Project Briefing</span>
      </h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Provide a detailed blueprint of your project: product summary, tech stack, features, and build procedures..."
        className="w-full h-48 p-4 bg-white dark:bg-dark-background border border-border-secondary dark:border-dark-border-secondary rounded-md shadow-inner focus:ring-2 focus:ring-oracle-red/50 focus:border-oracle-red transition duration-300 text-content-primary dark:text-dark-content-primary resize-y placeholder:text-gray-400 dark:placeholder:text-dark-content-secondary"
        disabled={isLoading || isUploading}
      />
      
      <div className="my-6 flex items-center gap-4">
        <hr className="w-full border-t border-border-primary dark:border-dark-border-secondary" />
        <span className="text-content-secondary dark:text-dark-content-secondary text-xs font-medium uppercase">Or</span>
        <hr className="w-full border-t border-border-primary dark:border-dark-border-secondary" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,.pdf"
          className="hidden"
          disabled={isLoading || isUploading}
        />
        <button
          onClick={handleUploadClick}
          disabled={isLoading || isUploading}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-surface dark:bg-dark-surface border border-border-secondary dark:border-dark-border-secondary text-content-primary dark:text-dark-content-primary font-medium rounded-md shadow-sm hover:border-oracle-red hover:text-oracle-red dark:hover:border-oracle-red dark:hover:text-oracle-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <UploadIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Upload Document
            </>
          )}
        </button>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !description || isUploading}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-oracle-red text-white font-medium uppercase tracking-wider rounded-md shadow-md hover:bg-oracle-red-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <BrainCircuitIcon className="w-6 h-6" />
              Analyze Project
            </>
          )}
        </button>
      </div>
      {uploadError && (
        <p className="text-sm text-danger mt-4 text-center">{uploadError}</p>
      )}
    </section>
  );
};
