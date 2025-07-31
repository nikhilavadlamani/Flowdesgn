import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { AIChatbox } from './AIChatbox';
import { AWSIcon } from './AWSIcon';

// SVG Shape Components
const ShapeIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 24 }) => {
  const props = {
    width: size,
    height: size,
    viewBox: `0 0 24 24`,
    fill: 'none',
    stroke: '#374151',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'rectangle':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
      );
    case 'circle':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...props}>
          <polygon points="12,3 21,20 3,20" />
        </svg>
      );
    case 'diamond':
      return (
        <svg {...props}>
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case 'process':
      return (
        <svg {...props}>
          <rect x="2" y="8" width="20" height="8" rx="1" fill="none" />
        </svg>
      );
    case 'decision':
      return (
        <svg {...props}>
          <polygon points="12,4 20,12 12,20 4,12" fill="none" />
        </svg>
      );
    case 'terminator':
      return (
        <svg {...props}>
          <rect x="2" y="8" width="20" height="8" rx="8" fill="none" />
        </svg>
      );
    case 'data':
      return (
        <svg {...props}>
          <path d="M2 10 L6 6 L22 6 L18 18 L2 18 Z" fill="none" />
        </svg>
      );
    case 'class':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" fill="none" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
      );
    case 'actor':
      return (
        <svg {...props}>
          <circle cx="12" cy="7" r="3" fill="none" />
          <path d="M12 10 L12 18 M8 14 L16 14 M9 20 L12 18 L15 20" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'usecase':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="12" rx="9" ry="6" fill="none" />
        </svg>
      );
    case 'component':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="12" fill="none" />
          <rect x="2" y="8" width="4" height="2" fill="none" />
          <rect x="2" y="14" width="4" height="2" fill="none" />
        </svg>
      );
    case 'server':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" fill="none" />
          <circle cx="7" cy="8" r="1" />
          <circle cx="10" cy="8" r="1" />
          <line x1="14" y1="8" x2="19" y2="8" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="6" y1="16" x2="18" y2="16" />
        </svg>
      );
    case 'router':
      return (
        <svg {...props}>
          <rect x="4" y="8" width="16" height="8" rx="1" fill="none" />
          <circle cx="7" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="17" cy="12" r="1" />
          <path d="M8 4 L8 8 M12 4 L12 8 M16 4 L16 8" strokeLinecap="round" />
        </svg>
      );
    case 'switch':
      return (
        <svg {...props}>
          <rect x="2" y="9" width="20" height="6" rx="1" fill="none" />
          <circle cx="6" cy="12" r="0.8" />
          <circle cx="10" cy="12" r="0.8" />
          <circle cx="14" cy="12" r="0.8" />
          <circle cx="18" cy="12" r="0.8" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...props}>
          <path d="M18 10 C20 10 22 12 22 14 C22 16 20 18 18 18 L6 18 C4 18 2 16 2 14 C2 12 4 10 6 10 C6 8 8 6 12 6 C16 6 18 8 18 10 Z" fill="none" />
        </svg>
      );
    // New Basic Shapes
    case 'ellipse':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" />
        </svg>
      );
    case 'pentagon':
      return (
        <svg {...props}>
          <polygon points="12,2 22,8 18,20 6,20 2,8" fill="none" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg {...props}>
          <polygon points="6,4 18,4 22,12 18,20 6,20 2,12" fill="none" />
        </svg>
      );
    case 'octagon':
      return (
        <svg {...props}>
          <polygon points="8,2 16,2 22,8 22,16 16,22 8,22 2,16 2,8" fill="none" />
        </svg>
      );
    // Arrows & Lines
    case 'arrow-right':
      return (
        <svg {...props}>
          <polygon points="2,8 2,16 16,16 16,20 22,12 16,4 16,8" fill="none" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...props}>
          <polygon points="22,8 22,16 8,16 8,20 2,12 8,4 8,8" fill="none" />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg {...props}>
          <polygon points="8,22 16,22 16,8 20,8 12,2 4,8 8,8" fill="none" />
        </svg>
      );
    case 'arrow-down':
      return (
        <svg {...props}>
          <polygon points="8,2 16,2 16,16 20,16 12,22 4,16 8,16" fill="none" />
        </svg>
      );
    case 'double-arrow':
      return (
        <svg {...props}>
          <polygon points="2,10 8,4 8,8 16,8 16,4 22,10 16,16 16,12 8,12 8,16" fill="none" />
        </svg>
      );
    case 'curved-arrow':
      return (
        <svg {...props}>
          <path d="M2,12 Q12,2 22,12" fill="none" />
          <polygon points="18,8 22,12 18,16" fill="none" />
        </svg>
      );
    case 'line':
      return (
        <svg {...props}>
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      );
    case 'connector':
      return (
        <svg {...props}>
          <path d="M2,12 L8,12 Q12,12 12,8 L12,4" fill="none" />
          <circle cx="2" cy="12" r="1.5" />
          <circle cx="12" cy="4" r="1.5" />
        </svg>
      );
    // Additional Flowchart
    case 'document':
      return (
        <svg {...props}>
          <path d="M4,6 L20,6 L20,18 Q16,20 12,18 Q8,16 4,18 Z" fill="none" />
        </svg>
      );
    case 'storage':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="10" ry="2" fill="none" />
          <ellipse cx="12" cy="18" rx="10" ry="2" fill="none" />
          <line x1="2" y1="6" x2="2" y2="18" />
          <line x1="22" y1="6" x2="22" y2="18" />
        </svg>
      );
    case 'delay':
      return (
        <svg {...props}>
          <path d="M2,8 L18,8 Q22,12 18,16 L2,16 Z" fill="none" />
        </svg>
      );
    case 'manual-input':
      return (
        <svg {...props}>
          <polygon points="2,10 22,8 22,18 2,20" fill="none" />
        </svg>
      );
    // Geometric Shapes
    case 'star':
      return (
        <svg {...props}>
          <polygon points="12,2 15,8 22,8 17,13 19,20 12,16 5,20 7,13 2,8 9,8" fill="none" />
        </svg>
      );
    case 'cross':
      return (
        <svg {...props}>
          <polygon points="9,2 15,2 15,9 22,9 22,15 15,15 15,22 9,22 9,15 2,15 2,9 9,9" fill="none" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...props}>
          <path d="M12,21 C12,21 2,14 2,8 C2,5 4,3 7,3 C9,3 11,4 12,6 C13,4 15,3 17,3 C20,3 22,5 22,8 C22,14 12,21 12,21 Z" fill="none" />
        </svg>
      );
    case 'trapezoid':
      return (
        <svg {...props}>
          <polygon points="6,8 18,8 22,16 2,16" fill="none" />
        </svg>
      );
    case 'parallelogram':
      return (
        <svg {...props}>
          <polygon points="4,8 20,8 20,16 4,16" fill="none" />
        </svg>
      );
    case 'cylinder':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="8" ry="2" fill="none" />
          <ellipse cx="12" cy="18" rx="8" ry="2" fill="none" />
          <line x1="4" y1="6" x2="4" y2="18" />
          <line x1="20" y1="6" x2="20" y2="18" />
        </svg>
      );
    case 'cube':
      return (
        <svg {...props}>
          <polygon points="4,8 8,4 20,4 16,8" fill="none" />
          <polygon points="4,8 16,8 20,4" fill="none" />
          <polygon points="4,8 4,18 16,18 16,8" fill="none" />
          <polygon points="16,8 20,4 20,14 16,18" fill="none" />
        </svg>
      );
    case 'ring':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" fill="none" />
          <circle cx="12" cy="12" r="4" fill="none" />
        </svg>
      );
    // Additional UML
    case 'package':
      return (
        <svg {...props}>
          <path d="M4,8 L4,6 L10,6 L12,8 L20,8 L20,18 L4,18 Z" fill="none" />
        </svg>
      );
    case 'interface':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" fill="none" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case 'note':
      return (
        <svg {...props}>
          <path d="M4,4 L18,4 L18,16 L6,20 L4,18 Z" fill="none" />
          <polygon points="6,16 6,20 2,18" fill="none" />
        </svg>
      );
    case 'boundary':
      return (
        <svg {...props}>
          <circle cx="6" cy="12" r="2" fill="none" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="16" y1="8" x2="16" y2="16" />
        </svg>
      );
    // Additional Network
    case 'database':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="8" ry="3" fill="none" />
          <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" />
          <ellipse cx="12" cy="18" rx="8" ry="3" fill="none" />
          <line x1="4" y1="6" x2="4" y2="18" />
          <line x1="20" y1="6" x2="20" y2="18" />
        </svg>
      );
    case 'firewall':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="12" fill="none" />
          <polygon points="8,4 12,8 16,4" fill="none" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="16" y2="14" />
        </svg>
      );
    case 'laptop':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="10" rx="1" fill="none" />
          <line x1="2" y1="18" x2="22" y2="18" />
          <rect x="6" y="8" width="12" height="6" fill="none" />
        </svg>
      );
    case 'mobile':
      return (
        <svg {...props}>
          <rect x="8" y="2" width="8" height="20" rx="2" fill="none" />
          <line x1="10" y1="18" x2="14" y2="18" />
          <rect x="9" y="4" width="6" height="12" fill="none" />
        </svg>
      );
    
    // AWS Icons - Using the AWSIcon component
    case 'aws-ec2':
    case 'aws-s3':
    case 'aws-lambda':
    case 'aws-rds':
    case 'aws-cloudfront':
    case 'aws-vpc':
    case 'aws-apigateway':
    case 'aws-dynamodb':
      return <AWSIcon type={type} size={size} />;
    default:
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" fill="none" />
        </svg>
      );
  }
};

