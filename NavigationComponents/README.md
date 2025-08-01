# Navigation Sidebar Components

This folder contains the professional navigation sidebar implementation for DrawFlow diagram editor.

## Components Included

### 1. **NavigationPage.tsx**
- Main standalone navigation page with dark sidebar
- Features: AI, Shapes, Diagrams, Save, Export, Share
- Professional hover effects and icons
- Welcome content with feature cards

### 2. **MainNavbar.tsx** 
- Reusable left sidebar component for the editor
- Active state highlighting
- Collapse functionality
- Back navigation support

### 3. **SecondaryPanel.tsx**
- Dynamic right panel content based on section selection
- AI Assistant, Shape Library, Diagrams, Save, Export, Share panels
- Collapsible interface

### 4. **AIChatbox.tsx**
- AI assistant with diagram generation capabilities
- Template creation for flowcharts, org charts, network diagrams
- Smart conversation handling

### 5. **DiagramEditor.tsx**
- Main editor layout integrating all components
- Canvas visibility management
- Responsive layout handling

### 6. **App.tsx**
- Application flow controller
- Multi-page navigation: Landing → Login → Navigation → Editor

## Key Features

- ✅ Professional dark navigation sidebar
- ✅ AI-powered diagram generation
- ✅ Multi-section navigation with dynamic panels
- ✅ Responsive design with hover effects
- ✅ Canvas integration with proper layout
- ✅ State management integration

## Installation

1. Copy these components to your `src/components/` folder
2. Ensure you have the required dependencies:
   - React 18+
   - TypeScript
   - TailwindCSS
   - Zustand (for state management)
3. Update your routing/navigation to use NavigationPage as needed

## Usage

```tsx
import { NavigationPage } from './components/NavigationPage';

function App() {
  const [selectedSection, setSelectedSection] = useState(null);
  
  if (!selectedSection) {
    return <NavigationPage onSectionSelect={setSelectedSection} />;
  }
  
  return <DiagramEditor initialSection={selectedSection} />;
}
```

## Styling

Components use TailwindCSS classes. Ensure your project has TailwindCSS configured with the following utilities:
- Gray color palette (gray-50 to gray-900)
- Blue color palette (blue-400 to blue-700)
- Hover and transition utilities
- Flexbox utilities

## State Management

Components expect Zustand stores for:
- `useAuthStore` - Authentication state
- `useEditorStore` - Editor/canvas state

Created by: DrawFlow Team
Version: 1.0
