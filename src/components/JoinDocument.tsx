
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocument } from '../utils/documentUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileSearch } from 'lucide-react';
import { toast } from 'sonner';

const JoinDocument: React.FC = () => {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim()) {
      toast.error("Please enter a document code");
      return;
    }

    setIsJoining(true);
    
    try {
      const document = getDocument(code.trim().toUpperCase());
      
      if (document) {
        toast.success("Document found!");
        
        // Add small delay for animation to complete
        setTimeout(() => {
          navigate(`/document/${document.id}`);
        }, 300);
      } else {
        toast.error("Document not found. Please check the code and try again.");
        setIsJoining(false);
      }
    } catch (error) {
      console.error('Error joining document:', error);
      toast.error("Failed to join document. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border/50 overflow-hidden animate-slide-up shadow-sm delay-100">
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
          <FileSearch className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Join Existing Document</h2>
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter document code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full text-center font-mono text-lg tracking-wider uppercase"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>
          <Button 
            onClick={handleJoin} 
            className="w-full"
            disabled={isJoining}
          >
            {isJoining ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </div>
            ) : (
              <span>Join Document</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinDocument;
