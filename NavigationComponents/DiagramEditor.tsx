import React, { useRef, useEffect, useState } from 'react';
import { Toolbar } from './Toolbar';
import { MainNavbar } from './MainNavbar';
import { SecondaryPanel } from './SecondaryPanel';
import { Canvas } from './Canvas';
import { useEditorStore } from '../store/editorStore';

interface DiagramEditorProps {
  initialSection?: string;
  onBackToNavigation?: () => void;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({ 
  initialSection, 
  onBackToNavigation 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvasSize, setLoading } = useEditorStore();
  const [activeSection, setActiveSection] = useState<string | null>(initialSection || null);

  // Sections that should show the canvas
  const sectionsWithCanvas = ['shapes', 'diagrams', 'save', 'export', 'share', 'ai'];
  const shouldShowCanvas = activeSection && sectionsWithCanvas.includes(activeSection);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && shouldShowCanvas) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Account for main navbar (64px) + secondary panel (256px) + toolbar (60px)
        setCanvasSize({ width: width - 320, height: height - 60 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    setLoading(false);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [setCanvasSize, setLoading, shouldShowCanvas]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div ref={containerRef} className="flex-1 flex bg-gray-100">
      {/* Main Navigation Sidebar - Always visible */}
      <MainNavbar 
        activeSection={activeSection || ''} 
        onSectionChange={handleSectionChange}
        onBackToNavigation={onBackToNavigation}
      />
      
      {/* Secondary Panel - Show when a section is selected */}
      {activeSection && (
        <SecondaryPanel activeSection={activeSection} />
      )}

      {/* Canvas Area - Show for specific sections including AI */}
      {shouldShowCanvas && (
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <div className="flex-1 relative bg-white border border-gray-300 m-2 rounded shadow-sm">
            <Canvas />
          </div>
        </div>
      )}
      
      {/* Welcome/Initial State - Show when no section is selected */}
      {!activeSection && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-8">
              <svg 
                className="mx-auto h-24 w-24 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to DrawFlow</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Select a feature from the sidebar to get started. Create diagrams with AI assistance, 
              use shape libraries, manage your diagrams, and more.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                onClick={() => handleSectionChange('shapes')}
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl mb-2">⬛</div>
                <div className="font-medium">Start with Shapes</div>
              </button>
              <button
                onClick={() => handleSectionChange('ai')}
                className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-medium">Try AI Assistant</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};