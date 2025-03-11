
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDocument, DocumentData } from '../utils/documentUtils';
import Header from '../components/Header';
import ShareCode from '../components/ShareCode';
import DocumentEditor from '../components/DocumentEditor';
import TaskList from '../components/TaskList';
import { toast } from 'sonner';

const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('document');
  const navigate = useNavigate();

  // Load document data
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    try {
      const doc = getDocument(id);
      
      if (doc) {
        setDocument(doc);
      } else {
        toast.error("Document not found");
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error("Failed to load document");
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Refresh document data
  const refreshDocument = () => {
    if (!id) return;
    
    try {
      const doc = getDocument(id);
      
      if (doc) {
        setDocument(doc);
      }
    } catch (error) {
      console.error('Error refreshing document:', error);
    }
  };

  // Set up periodic refresh (real app would use WebSockets)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDocument();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground animate-pulse">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title={document.title} documentId={document.id} showBack={true} />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <ShareCode documentId={document.id} />
        </div>
        
        <Tabs 
          defaultValue="document" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full animate-fade-in"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="document" className="rounded-l-md">Document</TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-r-md">Tasks</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="document" className="page-transition">
            <DocumentEditor document={document} onDocumentUpdate={refreshDocument} />
          </TabsContent>
          
          <TabsContent value="tasks" className="page-transition">
            <TaskList document={document} onDocumentUpdate={refreshDocument} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>EasyCollab - Collaborative documents without the complexity</p>
        </div>
      </footer>
    </div>
  );
};

export default Document;
