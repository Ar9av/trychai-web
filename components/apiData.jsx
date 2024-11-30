'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css';
import jsPDF from 'jspdf';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { MuiMarkdown, getOverrides } from 'mui-markdown';

function customSplitTextToSize(doc, textContent, pageWidth, margin, widthOccupied) {
  // Calculate the widths
  const availableWidthFirstLine = pageWidth - margin * 2 - widthOccupied;
  const availableWidthOtherLines = pageWidth - margin * 2;

  // Initialize variables
  let lines = [];
  let currentLine = '';
  let isFirstLine = true;

  // Split the text content into segments by newline
  const segments = textContent.split('\n');

  segments.forEach(segment => {
    // Split each segment into words
    const words = segment.split(' ');

    // Loop through words and construct lines
    words.forEach(word => {
      // Determine the available width for the current line
      const currentAvailableWidth = isFirstLine ? availableWidthFirstLine : availableWidthOtherLines;

      // Check if adding the word would exceed the available width
      const widthAfterAddingWord = doc.getStringUnitWidth(currentLine === '' ? word : currentLine + ' ' + word) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      if (widthAfterAddingWord <= currentAvailableWidth) {
        // Add the word to the current line
        if (currentLine.length > 0) {
          currentLine += ' ';
        }
        currentLine += word;
      } else {
        // Push the current line to the array of lines
        lines.push(currentLine);
        // Start a new line with the current word
        currentLine = word;
        // Subsequent lines should use the other lines width
        isFirstLine = false;
      }
    });

    // After processing each segment, push the current line to the lines and reset it
    lines.push(currentLine);
    currentLine = '';
    isFirstLine = false;
  });

  // In case there's any leftover text in the current line, push it to the lines
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

const CustomHeader = (props) => (
  <header style={{ fontSize: '25px', padding: '10px 0' }}>
    <hr style={{ border: '1px solid white', margin: '20px 0' }} />
    {props.children}
  </header>
);

const CustomH1 = (props) => (
  <header style={{ fontSize: '35px', padding: '20px 0', fontWeight: 'bold' }}>
    <hr style={{ border: '1px solid white', margin: '20px 0' }} />
    {props.children}
  </header>
);

const CustomH2 = (props) => (
  <header style={{ fontSize: '30px', padding: '10px 0', fontWeight: 'bold' }}>
    {props.children}
  </header>
);

const CustomH3 = (props) => (
  <header style={{ fontSize: '20px', padding: '10px 0', fontWeight: 'bold' }}>
    {props.children}
  </header>
);

const CustomH4 = (props) => (
  <header style={{ fontSize: '18px', padding: '10px 0' }}>
    <hr style={{ border: '1px solid white', margin: '20px 0' }} />
    {props.children}
  </header>
);

const CustomP = (props) => (
  <p style={{ fontSize: '16px', lineHeight: '1.5', padding: '10px 0' }}>
    {props.children}
  </p>
);

const lineHeightMap = {
  HEADER: { size: 16 * 1.2, lineHeight: 16 * 1.2 * 1.2, style: 'bold' },
  H1: { size: 16 * 1.2, lineHeight: 16 * 1.2 * 1.2, style: 'bold' },
  H2: { size: 14 * 1.2, lineHeight: 14 * 1.2 * 1.2, style: 'bold' },
  H3: { size: 12 * 1.2, lineHeight: 12 * 1.2 * 1.2, style: 'bold' },
  P: { size: 10 * 1.2, lineHeight: 10 * 1.2 * 1.2, style: 'normal' },
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ApiData = ({ apiData }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const extractTextContent = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    const textNodes = [];
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE || node.nodeName.toLowerCase() === 'a') {
        textNodes.push(node);
      }
    }
    return textNodes;
  };

  function addWaterMark(doc) {
    var totalPages = doc.internal.getNumberOfPages();
    var i = 1;
    for (i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(190);
      doc.text(150, doc.internal.pageSize.height - 10, 'Generated with TryChai.io');
    }
  
    return doc;
  }

  const handleExport = async (fileName) => {
    setLoading(true);
    try {
      var doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 10;
      let yPosition = 10;
      const element = document.getElementById('api-data-container');
      const nodes = extractTextContent(element);

      let width_occupied = 10 
      let prev_element_is_a = false;

      nodes.forEach((node) => {
        const textContent = node.textContent.trim();
        if (!textContent) return;

        const parentElement = node.parentNode;
        const style = window.getComputedStyle(parentElement);
        const fontFamily = style.fontFamily;
        const tagName = parentElement.nodeName.toUpperCase();
        const { size: fontSize, lineHeight: lineHeight, style: fontStyle } = lineHeightMap[tagName] || lineHeightMap.P;

        doc.setFont(fontStyle);
        doc.setFontSize(fontSize);

        if (parentElement.nodeName.toLowerCase() === 'a') {
          const url = parentElement.getAttribute('href');
          doc.setTextColor(0, 0, 255);
          const lineHeight = fontSize === 12 ? 7 : Math.floor(fontSize);
          const fullText = textContent;
          const textWidth = doc.getTextWidth(fullText);
          if (textWidth < (pageWidth - margin - width_occupied)) {
            doc.textWithLink(fullText, width_occupied + 1, yPosition, { url });
            width_occupied += textWidth + 1;
          } else {
            yPosition += lineHeight;
            if (yPosition + lineHeight > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.textWithLink(fullText, margin, yPosition, { url });
            width_occupied += textWidth;
          }
          prev_element_is_a = true;
        } else {
          const lineHeight = fontSize === 12 ? 7 : Math.floor(fontSize);
          const textLines = customSplitTextToSize(doc, textContent, pageWidth, margin, width_occupied)
          textLines.forEach((line) => {
            if ((doc.getTextWidth(line) < pageWidth - margin - width_occupied) && prev_element_is_a) {
              doc.setTextColor(0, 0, 0);
              doc.text(line, width_occupied, yPosition);
              width_occupied += doc.getTextWidth(line);
              prev_element_is_a = false;
            }
            else {
              width_occupied = margin;
              yPosition += lineHeight;
              if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              doc.setTextColor(0, 0, 0);
              doc.text(line, width_occupied, yPosition);
              width_occupied += doc.getTextWidth(line);
              prev_element_is_a = false;
            }
          });
        }
      });
      doc = addWaterMark(doc);
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

  const md5 = (() => {
    try {
      return apiData.payload_md5;
    } catch {
      return null;
    }
  })();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div id="api-data-container" className="relative flex flex-col w-full h-screen mx-auto">
      <div className="absolute top-4 right-4 flex space-x-2">
        <IconButton aria-label="share" onClick={() => { 
          const link = window.location.href.includes('reports') ? window.location.href : `${window.location.origin}/reports/${md5}`; 
          navigator.clipboard.writeText(link).then(() => {
            setSnackbarOpen(true);
          }).catch(err => {
            console.error("Failed to copy link:", err);
          });
        }}>
          <ShareIcon />
        </IconButton>

        <IconButton aria-label="download" onClick={() => handleExport('export.pdf')}>
          <DownloadIcon />
        </IconButton>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-0 text-left">
        <MuiMarkdown
          overrides={{
            ...getOverrides({}),
            header: {
              component: CustomHeader,
            },
            h1: {
              component: CustomH1,
            },
            h2: {
              component: CustomH2,
            },
            h3: {
              component: CustomH3,
            },
            h4: {
              component: CustomH4,
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ backgroundColor: '#333', color: '#fff' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ApiData;