import React from 'react';
import { useEditorStore } from '../store/editorStore';

export const Toolbar: React.FC = () => {
  const { gridVisible, toggleGrid, zoom, setZoom } = useEditorStore();

  const zoomIn = () => {
    setZoom(zoom * 1.2);
  };

  const zoomOut = () => {
    setZoom(zoom / 1.2);
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="bg-white border-b border-gray-300 px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Grid Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleGrid}
              className={`toolbar-button ${gridVisible ? 'active' : ''}`}
              title="Toggle Grid"
            >
              #
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={zoomOut}
              className="toolbar-button"
              title="Zoom Out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="8" x2="14" y1="11" y2="11"/>
              </svg>
            </button>
            <button
              onClick={resetZoom}
              className="toolbar-button"
              title={`Zoom: ${Math.round(zoom * 100)}%`}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="toolbar-button"
              title="Zoom In"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="11" x2="11" y1="8" y2="14"/>
                <line x1="8" x2="14" y1="11" y2="11"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
