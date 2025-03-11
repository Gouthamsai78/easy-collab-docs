
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCodeProps {
  documentId: string;
}

const ShareCode: React.FC<ShareCodeProps> = ({ documentId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(documentId);
      setCopied(true);
      toast.success("Code copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error("Failed to copy code");
    }
  };

  const handleShareDocument = async () => {
    const url = `${window.location.origin}/document/${documentId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my EasyCollab document',
          text: `Join my document with code: ${documentId}`,
          url
        });
        toast.success("Share initiated successfully");
      } catch (error) {
        console.error('Share failed:', error);
        
        // If user cancelled sharing, don't show error
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share document");
        }
      }
    } else {
      // Fallback to copy URL if Web Share API is not available
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Document URL copied to clipboard");
      } catch (error) {
        console.error('Failed to copy URL:', error);
        toast.error("Failed to copy URL");
      }
    }
  };

  return (
    <div className="bg-muted/40 rounded-lg p-4 shadow-sm animate-fade-in">
      <div className="text-sm font-medium mb-2 text-center">Share this document with your team</div>
      <div className="flex items-center justify-center space-x-2">
        <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded border font-mono tracking-wider text-center min-w-[120px]">
          {documentId}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 transition-all duration-300"
          onClick={handleCopyCode}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleShareDocument}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M3.5 5.00006C3.22386 5.00006 3 5.22392 3 5.50006L3 11.5001C3 11.7762 3.22386 12.0001 3.5 12.0001L11.5 12.0001C11.7761 12.0001 12 11.7762 12 11.5001L12 5.50006C12 5.22392 11.7761 5.00006 11.5 5.00006L10.25 5.00006C9.97386 5.00006 9.75 4.7762 9.75 4.50006C9.75 4.22392 9.97386 4.00006 10.25 4.00006L11.5 4.00006C12.3284 4.00006 13 4.67163 13 5.50006L13 11.5001C13 12.3285 12.3284 13.0001 11.5 13.0001L3.5 13.0001C2.67157 13.0001 2 12.3285 2 11.5001L2 5.50006C2 4.67163 2.67157 4.00006 3.5 4.00006L4.75 4.00006C5.02614 4.00006 5.25 4.22392 5.25 4.50006C5.25 4.7762 5.02614 5.00006 4.75 5.00006L3.5 5.00006ZM7.5 1.00006C7.77614 1.00006 8 1.22392 8 1.50006L8 8.50006C8 8.7762 7.77614 9.00006 7.5 9.00006C7.22386 9.00006 7 8.7762 7 8.50006L7 1.50006C7 1.22392 7.22386 1.00006 7.5 1.00006ZM5.64645 2.14651C5.45118 1.95125 5.45118 1.63466 5.64645 1.4394C5.84171 1.24413 6.15829 1.24413 6.35355 1.4394L8.85355 3.9394C9.04882 4.13466 9.04882 4.45125 8.85355 4.64651C8.65829 4.84177 8.34171 4.84177 8.14645 4.64651L5.64645 2.14651Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareCode;
