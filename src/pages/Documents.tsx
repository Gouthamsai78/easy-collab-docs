
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDocuments, createDocument, DocumentData, formatDate } from '../utils/documentUtils';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { FilePlus, ExternalLink, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getAllDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleCreateDocument = async () => {
    try {
      setCreating(true);
      const doc = await createDocument();
      toast.success("New document created!");
      navigate(`/document/${doc.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error("Failed to create new document");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="My Documents" showBack={true} />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Documents</h1>
          <Button onClick={handleCreateDocument} disabled={creating}>
            {creating ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                Creating...
              </div>
            ) : (
              <>
                <FilePlus className="w-4 h-4 mr-2" />
                New Document
              </>
            )}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground animate-pulse">Loading documents...</p>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">No Documents Found</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any documents yet. Create your first document to get started.
              </p>
              <Button onClick={handleCreateDocument}>
                <FilePlus className="w-4 h-4 mr-2" />
                Create Your First Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="border border-border bg-card rounded-lg p-5 hover:border-primary/30 hover:bg-accent/10 transition-colors cursor-pointer"
                onClick={() => navigate(`/document/${doc.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg truncate flex-1">{doc.title}</h3>
                  <div className="text-xs bg-primary/10 text-primary rounded-md px-2 py-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDate(doc.lastModified)}</span>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {doc.content ? doc.content.replace(/<[^>]*>/g, '') || 'No content yet' : 'No content yet'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    ID: {doc.id}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/document/${doc.id}`);
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>EasyCollab - Collaborative documents without the complexity</p>
        </div>
      </footer>
    </div>
  );
};

export default Documents;
