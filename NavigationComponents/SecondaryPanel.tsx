import React, { useState } from 'react';
import { ShapeLibrary } from './ShapeLibrary';
import { AIChatbox } from './AIChatbox';

interface SecondaryPanelProps {
  activeSection: string;
}

export const SecondaryPanel: React.FC<SecondaryPanelProps> = ({ activeSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderPanelContent = () => {
    switch (activeSection) {
      case 'ai':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">AI Assistant</h3>
            </div>
            <AIChatbox />
          </div>
        );
        
      case 'shapes':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Shapes</h3>
            </div>
            <ShapeLibrary />
          </div>
        );
        
      case 'diagrams':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Diagrams</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm">Untitled Diagram 1</div>
                  <div className="text-xs text-gray-500">Modified 2 hours ago</div>
                </div>
                <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm">AWS Architecture</div>
                  <div className="text-xs text-gray-500">Modified 1 day ago</div>
                </div>
                <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm">System Design</div>
                  <div className="text-xs text-gray-500">Modified 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'save':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Save Options</h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Save Diagram
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Save As Template
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Auto-save: ON
              </button>
            </div>
          </div>
        );
        
      case 'export':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Export</h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-left">
                📄 Export as PNG
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-left">
                📄 Export as SVG
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-left">
                📄 Export as PDF
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-left">
                📄 Export as DOCX
              </button>
            </div>
          </div>
        );
        
      case 'share':
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Share</h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Generate Share Link
              </button>
              <button className="w-full p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Invite Collaborators
              </button>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-2">Current Permission</div>
                <div className="text-sm font-medium">View Only</div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-800">Shapes</h3>
            </div>
            <ShapeLibrary />
          </div>
        );
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-300 flex flex-col shadow-sm">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 hover:bg-gray-100 rounded transition-colors text-center"
          title="Expand Panel"
        >
          →
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-300 flex flex-col shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Collapse Panel"
        >
          ←
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
};
