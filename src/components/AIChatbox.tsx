import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIChatbox: React.FC = () => {
  const { addElement, elements } = useEditorStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '🤖 Hello! I\'m your AI assistant for DrawFlow. I can help you:\n\n• Create diagrams from text descriptions\n• Suggest shapes for your projects\n• Answer questions about diagramming\n• Guide you through design best practices\n\nTry asking: "Create a simple flowchart" or "What shapes do I need for a network diagram?"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createFlowchartTemplate = () => {
    const shapes = [
      {
        type: 'shape' as const,
        x: 300,
        y: 100,
        width: 140,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'terminator', text: 'Start' },
        style: { fill: '#4caf50', stroke: '#388e3c', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 200,
        width: 140,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'process', text: 'Process Data' },
        style: { fill: '#2196f3', stroke: '#1976d2', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 320,
        width: 140,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'decision', text: 'Is Valid?' },
        style: { fill: '#ff9800', stroke: '#f57c00', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 500,
        y: 320,
        width: 140,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'process', text: 'Show Error' },
        style: { fill: '#f44336', stroke: '#d32f2f', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 440,
        width: 140,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'terminator', text: 'End' },
        style: { fill: '#4caf50', stroke: '#388e3c', strokeWidth: 2, opacity: 1 }
      }
    ];

    shapes.forEach(shape => addElement(shape));
  };

  const createOrgChartTemplate = () => {
    const shapes = [
      {
        type: 'shape' as const,
        x: 300,
        y: 100,
        width: 120,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'CEO' },
        style: { fill: '#9c27b0', stroke: '#6a1b9a', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 150,
        y: 220,
        width: 120,
        height: 70,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'VP Sales' },
        style: { fill: '#3f51b5', stroke: '#283593', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 450,
        y: 220,
        width: 120,
        height: 70,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'VP Tech' },
        style: { fill: '#3f51b5', stroke: '#283593', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 100,
        y: 340,
        width: 100,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Sales Rep' },
        style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 220,
        y: 340,
        width: 100,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Sales Rep' },
        style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 400,
        y: 340,
        width: 100,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Developer' },
        style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 520,
        y: 340,
        width: 100,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Designer' },
        style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
      }
    ];

    shapes.forEach(shape => addElement(shape));
  };

  const createNetworkDiagram = () => {
    const shapes = [
      {
        type: 'shape' as const,
        x: 300,
        y: 100,
        width: 100,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Internet' },
        style: { fill: '#ff9800', stroke: '#f57c00', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 220,
        width: 100,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Router' },
        style: { fill: '#2196f3', stroke: '#1976d2', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 340,
        width: 100,
        height: 80,
        rotation: 0,
        properties: { shapeType: 'rectangle', text: 'Switch' },
        style: { fill: '#4caf50', stroke: '#388e3c', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 150,
        y: 460,
        width: 80,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'circle', text: 'PC 1' },
        style: { fill: '#9c27b0', stroke: '#6a1b9a', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 300,
        y: 460,
        width: 80,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'circle', text: 'PC 2' },
        style: { fill: '#9c27b0', stroke: '#6a1b9a', strokeWidth: 2, opacity: 1 }
      },
      {
        type: 'shape' as const,
        x: 450,
        y: 460,
        width: 80,
        height: 60,
        rotation: 0,
        properties: { shapeType: 'circle', text: 'Server' },
        style: { fill: '#f44336', stroke: '#d32f2f', strokeWidth: 2, opacity: 1 }
      }
    ];

    shapes.forEach(shape => addElement(shape));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Handle template requests
    if (lowerInput.includes('template') || lowerInput.includes('examples')) {
      if (lowerInput.includes('flowchart') || lowerInput.includes('flow')) {
        return '📋 I can help you with flowchart templates! Try these commands:\n\n• "Create basic flowchart template" - Generates a starter flowchart\n• "Show me process flow" - Creates a process diagram\n• "Make a decision tree" - Builds a decision flowchart\n\nWould you like me to create one of these for you?';
      }
      
      if (lowerInput.includes('org') || lowerInput.includes('organization')) {
        return '🏢 For organizational charts, I can create:\n\n• Basic org chart structure\n• Department hierarchies\n• Team reporting structures\n\nJust say "Create org chart template" and I\'ll build one for you!';
      }
      
      return '📋 I have several professional templates available:\n\n• **Flowcharts** - Process flows, decision trees\n• **Organizational Charts** - Company hierarchies\n• **Network Diagrams** - IT infrastructure layouts\n• **Process Flows** - Business workflows\n• **Sitemaps** - Website structures\n\nWhich type would you like me to create?';
    }
    
    // Handle shape creation requests with AI optimization
    if (lowerInput.includes('create') || lowerInput.includes('add') || lowerInput.includes('make') || lowerInput.includes('generate')) {
      
      // Template creation
      if (lowerInput.includes('basic flowchart') || lowerInput.includes('flowchart template') || lowerInput.includes('flowchart')) {
        createFlowchartTemplate();
        return '✅ I\'ve created a professional flowchart template with Start, Process, Decision, and End elements! The shapes are optimally positioned and color-coded for clear process flow visualization.';
      }
      
      if (lowerInput.includes('org chart') || lowerInput.includes('organization chart') || lowerInput.includes('organizational')) {
        createOrgChartTemplate();
        return '🏢 I\'ve generated a comprehensive organizational chart with CEO, department heads, and team members! Perfect for visualizing company structure and reporting relationships.';
      }
      
      if (lowerInput.includes('network diagram') || lowerInput.includes('network') || lowerInput.includes('infrastructure')) {
        createNetworkDiagram();
        return '🌐 Created a network infrastructure diagram with Internet, Router, Switch, and connected devices! Ideal for IT planning and documentation.';
      }
      
      // Advanced AI: Generate diagrams from workflow descriptions
      if (lowerInput.includes('workflow') || lowerInput.includes('process') || lowerInput.includes('steps')) {
        createFlowchartTemplate();
        return '🔄 I\'ve analyzed your request and created an optimized workflow diagram! Each step is perfectly positioned with professional spacing and flow logic.';
      }
      
      // AI understands business scenarios
      if (lowerInput.includes('business') || lowerInput.includes('company')) {
        createOrgChartTemplate();
        return '🏢 I\'ve created a professional organizational structure! This template follows industry best practices for business hierarchy visualization.';
      }
    }
    
    // Provide guidance and suggestions
    if (lowerInput.includes('flowchart') || lowerInput.includes('flow chart')) {
      return '📊 For flowcharts, use:\n• **Process** (rectangles) for steps\n• **Decision** (diamonds) for yes/no choices\n• **Terminator** (rounded rectangles) for start/end\n• **Arrows** to show flow direction\n\nWould you like me to create a sample flowchart for you?';
    }
    
    if (lowerInput.includes('uml') || lowerInput.includes('class diagram')) {
      return '🏗️ For UML diagrams:\n• **Class** rectangles for entities\n• **Actor** stick figures for users\n• **Use Case** ovals for functionality\n• **Interface** circles for contracts\n\nCheck the UML category in the shapes panel above!';
    }
    
    if (lowerInput.includes('network') || lowerInput.includes('topology')) {
      return '🌐 For network diagrams:\n• **Server** for computing resources\n• **Router/Switch** for network devices\n• **Cloud** for internet/external services\n• **Firewall** for security boundaries\n\nFind these in the Network shapes category!';
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return '💡 I can help you with:\n\n**Creating Diagrams:**\n• "Create a flowchart"\n• "Add a network topology"\n• "Make a UML class diagram"\n\n**Shape Guidance:**\n• "What shapes for flowcharts?"\n• "UML diagram help"\n• "Network topology shapes"\n\n**Design Tips:**\n• Best practices\n• Layout suggestions\n• Color schemes';
    }
    
    if (lowerInput.includes('shape') || lowerInput.includes('what')) {
      return '🎨 Available shape categories:\n\n• **Basic Shapes** - Rectangle, Circle, Triangle\n• **Arrows & Lines** - Directional indicators\n• **Flowchart** - Process, Decision, Data\n• **Geometric** - Star, Heart, Polygon\n• **UML** - Class, Actor, Use Case\n• **Network** - Server, Router, Cloud\n\nClick any category above to expand and see all shapes!';
    }
    
    if (lowerInput.includes('color') || lowerInput.includes('style')) {
      return '🎨 To style your shapes:\n• Click any shape to select it\n• Use the properties panel (when available)\n• Common colors: Blue for processes, Red for alerts, Green for success\n• Keep consistent styling throughout your diagram';
    }
    
    if (lowerInput.includes('connect') || lowerInput.includes('line') || lowerInput.includes('arrow')) {
      return '🔗 To connect shapes:\n• Use Arrow shapes from "Arrows & Lines" category\n• Drag connectors between shapes\n• Use different arrow types for different relationships\n• Keep connections clear and minimal crossings';
    }
    
    if (lowerInput.includes('export') || lowerInput.includes('save')) {
      return '💾 Export options available:\n• **PNG** - For images and presentations\n• **SVG** - For scalable vector graphics\n• **JSON** - To save your work\n• **PDF** - For documents\n• **DOCX** - For Word documents\n\nUse the File menu or Export dropdown in the top toolbar!';
    }
    
    // Handle current canvas questions
    if (lowerInput.includes('canvas') || lowerInput.includes('current')) {
      const elementCount = elements.length;
      if (elementCount === 0) {
        return '📝 Your canvas is currently empty. Would you like me to help you create your first diagram? Try saying "Create a flowchart" or "Add some basic shapes".';
      } else {
        return `📋 You currently have ${elementCount} element${elementCount > 1 ? 's' : ''} on your canvas. Need help organizing them or adding more shapes?`;
      }
    }
    
    // Encourage creativity
    if (lowerInput.includes('idea') || lowerInput.includes('suggest')) {
      return '💡 Here are some diagram ideas:\n\n• **Process Flow** - Show step-by-step procedures\n• **Org Chart** - Display team structure\n• **System Architecture** - Technical system overview\n• **User Journey** - Customer experience mapping\n• **Decision Tree** - Choice-based workflows\n\nWhat type of diagram are you thinking about?';
    }
    
    return '🤔 That\'s interesting! I\'m here to help with diagram creation. Try asking me to:\n\n• "Create a flowchart"\n• "What shapes do I need for..."\n• "Help me design a network diagram"\n• "Show me UML shapes"\n\nOr ask specific questions about diagramming best practices!';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: '🤖 Chat cleared! How can I help you with your diagram today?',
      timestamp: new Date(),
    }]);
  };

  if (!isExpanded) {
    return (
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-lg transition-all duration-200 text-blue-700 shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="9" r="1"/>
            <circle cx="15" cy="9" r="1"/>
            <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
          </svg>
          <span className="font-medium">AI Assistant</span>
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white flex flex-col h-80">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="9" r="1"/>
            <circle cx="15" cy="9" r="1"/>
            <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
          </svg>
          <span className="text-sm font-medium text-blue-700">AI Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={clearChat}
            className="p-1 hover:bg-blue-100 rounded transition-colors text-blue-600"
            title="Clear chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18l-2 13H5L3 6z"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-blue-100 rounded transition-colors text-blue-600"
            title="Minimize"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border rounded-bl-sm'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-3 py-3 text-xs text-gray-800 shadow-sm border rounded-bl-sm">
              <div className="flex space-x-1 items-center">
                <span className="text-gray-500">AI is thinking</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to create diagrams..."
            className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
