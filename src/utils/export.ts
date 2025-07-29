import { DiagramElement, ExportOptions } from '../types';

export const exportToPNG = async (
  elements: DiagramElement[],
  options: ExportOptions = { format: 'png' }
): Promise<string> => {
  // Create a temporary canvas for export
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  const scale = options.scale || 1;
  const bounds = options.bounds || calculateBounds(elements);
  
  canvas.width = bounds.width * scale;
  canvas.height = bounds.height * scale;
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  
  // Render elements
  for (const element of elements) {
    await renderElementToCanvas(ctx, element, bounds);
  }
  
  return canvas.toDataURL('image/png', options.quality || 1);
};

export const exportToSVG = (elements: DiagramElement[]): string => {
  const bounds = calculateBounds(elements);
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}">`;
  
  for (const element of elements) {
    svg += renderElementToSVG(element, bounds);
  }
  
  svg += '</svg>';
  return svg;
};

export const exportToJSON = (elements: DiagramElement[]): string => {
  return JSON.stringify({
    version: '1.0',
    elements,
    metadata: {
      createdAt: new Date().toISOString(),
      software: 'DrawFlow',
    },
  }, null, 2);
};

const calculateBounds = (elements: DiagramElement[]) => {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const element of elements) {
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x + element.width);
    maxY = Math.max(maxY, element.y + element.height);
  }
  
  const padding = 20;
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + 2 * padding,
    height: maxY - minY + 2 * padding,
  };
};

const renderElementToCanvas = async (
  ctx: CanvasRenderingContext2D,
  element: DiagramElement,
  bounds: any
): Promise<void> => {
  const x = element.x - bounds.x;
  const y = element.y - bounds.y;
  
  ctx.save();
  ctx.translate(x + element.width / 2, y + element.height / 2);
  ctx.rotate((element.rotation * Math.PI) / 180);
  ctx.translate(-element.width / 2, -element.height / 2);
  
  ctx.fillStyle = element.style.fill || '#ffffff';
  ctx.strokeStyle = element.style.stroke || '#000000';
  ctx.lineWidth = element.style.strokeWidth || 1;
  ctx.globalAlpha = element.style.opacity || 1;
  
  switch (element.properties.shapeType) {
    case 'rectangle':
    case 'process':
    case 'terminator':
      ctx.fillRect(0, 0, element.width, element.height);
      ctx.strokeRect(0, 0, element.width, element.height);
      break;
      
    case 'circle':
    case 'usecase':
      const radius = Math.min(element.width, element.height) / 2;
      ctx.beginPath();
      ctx.arc(element.width / 2, element.height / 2, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'diamond':
    case 'decision':
      ctx.beginPath();
      ctx.moveTo(element.width / 2, 0);
      ctx.lineTo(element.width, element.height / 2);
      ctx.lineTo(element.width / 2, element.height);
      ctx.lineTo(0, element.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }
  
  // Render text
  if (element.properties.text) {
    ctx.fillStyle = '#333333';
    ctx.font = `${element.properties.fontSize || 14}px ${element.properties.fontFamily || 'Arial'}`;
    ctx.textAlign = element.properties.textAlign || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      element.properties.text,
      element.width / 2,
      element.height / 2
    );
  }
  
  ctx.restore();
};

const renderElementToSVG = (element: DiagramElement, bounds: any): string => {
  const x = element.x - bounds.x;
  const y = element.y - bounds.y;
  
  const transform = element.rotation 
    ? `transform="rotate(${element.rotation} ${x + element.width / 2} ${y + element.height / 2})"`
    : '';
  
  const style = `fill="${element.style.fill || '#ffffff'}" stroke="${element.style.stroke || '#000000'}" stroke-width="${element.style.strokeWidth || 1}" opacity="${element.style.opacity || 1}"`;
  
  let shape = '';
  
  switch (element.properties.shapeType) {
    case 'rectangle':
    case 'process':
    case 'terminator':
      shape = `<rect x="${x}" y="${y}" width="${element.width}" height="${element.height}" ${style} ${transform} />`;
      break;
      
    case 'circle':
    case 'usecase':
      const radius = Math.min(element.width, element.height) / 2;
      shape = `<circle cx="${x + element.width / 2}" cy="${y + element.height / 2}" r="${radius}" ${style} ${transform} />`;
      break;
      
    case 'diamond':
    case 'decision':
      const points = `${x + element.width / 2},${y} ${x + element.width},${y + element.height / 2} ${x + element.width / 2},${y + element.height} ${x},${y + element.height / 2}`;
      shape = `<polygon points="${points}" ${style} ${transform} />`;
      break;
  }
  
  if (element.properties.text) {
    shape += `<text x="${x + element.width / 2}" y="${y + element.height / 2}" text-anchor="middle" dominant-baseline="middle" font-size="${element.properties.fontSize || 14}" font-family="${element.properties.fontFamily || 'Arial'}" fill="#333333" ${transform}>${element.properties.text}</text>`;
  }
  
  return shape;
};
