import React, { useRef, useEffect, useState } from 'react';
import { Toolbar } from './Toolbar';
import { ShapeLibrary } from './ShapeLibrary';
import { Canvas } from './Canvas';
import { useEditorStore } from '../store/editorStore';

export const DiagramEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvasSize, setLoading } = useEditorStore();
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const leftWidth = leftPanelCollapsed ? 40 : 256;
        setCanvasSize({ width: width - leftWidth, height: height - 60 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    setLoading(false);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [setCanvasSize, setLoading, leftPanelCollapsed]);

  return (
    <div ref={containerRef} className="flex-1 flex bg-gray-100">
      <div className={`${leftPanelCollapsed ? 'w-10' : 'w-64'} bg-white border-r border-gray-300 flex flex-col shadow-sm transition-all duration-300`}>
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          {!leftPanelCollapsed && <h3 className="text-sm font-medium text-gray-800">Shapes</h3>}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={leftPanelCollapsed ? 'Expand Shapes Panel' : 'Collapse Shapes Panel'}
          >
            ←
          </button>
        </div>
        
        {!leftPanelCollapsed && <ShapeLibrary />}
        
        {leftPanelCollapsed && (
          <div className="flex flex-col items-center p-2 space-y-2">
            <div className="w-6 h-6 bg-gray-200 rounded">□</div>
            <div className="w-6 h-6 bg-gray-200 rounded">○</div>
            <div className="w-6 h-6 bg-gray-200 rounded">△</div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <Toolbar />
        <div className="flex-1 relative bg-white border border-gray-300 m-2 rounded shadow-sm">
          <Canvas />
        </div>
      </div>
    </div>
  );
};