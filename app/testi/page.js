'use client';

import { useState } from 'react';

export default function PDFExport() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    
    try {
      // Only import and use html2pdf on the client side
      if (typeof window !== 'undefined') {
        const element = document.getElementById('content-to-export');
        // Dynamic import of html2pdf
        const html2pdf = (await import('html2pdf.js')).default;
        
        const opt = {
          margin: 1,
          filename: 'myfile.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div id="content-to-export" className="mb-4">
        <h1 className="text-2xl font-bold mb-4">My PDF Document</h1>
        <p className="mb-2">This is a sample document that will be exported to PDF.</p>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl mb-2">Some Sample Content</h2>
          <p>This content will be included in the PDF export.</p>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Generating PDF...' : 'Export to PDF'}
      </button>
    </div>
  );
}