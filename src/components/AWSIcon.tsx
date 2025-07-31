import React from 'react';

interface AWSIconProps {
  type: string;
  size?: number;
  className?: string;
}

export const AWSIcon: React.FC<AWSIconProps> = ({ type, size = 24, className = '' }) => {
  const iconProps = {
    width: size,
    height: size,
    className: `aws-icon ${className}`,
  };

  switch (type) {
    case 'aws-ec2':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ec2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#F58536", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#FF9900", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#ec2-gradient)" rx="4"/>
          <rect x="4" y="4" width="40" height="40" fill="#232F3E" rx="2"/>
          <rect x="8" y="8" width="32" height="32" fill="#FF9900" rx="1"/>
          <rect x="10" y="10" width="28" height="28" fill="#232F3E" rx="1"/>
          <rect x="14" y="14" width="20" height="4" fill="#FF9900"/>
          <rect x="14" y="20" width="20" height="4" fill="#FF9900"/>
          <rect x="14" y="26" width="20" height="4" fill="#FF9900"/>
          <rect x="14" y="32" width="20" height="4" fill="#FF9900"/>
          <circle cx="16" cy="16" r="1" fill="#232F3E"/>
          <circle cx="32" cy="16" r="1" fill="#232F3E"/>
          <circle cx="16" cy="22" r="1" fill="#232F3E"/>
          <circle cx="32" cy="22" r="1" fill="#232F3E"/>
          <circle cx="16" cy="28" r="1" fill="#232F3E"/>
          <circle cx="32" cy="28" r="1" fill="#232F3E"/>
          <circle cx="16" cy="34" r="1" fill="#232F3E"/>
          <circle cx="32" cy="34" r="1" fill="#232F3E"/>
        </svg>
      );
      
    case 'aws-s3':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="s3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#7AA116", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#569A31", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <path d="M24 4 L42 12 L42 36 L24 44 L6 36 L6 12 Z" fill="url(#s3-gradient)"/>
          <path d="M24 4 L42 12 L24 20 L6 12 Z" fill="#7AA116"/>
          <path d="M24 20 L42 12 L42 36 L24 44 Z" fill="#569A31"/>
          <path d="M24 20 L6 12 L6 36 L24 44 Z" fill="#4F7A2B"/>
          <circle cx="18" cy="16" r="2" fill="white" opacity="0.9"/>
          <circle cx="30" cy="16" r="2" fill="white" opacity="0.9"/>
          <rect x="20" y="26" width="8" height="2" fill="white" opacity="0.8" rx="1"/>
          <rect x="18" y="30" width="12" height="2" fill="white" opacity="0.8" rx="1"/>
        </svg>
      );
      
    case 'aws-lambda':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lambda-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#F58536", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#FF9900", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#lambda-gradient)" rx="4"/>
          <path d="M8 40 L16 8 L22 8 L14 40 Z" fill="#232F3E"/>
          <path d="M26 8 L32 8 L40 40 L34 40 L32 32 L28 32 L26 8" fill="#232F3E"/>
          <rect x="12" y="20" width="24" height="2" fill="#FF9900" opacity="0.7"/>
          <rect x="14" y="24" width="20" height="2" fill="#FF9900" opacity="0.7"/>
          <rect x="16" y="28" width="16" height="2" fill="#FF9900" opacity="0.7"/>
        </svg>
      );
      
    case 'aws-rds':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rds-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#527FFF", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#3C5998", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#rds-gradient)" rx="4"/>
          <ellipse cx="24" cy="12" rx="18" ry="6" fill="#7BB3F0"/>
          <rect x="6" y="12" width="36" height="24" fill="#3C5998"/>
          <ellipse cx="24" cy="36" rx="18" ry="6" fill="#527FFF"/>
          <ellipse cx="24" cy="20" rx="18" ry="4" fill="#7BB3F0"/>
          <ellipse cx="24" cy="28" rx="18" ry="4" fill="#7BB3F0"/>
          <rect x="20" y="22" width="8" height="4" fill="white" opacity="0.9" rx="1"/>
        </svg>
      );
      
    case 'aws-cloudfront':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloudfront-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#F58536", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#FF9900", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#cloudfront-gradient)" rx="4"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#232F3E" strokeWidth="2"/>
          <circle cx="24" cy="24" r="12" fill="none" stroke="#232F3E" strokeWidth="1.5"/>
          <circle cx="24" cy="24" r="6" fill="none" stroke="#232F3E" strokeWidth="1"/>
          <circle cx="24" cy="24" r="2" fill="#232F3E"/>
          <circle cx="12" cy="12" r="2" fill="#232F3E"/>
          <circle cx="36" cy="12" r="2" fill="#232F3E"/>
          <circle cx="12" cy="36" r="2" fill="#232F3E"/>
          <circle cx="36" cy="36" r="2" fill="#232F3E"/>
          <line x1="24" y1="6" x2="24" y2="12" stroke="#232F3E" strokeWidth="2"/>
          <line x1="24" y1="36" x2="24" y2="42" stroke="#232F3E" strokeWidth="2"/>
          <line x1="6" y1="24" x2="12" y2="24" stroke="#232F3E" strokeWidth="2"/>
          <line x1="36" y1="24" x2="42" y2="24" stroke="#232F3E" strokeWidth="2"/>
        </svg>
      );
      
    case 'aws-vpc':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vpc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#F58536", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#FF9900", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#vpc-gradient)" rx="4"/>
          <rect x="4" y="8" width="40" height="32" fill="none" stroke="#232F3E" strokeWidth="2" rx="2"/>
          <rect x="8" y="12" width="14" height="12" fill="none" stroke="#232F3E" strokeWidth="1.5" rx="1"/>
          <rect x="26" y="12" width="14" height="12" fill="none" stroke="#232F3E" strokeWidth="1.5" rx="1"/>
          <rect x="8" y="28" width="32" height="8" fill="none" stroke="#232F3E" strokeWidth="1.5" rx="1"/>
          <text x="15" y="19" fontFamily="Arial" fontSize="6" fill="#232F3E" textAnchor="middle">AZ-A</text>
          <text x="33" y="19" fontFamily="Arial" fontSize="6" fill="#232F3E" textAnchor="middle">AZ-B</text>
          <text x="24" y="33" fontFamily="Arial" fontSize="5" fill="#232F3E" textAnchor="middle">SUBNET</text>
        </svg>
      );
      
    case 'aws-apigateway':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="api-gateway-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#FF6B6B", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#FF4B4B", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#api-gateway-gradient)" rx="4"/>
          <path d="M6 24 L24 6 L42 24 L24 42 Z" fill="#232F3E"/>
          <path d="M10 24 L24 10 L38 24 L24 38 Z" fill="#FF4B4B"/>
          <rect x="16" y="16" width="16" height="16" fill="#232F3E" rx="2"/>
          <path d="M20 20 L28 24 L20 28 Z" fill="#FF4B4B"/>
          <circle cx="12" cy="24" r="2" fill="white"/>
          <circle cx="36" cy="24" r="2" fill="white"/>
        </svg>
      );
      
    case 'aws-dynamodb':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dynamodb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#527FFF", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#3C5998", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect width="48" height="48" fill="url(#dynamodb-gradient)" rx="4"/>
          <rect x="6" y="12" width="36" height="24" fill="#232F3E" rx="2"/>
          <rect x="8" y="14" width="32" height="4" fill="#527FFF"/>
          <rect x="8" y="20" width="32" height="4" fill="#7BB3F0"/>
          <rect x="8" y="26" width="32" height="4" fill="#527FFF"/>
          <rect x="8" y="32" width="32" height="4" fill="#7BB3F0"/>
          <circle cx="12" cy="16" r="1.5" fill="#FFD700"/>
          <circle cx="12" cy="22" r="1.5" fill="#FFD700"/>
          <circle cx="12" cy="28" r="1.5" fill="#FFD700"/>
          <circle cx="12" cy="34" r="1.5" fill="#FFD700"/>
          <rect x="18" y="15" width="8" height="2" fill="#232F3E" rx="1"/>
          <rect x="18" y="21" width="12" height="2" fill="#232F3E" rx="1"/>
          <rect x="18" y="27" width="6" height="2" fill="#232F3E" rx="1"/>
          <rect x="18" y="33" width="10" height="2" fill="#232F3E" rx="1"/>
        </svg>
      );
      
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <text x="12" y="15" textAnchor="middle" fontSize="8" fill="#FF9900">AWS</text>
        </svg>
      );
  }
};

export default AWSIcon;
