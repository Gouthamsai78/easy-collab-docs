import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDocument, DocumentData, createDocument } from '../utils/documentUtils';
import { supabase } from '@/integrations/supabase/client';
import Header from '../components/Header';
import ShareCode from '../components/ShareCode';
import DocumentEditor from '../components/DocumentEditor';
import TaskList from '../components/TaskList';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('document');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchDocument = async () => {
      try {
        const doc = await getDocument(id);
        
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
    };

    fetchDocument();
  }, [id, navigate]);

  const refreshDocument = async () => {
    if (!id) return;
    
    try {
      const doc = await getDocument(id);
      
      if (doc) {
        setDocument(doc);
      }
    } catch (error) {
      console.error('Error refreshing document:', error);
    }
  };

  useEffect(() => {
    if (!id) return;

    const documentChannel = supabase
      .channel('document-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents', filter: `id=eq.${id}` },
        () => {
          console.log('Document changed, refreshing...');
          refreshDocument();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `document_id=eq.${id}` },
        () => {
          console.log('Tasks changed, refreshing...');
          refreshDocument();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(documentChannel);
    };
  }, [id]);

  const handleCreateNewDocument = async () => {
    try {
      const doc = await createDocument();
      toast.success("New document created!");
      navigate(`/document/${doc.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error("Failed to create new document");
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <ShareCode documentId={document.id} />
          <Button
            onClick={handleCreateNewDocument}
            variant="outline"
            className="ml-4"
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New Document
          </Button>
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
