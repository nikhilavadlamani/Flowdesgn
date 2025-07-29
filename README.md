# DrawFlow - Professional Diagram Editor

A powerful, web-based diagramming tool inspired by draw.io, built with modern technologies.

## Features

- **Interactive Canvas**: Real-time editing with pan, zoom, grid, and snapping
- **Rich Shape Library**: UML, BPMN, Network diagrams, Flowcharts, and basic shapes
- **Smart Connectors**: Orthogonal, curved, and straight connectors with intelligent routing
- **Real-time Collaboration**: Multi-user editing with live cursors and change tracking
- **AI Assistant**: GPT-powered diagram generation from text descriptions
- **Export Options**: PNG, SVG, PDF export capabilities
- **Template System**: Reusable templates for various diagram types
- **Version Control**: Diagram diff and history tracking

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Canvas Rendering**: Konva.js for high-performance 2D graphics
- **State Management**: Zustand for lightweight, efficient state management
- **Styling**: TailwindCSS for modern, responsive design
- **Build Tool**: Vite for fast development and optimized builds

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main canvas component with Konva.js
│   ├── DiagramEditor.tsx  # Main editor layout
│   ├── Toolbar.tsx     # Tool selection and controls
│   ├── ShapeLibrary.tsx   # Shape palette and AI assistant
│   └── PropertiesPanel.tsx # Element property editor
├── store/              # Zustand state management
│   └── editorStore.ts  # Main editor state
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Core Features Implementation

### Canvas Editor
- Built with Konva.js for high-performance rendering
- Supports pan, zoom, grid snapping, and drag-and-drop
- Real-time element manipulation and selection

### Shape Library
- Modular shape system with extensible categories
- Support for basic shapes, flowcharts, UML, and network diagrams
- Drag-and-drop shape creation

### State Management
- Zustand for lightweight, type-safe state management
- Optimized for real-time updates and collaboration
- Undo/redo system with history tracking

### Export System
- Multiple format support (PNG, SVG, PDF)
- High-quality rendering for print and digital use
- Batch export capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
