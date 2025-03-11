
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDocument } from '../utils/documentUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus } from 'lucide-react';
import { toast } from 'sonner';

const CreateDocument: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    setIsCreating(true);
    
    try {
      const documentTitle = title.trim() || 'Untitled Document';
      const newDocument = createDocument(documentTitle);
      
      toast.success("Document created successfully!");
      
      // Add small delay for animation to complete
      setTimeout(() => {
        navigate(`/document/${newDocument.id}`);
      }, 300);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error("Failed to create document. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border/50 overflow-hidden animate-slide-up shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
          <FilePlus className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Create a New Document</h2>
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Document title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <Button 
            onClick={handleCreate} 
            className="w-full group relative btn-shine overflow-hidden"
            disabled={isCreating}
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              <span>Create Document</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;
