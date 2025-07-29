<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# DrawFlow - Diagram Editor Instructions

This is a professional diagramming application similar to draw.io, built with React, TypeScript, and Konva.js.

## Project Context

- **Main Framework**: React 18 with TypeScript
- **Canvas Library**: Konva.js and react-konva for 2D canvas rendering
- **State Management**: Zustand for lightweight state management
- **Styling**: TailwindCSS with custom utility classes
- **Build Tool**: Vite for fast development

## Key Components

1. **DiagramEditor**: Main layout component orchestrating the entire editor
2. **Canvas**: Konva.js-based drawing surface with shape rendering and interactions
3. **Toolbar**: Tool selection, zoom controls, and export options
4. **ShapeLibrary**: Categorized shape palette with AI assistant integration
5. **PropertiesPanel**: Element property editor with real-time updates
6. **EditorStore**: Zustand store managing diagram state and operations

## Development Guidelines

### Canvas Operations
- Use Konva.js primitives (Rect, Circle, Line, Group, etc.) for shape rendering
- Implement drag-and-drop with proper event handling
- Support multi-selection with Ctrl/Cmd key modifiers
- Maintain consistent coordinate system for positioning

### State Management
- Use Zustand actions for all state mutations
- Keep element updates immutable
- Implement proper TypeScript typing for all store interfaces
- Handle selection state consistently across components

### Styling Conventions
- Use TailwindCSS utility classes preferentially
- Follow the existing component class patterns (toolbar-button, panel, etc.)
- Maintain consistent spacing and color schemes
- Implement responsive design considerations

### Performance Considerations
- Optimize Konva.js rendering with proper layer management
- Use React.memo for expensive components
- Implement virtualization for large shape libraries
- Debounce property updates to prevent excessive re-renders

## Feature Implementation Priorities

1. **Core Drawing**: Shape creation, selection, movement, resizing
2. **Connectors**: Smart line routing between shapes with anchor points
3. **Export System**: PNG, SVG, PDF generation with proper scaling
4. **Collaboration**: Real-time multi-user editing with conflict resolution
5. **AI Integration**: Text-to-diagram generation using OpenAI API
6. **Templates**: Predefined diagram templates and shape libraries
7. **Version Control**: Diagram history and diff visualization

## Code Patterns

- Use functional components with hooks
- Implement proper error boundaries for canvas operations
- Handle keyboard shortcuts with react-hotkeys-hook
- Use proper TypeScript interfaces for all data structures
- Follow React best practices for component composition
