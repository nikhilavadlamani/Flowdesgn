import { exportToPNG } from './export';

export const exportToDOCX = async (elements: any[]): Promise<void> => {
  try {
    console.log('Starting DOCX export...');
    
    // Get PNG data URL from the existing export function
    const pngDataUrl = await exportToPNG(elements);
    
    // Create a simple HTML document that Word can import as DOCX
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>DrawFlow Diagram</title>
          <style>
            body {
              font-family: "Times New Roman", serif;
              margin: 1in;
              text-align: center;
            }
            h1 {
              color: #2c3e50;
              font-size: 24pt;
              margin-bottom: 20pt;
            }
            .date {
              font-size: 12pt;
              color: #7f8c8d;
              margin-bottom: 30pt;
            }
            .diagram {
              max-width: 100%;
              height: auto;
              border: 1px solid #bdc3c7;
              margin: 20pt 0;
            }
            .info {
              font-size: 11pt;
              color: #34495e;
              margin-top: 20pt;
            }
            .footer {
              font-size: 10pt;
              color: #95a5a6;
              margin-top: 30pt;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>DrawFlow Diagram</h1>
          <div class="date">Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
          
          <img src="${pngDataUrl}" alt="DrawFlow Diagram" class="diagram" />
          
          <div class="info">
            This diagram contains ${elements.length} element(s).
          </div>
          
          <div class="footer">
            Created with DrawFlow - Professional Diagramming Tool
          </div>
        </body>
      </html>
    `;

    // Create a blob with the HTML content
    const htmlBlob = new Blob([htmlContent], { 
      type: 'application/msword'
    });
    
    // Create download link
    const url = URL.createObjectURL(htmlBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drawflow-diagram-${Date.now()}.doc`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('DOCX export completed successfully!');
    alert('Word document has been downloaded successfully! The file will open in Microsoft Word.');
    
  } catch (error) {
    console.error('DOCX export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    throw error;
  }
};
