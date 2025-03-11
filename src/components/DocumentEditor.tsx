
import React, { useState, useEffect, useRef } from 'react';
import { updateDocumentContent, updateDocumentTitle, formatDate, DocumentData } from '../utils/documentUtils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DocumentEditorProps {
  document: DocumentData;
  onDocumentUpdate: () => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, onDocumentUpdate }) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize content from document
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = document.content;
    }
    setTitle(document.title);
    setContent(document.content);
    setLastSaved(formatDate(document.lastModified));
  }, [document]);

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Debounce saving title changes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      updateDocumentTitle(document.id, newTitle);
      setLastSaved(formatDate(Date.now()));
      onDocumentUpdate();
    }, 500);
  };

  // Handle content change
  const handleContentChange = () => {
    if (!contentRef.current) return;
    
    const newContent = contentRef.current.innerHTML;
    setContent(newContent);
    
    // Debounce saving content changes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      updateDocumentContent(document.id, newContent);
      setLastSaved(formatDate(Date.now()));
      onDocumentUpdate();
    }, 500);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="mb-6">
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-primary"
          placeholder="Untitled Document"
        />
      </div>
      
      <div 
        ref={contentRef}
        className="editor-content prose prose-sm sm:prose max-w-none min-h-[calc(100vh-300px)]"
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        placeholder="Start typing your document..."
      />
      
      {lastSaved && (
        <div className="text-xs text-muted-foreground mt-4 animate-fade-in">
          Last saved: {lastSaved}
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