const shapeCategories = [
  {
    name: 'Templates',
    shapes: [
      { id: 'basic-flowchart', name: 'Basic Flowchart', isTemplate: true },
      { id: 'org-chart', name: 'Organization Chart', isTemplate: true },
      { id: 'network-diagram', name: 'Network Diagram', isTemplate: true },
      { id: 'process-flow', name: 'Process Flow', isTemplate: true },
      { id: 'sitemap', name: 'Website Sitemap', isTemplate: true },
      { id: 'swimlane', name: 'Swimlane Diagram', isTemplate: true },
    ],
  },
  {
    name: 'Basic Shapes',
    shapes: [
      { id: 'rectangle', name: 'Rectangle' },
      { id: 'circle', name: 'Circle' },
      { id: 'triangle', name: 'Triangle' },
      { id: 'diamond', name: 'Diamond' },
      { id: 'ellipse', name: 'Ellipse' },
      { id: 'pentagon', name: 'Pentagon' },
      { id: 'hexagon', name: 'Hexagon' },
      { id: 'octagon', name: 'Octagon' },
    ],
  },
  {
    name: 'Arrows & Lines',
    shapes: [
      { id: 'arrow-right', name: 'Arrow Right' },
      { id: 'arrow-left', name: 'Arrow Left' },
      { id: 'arrow-up', name: 'Arrow Up' },
      { id: 'arrow-down', name: 'Arrow Down' },
      { id: 'double-arrow', name: 'Double Arrow' },
      { id: 'curved-arrow', name: 'Curved Arrow' },
      { id: 'line', name: 'Line' },
      { id: 'connector', name: 'Connector' },
    ],
  },
  {
    name: 'Flowchart',
    shapes: [
      { id: 'process', name: 'Process' },
      { id: 'decision', name: 'Decision' },
      { id: 'terminator', name: 'Terminator' },
      { id: 'data', name: 'Data' },
      { id: 'document', name: 'Document' },
      { id: 'storage', name: 'Storage' },
      { id: 'delay', name: 'Delay' },
      { id: 'manual-input', name: 'Manual Input' },
    ],
  },
  {
    name: 'Geometric',
    shapes: [
      { id: 'star', name: 'Star' },
      { id: 'cross', name: 'Cross' },
      { id: 'heart', name: 'Heart' },
      { id: 'trapezoid', name: 'Trapezoid' },
      { id: 'parallelogram', name: 'Parallelogram' },
      { id: 'cylinder', name: 'Cylinder' },
      { id: 'cube', name: 'Cube' },
      { id: 'ring', name: 'Ring' },
    ],
  },
  {
    name: 'UML',
    shapes: [
      { id: 'class', name: 'Class' },
      { id: 'actor', name: 'Actor' },
      { id: 'usecase', name: 'Use Case' },
      { id: 'component', name: 'Component' },
      { id: 'package', name: 'Package' },
      { id: 'interface', name: 'Interface' },
      { id: 'note', name: 'Note' },
      { id: 'boundary', name: 'Boundary' },
    ],
  },
  {
    name: 'Network',
    shapes: [
      { id: 'server', name: 'Server' },
      { id: 'router', name: 'Router' },
      { id: 'switch', name: 'Switch' },
      { id: 'cloud', name: 'Cloud' },
      { id: 'database', name: 'Database' },
      { id: 'firewall', name: 'Firewall' },
      { id: 'laptop', name: 'Laptop' },
      { id: 'mobile', name: 'Mobile' },
    ],
  },
  {
    name: 'AWS Services',
    shapes: [
      { id: 'aws-ec2', name: 'EC2 (Compute)' },
      { id: 'aws-s3', name: 'S3 (Storage)' },
      { id: 'aws-lambda', name: 'Lambda (Functions)' },
      { id: 'aws-rds', name: 'RDS (Database)' },
      { id: 'aws-cloudfront', name: 'CloudFront (CDN)' },
      { id: 'aws-vpc', name: 'VPC (Network)' },
      { id: 'aws-apigateway', name: 'API Gateway' },
      { id: 'aws-cloudwatch', name: 'CloudWatch (Monitoring)' },
      { id: 'aws-sns', name: 'SNS (Notifications)' },
      { id: 'aws-sqs', name: 'SQS (Queue)' },
      { id: 'aws-dynamodb', name: 'DynamoDB (NoSQL)' },
      { id: 'aws-iam', name: 'IAM (Identity)' },
      { id: 'aws-route53', name: 'Route 53 (DNS)' },
      { id: 'aws-elb', name: 'Load Balancer' },
      { id: 'aws-kinesis', name: 'Kinesis (Streaming)' },
    ],
  },
];

