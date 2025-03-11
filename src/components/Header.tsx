
import React from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  documentId?: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, documentId, showBack = false }) => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full px-6 py-5 border-b border-border/40 bg-background/70 backdrop-blur-md sticky top-0 z-10 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 mr-2"
              aria-label="Back to home"
            >
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
          ) : (
            <FileText className="h-5 w-5 text-primary" />
          )}
          <h1 className="text-xl font-medium animate-fade-in truncate">
            {title || 'EasyCollab'}
          </h1>
        </div>
        
        {documentId && (
          <div className="flex items-center">
            <div className="text-sm text-muted-foreground animate-fade-in">
              Document code: <span className="font-medium">{documentId}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
