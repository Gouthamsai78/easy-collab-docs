
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
  const [isSaving, setIsSaving] = useState(false);
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
    
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateDocumentTitle(document.id, newTitle);
        setLastSaved(formatDate(Date.now()));
        onDocumentUpdate();
      } catch (error) {
        console.error('Error saving title:', error);
      } finally {
        setIsSaving(false);
      }
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
    
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateDocumentContent(document.id, newContent);
        setLastSaved(formatDate(Date.now()));
        onDocumentUpdate();
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        setIsSaving(false);
      }
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
      
      <div className="text-xs text-muted-foreground mt-4 animate-fade-in flex items-center">
        {isSaving ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : lastSaved ? (
          <span>Last saved: {lastSaved}</span>
        ) : null}
      </div>
    </div>
  );
};

export default DocumentEditor;
