import React from 'react';
import { useEditorStore } from '../store/editorStore';

export const PropertiesPanel: React.FC = () => {
  const { elements, selectedElements, updateElement, deleteElement } = useEditorStore();
  
  const selectedElement = selectedElements.length === 1 
    ? elements.find((el: any) => el.id === selectedElements[0])
    : null;

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElement) {
      if (property.startsWith('style.')) {
        const styleProp = property.replace('style.', '');
        updateElement(selectedElement.id, {
          style: { ...selectedElement.style, [styleProp]: value }
        });
      } else if (property.startsWith('properties.')) {
        const prop = property.replace('properties.', '');
        updateElement(selectedElement.id, {
          properties: { ...selectedElement.properties, [prop]: value }
        });
      } else {
        updateElement(selectedElement.id, { [property]: value });
      }
    }
  };

  const handleDuplicate = () => {
    if (selectedElement) {
      const newElement = {
        ...selectedElement,
        x: selectedElement.x + 20,
        y: selectedElement.y + 20,
        properties: { ...selectedElement.properties },
        style: { ...selectedElement.style },
      };
      delete (newElement as any).id; // Remove id so store generates new one
      useEditorStore.getState().addElement(newElement);
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Properties</h3>
        <div className="text-sm text-gray-600">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Properties</h3>
      
      {/* Basic Properties */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-300 rounded p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Position & Size</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Style Properties */}
        <div className="panel p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Appearance</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fill Color</label>
              <input
                type="color"
                value={selectedElement.style.fill || '#ffffff'}
                onChange={(e) => handlePropertyChange('style.fill', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stroke Color</label>
              <input
                type="color"
                value={selectedElement.style.stroke || '#000000'}
                onChange={(e) => handlePropertyChange('style.stroke', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stroke Width</label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={selectedElement.style.strokeWidth || 1}
                onChange={(e) => handlePropertyChange('style.strokeWidth', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedElement.style.opacity || 1}
                onChange={(e) => handlePropertyChange('style.opacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        <div className="panel p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Text</h4>
          <textarea
            value={selectedElement.properties.text || ''}
            onChange={(e) => handlePropertyChange('properties.text', e.target.value)}
            placeholder="Enter text..."
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="panel p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
          <div className="space-y-2">
            <button 
              onClick={handleDuplicate}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
            >
              Duplicate
            </button>
            <button 
              onClick={handleDelete}
              className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="panel p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Layer</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
              Bring Forward
            </button>
            <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
              Send Backward
            </button>
            <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
              Bring to Front
            </button>
            <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
              Send to Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
