'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css';
import jsPDF from 'jspdf';
import { MuiMarkdown, getOverrides } from 'mui-markdown';

const CustomH1 = (props) => (
  <header style={{ fontSize: '35px', padding: '20px 0' }}>
    <hr style={{ border: '1px solid white', margin: '20px 0' }} />
    {props.children}
  </header>
);

const CustomH2 = (props) => (
  <header style={{ fontSize: '30px', padding: '10px 0' }}>
    {props.children}
  </header>
);

const CustomH3 = (props) => (
  <header style={{ fontSize: '20px', padding: '10px 0' }}>
    {props.children}
  </header>
);

const CustomP = (props) => (
  <p style={{ fontSize: '16px', lineHeight: '1.5', padding: '10px 0' }}>
    {props.children}
  </p>
);


const ApiData = ({ apiData }) => {
  const [loading, setLoading] = useState(false);

  const extractTextContent = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    const textNodes = [];
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE || node.nodeName.toLowerCase() === 'a') {
        // if (parentElement.nodeName.toLowerCase() === 'a') {

        textNodes.push(node);
      }
    }
    return textNodes;
  };

  const handleExport = async (fileName) => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 10;
      let yPosition = margin;
      const lineHeightMap = { H1: 16 * 1.2, H2: 14 * 1.2, H3: 12 * 1.2 };

      const element = document.querySelector('div.w-full');
      const nodes = extractTextContent(element);
      // console.log(nodes)
      // console.log(" nnode:", nodes)     
      const width_occupied = 10 

      nodes.forEach((node) => {
        const textContent = node.textContent.trim();
        if (!textContent) return;

        const parentElement = node.parentNode;
        const style = window.getComputedStyle(parentElement);
        const fontSize = lineHeightMap[parentElement.nodeName] || 10 * 1.2;
        const fontFamily = style.fontFamily;

        doc.setFont(fontFamily);
        doc.setFontSize(fontSize);

        // Process links differently
        if (parentElement.nodeName.toLowerCase() === 'a') {
          console.log("entered")
          const url = parentElement.getAttribute('href');
          doc.setTextColor(0, 0, 255);
          const lineHeight = Math.floor(fontSize);
          // if (yPosition + lineHeight > pageHeight - margin) {
          //   doc.addPage();
          //   yPosition = margin;
          // }
          doc.textWithLink(textContent, margin, yPosition, { url });
          // const lines = doc.splitTextToSize(textContent, pageWidth - margin * 2);

          // lines.forEach((line) => {
          //   if (yPosition + lineHeight > pageHeight - margin) {
          //     doc.addPage();
          //     yPosition = margin;
          //   }
          //   doc.textWithLink(line, margin, yPosition, { url });
          //   yPosition += lineHeight;
          // });
        } else {
          // Handle regular text
          const textLines = doc.splitTextToSize(textContent, pageWidth - margin * 2);
          textLines.forEach((line) => {
            if (yPosition + fontSize > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.setTextColor(0, 0, 0);
            doc.text(line, margin, yPosition);
            yPosition += fontSize;
          });
        }

        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(parentElement.nodeName)) {
          yPosition += fontSize;
        }
      });

      doc.save(fileName || 'export.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to export PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markdownContent = (() => {
    try {
      const parsedBody = JSON.parse(apiData.body);
      return parsedBody.summary || apiData.body;
    } catch {
      return apiData.body;
    }
  })();

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MuiMarkdown
          overrides={{
            ...getOverrides({}),
            h1: {
              component: CustomH1,
            },
            h2: {
              component: CustomH2,
            },
            h3: {
              component: CustomH3,
            },
            p: {
              component: CustomP,
            },
          }}
          className="markdown-body"
        >
          {markdownContent}
        </MuiMarkdown>
      </div>
      <div className="p-4 flex justify-end">
        <button
          onClick={() => handleExport('export.pdf')}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Generating PDF...' : 'Export to PDF'}
        </button>
      </div>
    </div>
  );
};

export default ApiData;