export const ShapeLibrary: React.FC = () => {
  const { addElement, setTool, clearAllElements } = useEditorStore();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Listen for AI template creation events
  useEffect(() => {
    const handleCreateTemplate = (event: CustomEvent) => {
      const { templateId } = event.detail;
      createTemplate(templateId);
    };

    window.addEventListener('createTemplate', handleCreateTemplate as EventListener);
    return () => {
      window.removeEventListener('createTemplate', handleCreateTemplate as EventListener);
    };
  }, []);

  // Template definitions
  const createTemplate = (templateId: string) => {
    clearAllElements(); // Clear existing elements
    
    switch (templateId) {
      case 'basic-flowchart':
        // Create a basic flowchart template
        const flowchartElements = [
          {
            type: 'shape' as const,
            x: 300,
            y: 100,
            width: 120,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'terminator', text: 'Start' },
            style: { fill: '#4caf50', stroke: '#2e7d32', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 300,
            y: 200,
            width: 120,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'process', text: 'Process' },
            style: { fill: '#2196f3', stroke: '#1565c0', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 300,
            y: 300,
            width: 120,
            height: 80,
            rotation: 0,
            properties: { shapeType: 'decision', text: 'Decision?' },
            style: { fill: '#ff9800', stroke: '#e65100', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 300,
            y: 420,
            width: 120,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'terminator', text: 'End' },
            style: { fill: '#f44336', stroke: '#c62828', strokeWidth: 2, opacity: 1 }
          }
        ];
        flowchartElements.forEach(element => addElement(element));
        break;
        
      case 'org-chart':
        // Create an organizational chart template
        const orgElements = [
          {
            type: 'shape' as const,
            x: 350,
            y: 100,
            width: 140,
            height: 80,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'CEO' },
            style: { fill: '#9c27b0', stroke: '#6a1b9a', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 200,
            y: 220,
            width: 120,
            height: 70,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Manager A' },
            style: { fill: '#3f51b5', stroke: '#283593', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 500,
            y: 220,
            width: 120,
            height: 70,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Manager B' },
            style: { fill: '#3f51b5', stroke: '#283593', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 120,
            y: 340,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Employee 1' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 280,
            y: 340,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Employee 2' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          }
        ];
        orgElements.forEach(element => addElement(element));
        break;
        
      case 'network-diagram':
        // Create a network diagram template
        const networkElements = [
          {
            type: 'shape' as const,
            x: 300,
            y: 100,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'server', text: 'Server' },
            style: { fill: '#607d8b', stroke: '#37474f', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 150,
            y: 220,
            width: 80,
            height: 80,
            rotation: 0,
            properties: { shapeType: 'circle', text: 'Router' },
            style: { fill: '#795548', stroke: '#3e2723', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 450,
            y: 220,
            width: 80,
            height: 80,
            rotation: 0,
            properties: { shapeType: 'circle', text: 'Switch' },
            style: { fill: '#795548', stroke: '#3e2723', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 100,
            y: 340,
            width: 90,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'PC 1' },
            style: { fill: '#ffc107', stroke: '#f57c00', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 230,
            y: 340,
            width: 90,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'PC 2' },
            style: { fill: '#ffc107', stroke: '#f57c00', strokeWidth: 2, opacity: 1 }
          }
        ];
        networkElements.forEach(element => addElement(element));
        break;
        
      case 'process-flow':
        // Create a business process flow template
        const processElements = [
          {
            type: 'shape' as const,
            x: 100,
            y: 200,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'terminator', text: 'Start' },
            style: { fill: '#4caf50', stroke: '#2e7d32', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 250,
            y: 200,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'process', text: 'Input Data' },
            style: { fill: '#2196f3', stroke: '#1565c0', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 400,
            y: 200,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'process', text: 'Process' },
            style: { fill: '#ff9800', stroke: '#e65100', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 550,
            y: 200,
            width: 100,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'data', text: 'Output' },
            style: { fill: '#9c27b0', stroke: '#6a1b9a', strokeWidth: 2, opacity: 1 }
          }
        ];
        processElements.forEach(element => addElement(element));
        break;
        
      case 'sitemap':
        // Create a website sitemap template
        const sitemapElements = [
          {
            type: 'shape' as const,
            x: 350,
            y: 100,
            width: 120,
            height: 60,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Home Page' },
            style: { fill: '#3f51b5', stroke: '#283593', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 150,
            y: 220,
            width: 100,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'About' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 300,
            y: 220,
            width: 100,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Products' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 450,
            y: 220,
            width: 100,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Services' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 600,
            y: 220,
            width: 100,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Contact' },
            style: { fill: '#009688', stroke: '#00695c', strokeWidth: 2, opacity: 1 }
          }
        ];
        sitemapElements.forEach(element => addElement(element));
        break;
        
      case 'swimlane':
        // Create a swimlane diagram template
        const swimlaneElements = [
          // Headers
          {
            type: 'shape' as const,
            x: 100,
            y: 100,
            width: 150,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Customer' },
            style: { fill: '#f44336', stroke: '#c62828', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 100,
            y: 200,
            width: 150,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Sales Team' },
            style: { fill: '#2196f3', stroke: '#1565c0', strokeWidth: 2, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 100,
            y: 300,
            width: 150,
            height: 50,
            rotation: 0,
            properties: { shapeType: 'rectangle', text: 'Support' },
            style: { fill: '#4caf50', stroke: '#2e7d32', strokeWidth: 2, opacity: 1 }
          },
          // Process steps
          {
            type: 'shape' as const,
            x: 300,
            y: 110,
            width: 90,
            height: 30,
            rotation: 0,
            properties: { shapeType: 'process', text: 'Request' },
            style: { fill: '#ffcdd2', stroke: '#f44336', strokeWidth: 1, opacity: 1 }
          },
          {
            type: 'shape' as const,
            x: 300,
            y: 210,
            width: 90,
            height: 30,
            rotation: 0,
            properties: { shapeType: 'process', text: 'Quote' },
            style: { fill: '#bbdefb', stroke: '#2196f3', strokeWidth: 1, opacity: 1 }
          }
        ];
        swimlaneElements.forEach(element => addElement(element));
        break;
        
      default:
        // For other templates, create a simple placeholder
        addElement({
          type: 'shape' as const,
          x: 300,
          y: 200,
          width: 150,
          height: 80,
          rotation: 0,
          properties: { shapeType: 'rectangle', text: `${templateId} Template` },
          style: { fill: '#e3f2fd', stroke: '#1976d2', strokeWidth: 2, opacity: 1 }
        });
    }
  };

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleShapeDragStart = (e: React.DragEvent, shapeId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'shape',
      shapeType: shapeId,
    }));
  };

  const handleShapeClick = (shapeId: string, isTemplate?: boolean) => {
    setTool('select');
    
    if (isTemplate) {
      createTemplate(shapeId);
      return;
    }
    
    // Add shape to canvas at center
    const newElement = {
      type: 'shape' as const,
      x: 200,
      y: 200,
      width: 100,
      height: 60,
      rotation: 0,
      properties: {
        shapeType: shapeId,
        text: '',
      },
      style: {
        fill: '#e3f2fd',
        stroke: '#1976d2',
        strokeWidth: 2,
        opacity: 1,
      },
    };
    
    addElement(newElement);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col shape-library-sidebar">
      <div className="flex-1 overflow-y-auto">
        {shapeCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.name);
          return (
            <div key={category.name} className="mb-4">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full text-xs font-medium mb-2 px-3 py-1 text-center transition-colors flex items-center justify-center category-header"
              >
                <span>{category.name}</span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  className={`ml-2 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                >
                  <path fill="currentColor" d="M3 5L6 8L9 5H3Z"/>
                </svg>
              </button>
              {!isCollapsed && (
                <div className="grid grid-cols-3 gap-1 px-2">
                  {category.shapes.map((shape) => (
                    <div
                      key={shape.id}
                      draggable={!(shape as any).isTemplate}
                      onDragStart={(e) => !(shape as any).isTemplate && handleShapeDragStart(e, shape.id)}
                      onClick={() => handleShapeClick(shape.id, (shape as any).isTemplate)}
                      className={`shape-item group relative ${
                        (shape as any).isTemplate ? 'template-item' : 
                        shape.id.startsWith('aws-') ? 'aws-shape-item' : ''
                      }`}
                      title={shape.name}
                    >
                      {(shape as any).isTemplate ? (
                        <div className="flex flex-col items-center">
                          <svg className="w-5 h-5 text-purple-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-xs text-purple-600 font-medium">Template</span>
                        </div>
                      ) : (
                        <ShapeIcon type={shape.id} size={20} />
                      )}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                    bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30
                                    pointer-events-none shadow-lg">
                        {shape.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <AIChatbox />
    </div>
  );
};
