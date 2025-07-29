import { useState } from 'react';
import { DiagramEditor } from './components/DiagramEditor';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { useEditorStore } from './store/editorStore';
import { useAuthStore } from './store/authStore';
import { exportToPNG, exportToSVG, exportToJSON } from './utils/export';
import { exportToDOCX } from './utils/docxExport';

function App() {
  const { isAuthenticated, user, isLoading: authLoading, error: authError, login, signup, logout } = useAuthStore();
  const { isLoading, elements, clearAllElements, setZoom, toggleGrid, selectedElements, deleteElement } = useEditorStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  // Show landing page first
  if (showLanding) {
    return (
      <Landing onGetStarted={() => setShowLanding(false)} />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={login}
        onSignup={signup}
        isLoading={authLoading}
        error={authError || undefined}
      />
    );
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
      logout();
    }
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuAction = (action: string) => {
    setActiveMenu(null);
    
    switch (action) {
      case 'new':
        if (confirm('Create a new diagram? This will clear the current diagram.')) {
          clearAllElements();
        }
        break;
      case 'save':
        handleSave();
        break;
      case 'export-png':
        handleExport('png');
        break;
      case 'export-svg':
        handleExport('svg');
        break;
      case 'export-json':
        handleExport('json');
        break;
      case 'export-pdf':
        handleExport('pdf');
        break;
      case 'export-docx':
        handleExport('docx');
        break;
      case 'undo':
        // TODO: Implement undo functionality
        alert('Undo functionality coming soon!');
        break;
      case 'redo':
        // TODO: Implement redo functionality
        alert('Redo functionality coming soon!');
        break;
      case 'delete':
        if (selectedElements.length > 0) {
          selectedElements.forEach(id => deleteElement(id));
        }
        break;
      case 'select-all':
        // TODO: Implement select all
        alert('Select all functionality coming soon!');
        break;
      case 'zoom-in':
        setZoom(1.2);
        break;
      case 'zoom-out':
        setZoom(0.8);
        break;
      case 'zoom-fit':
        setZoom(1);
        break;
      case 'toggle-grid':
        toggleGrid();
        break;
      case 'bring-front':
        // TODO: Implement bring to front
        alert('Bring to front functionality coming soon!');
        break;
      case 'send-back':
        // TODO: Implement send to back
        alert('Send to back functionality coming soon!');
        break;
      case 'about':
        alert('DrawFlow - Professional Diagram Editor\nVersion 1.0\nBuilt with React, TypeScript, and Konva.js');
        break;
      case 'shortcuts':
        alert('Keyboard Shortcuts:\nDelete - Delete selected elements\nEscape - Clear selection\nCtrl+Z - Undo (coming soon)\nCtrl+Y - Redo (coming soon)');
        break;
    }
  };

  const handleSave = () => {
    const diagramData = {
      elements,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(diagramData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'png' | 'svg' | 'json' | 'pdf' | 'docx') => {
    try {
      let result: string;
      
      switch (format) {
        case 'png':
          result = await exportToPNG(elements);
          const link = document.createElement('a');
          link.download = 'diagram.png';
          link.href = result;
          link.click();
          break;
        case 'svg':
          result = await exportToSVG(elements);
          const svgBlob = new Blob([result], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const svgLink = document.createElement('a');
          svgLink.href = svgUrl;
          svgLink.download = 'diagram.svg';
          svgLink.click();
          URL.revokeObjectURL(svgUrl);
          break;
        case 'json':
          result = exportToJSON(elements);
          const jsonBlob = new Blob([result], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = 'diagram.json';
          jsonLink.click();
          URL.revokeObjectURL(jsonUrl);
          break;
        case 'pdf':
          // For now, convert to PNG and then to PDF using the browser's print functionality
          result = await exportToPNG(elements);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            // Open in new window for PDF printing
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Diagram Export</title>
                    <style>
                      body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                      img { max-width: 100%; max-height: 100%; object-fit: contain; }
                      @media print { body { margin: 0; } img { width: 100%; height: auto; } }
                    </style>
                  </head>
                  <body>
                    <img src="${result}" alt="Diagram" />
                    <script>
                      window.onload = () => {
                        setTimeout(() => {
                          window.print();
                        }, 500);
                      };
                    </script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }
          };
          img.src = result;
          break;
        case 'docx':
          // Export as proper DOCX using the docx library
          await exportToDOCX(elements);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const menuItems = {
    File: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      items: [
        { label: 'New', action: 'new' },
        { label: 'Save', action: 'save' },
        { label: 'Export as PNG', action: 'export-png' },
        { label: 'Export as SVG', action: 'export-svg' },
        { label: 'Export as JSON', action: 'export-json' },
        { label: 'Export as PDF', action: 'export-pdf' },
        { label: 'Export as DOCX', action: 'export-docx' },
      ]
    },
    Edit: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      items: [
        { label: 'Undo', action: 'undo' },
        { label: 'Redo', action: 'redo' },
        { label: 'Delete', action: 'delete' },
        { label: 'Select All', action: 'select-all' },
      ]
    },
    View: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      items: [
        { label: 'Zoom In', action: 'zoom-in' },
        { label: 'Zoom Out', action: 'zoom-out' },
        { label: 'Fit to Screen', action: 'zoom-fit' },
        { label: 'Toggle Grid', action: 'toggle-grid' },
      ]
    },
    Arrange: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      items: [
        { label: 'Bring to Front', action: 'bring-front' },
        { label: 'Send to Back', action: 'send-back' },
      ]
    },
    Extras: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      ),
      items: [
        { label: 'Keyboard Shortcuts', action: 'shortcuts' },
      ]
    },
    Help: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
      ),
      items: [
        { label: 'About DrawFlow', action: 'about' },
      ]
    },
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100" onClick={() => setActiveMenu(null)}>
      <header className="bg-white border-b border-gray-300 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-gray-800">DrawFlow</h1>
            <div className="flex items-center space-x-1 text-sm text-gray-600 relative">
              {Object.entries(menuItems).map(([menuName, menuData]) => (
                <div key={menuName} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(menuName);
                    }}
                    className={`flex items-center hover:text-blue-600 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors ${
                      activeMenu === menuName ? 'bg-gray-100 text-blue-600' : ''
                    }`}
                  >
                    {menuData.icon}
                    <span className="ml-2">{menuName}</span>
                  </button>
                  {activeMenu === menuName && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-40">
                      {menuData.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuAction(item.action);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClick('Export');
                }}
                className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1 ${
                  activeMenu === 'Export' ? 'bg-gray-100' : ''
                }`}
              >
                <span>Export</span>
                <svg width="12" height="12" viewBox="0 0 12 12" className="ml-1">
                  <path fill="currentColor" d="M3 5L6 8L9 5H3Z"/>
                </svg>
              </button>
              {activeMenu === 'Export' && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('export-png');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('export-svg');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as SVG
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('export-json');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('export-pdf');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('export-docx');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 last:rounded-b-md"
                  >
                    Export as DOCX
                  </button>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClick('User');
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{user?.username || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${activeMenu === 'User' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeMenu === 'User' && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-48">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">Signed in</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                      setActiveMenu(null);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      ) : (
        <DiagramEditor />
      )}
    </div>
  );
}

export default App;
