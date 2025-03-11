import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Document type definition
export interface DocumentData {
  id: string;
  title: string;
  content: string;
  tasks: TaskItem[];
  createdAt: number;
  lastModified: number;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Generate a random document code (6 alphanumeric characters)
export function generateDocumentCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

// Save document to Supabase
export async function saveDocument(document: DocumentData): Promise<void> {
  try {
    console.log("Saving document:", document);
    // First, save the document to the documents table
    const { error: documentError } = await supabase
      .from('documents')
      .upsert({
        id: document.id,
        title: document.title,
        content: document.content,
        last_modified: new Date().toISOString()
      });

    if (documentError) {
      console.error("Error upserting document:", documentError);
      throw documentError;
    }

    // Get existing tasks for this document
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('document_id', document.id);
    
    // Create a map of existing task IDs for quick lookup
    const existingTaskIds = new Set((existingTasks || []).map(task => task.id));
    
    // Process each task - either update or create new
    for (const task of document.tasks) {
      const { error: taskError } = await supabase
        .from('tasks')
        .upsert({
          id: task.id,
          document_id: document.id,
          text: task.text,
          completed: task.completed,
          created_at: new Date(task.createdAt).toISOString()
        });
      
      if (taskError) {
        console.error("Error upserting task:", taskError);
        throw taskError;
      }
      
      // Remove this ID from the set as we've processed it
      existingTaskIds.delete(task.id);
    }
    
    // Delete any tasks that are no longer in the document
    if (existingTaskIds.size > 0) {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .in('id', Array.from(existingTaskIds));
      
      if (deleteError) {
        console.error("Error deleting tasks:", deleteError);
        throw deleteError;
      }
    }
    
    console.log("Document saved successfully");
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error("Failed to save document. Please try again.");
    throw error;
  }
}

// Get a document by its ID
export async function getDocument(id: string): Promise<DocumentData | null> {
  try {
    console.log("Getting document with ID:", id);
    // Get the document
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (documentError) {
      if (documentError.code === 'PGRST116') {
        console.error("Document not found:", id);
        // Document not found
        return null;
      }
      console.error("Error fetching document:", documentError);
      throw documentError;
    }
    
    // Get tasks for this document
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('document_id', id);
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }
    
    // Convert the data to our application format
    const documentData: DocumentData = {
      id: document.id,
      title: document.title,
      content: document.content || '',
      tasks: (tasks || []).map(task => ({
        id: task.id,
        text: task.text,
        completed: task.completed,
        createdAt: new Date(task.created_at).getTime()
      })),
      createdAt: new Date(document.created_at).getTime(),
      lastModified: new Date(document.last_modified).getTime()
    };
    
    console.log("Document retrieved successfully:", documentData);
    return documentData;
  } catch (error) {
    console.error('Error getting document:', error);
    toast.error("Failed to retrieve document.");
    return null;
  }
}

// Create a new document
export async function createDocument(title: string = 'Untitled Document'): Promise<DocumentData> {
  try {
    const id = generateDocumentCode();
    const now = Date.now();
    
    console.log("Creating new document with ID:", id);
    
    const newDocument: DocumentData = {
      id,
      title,
      content: '',
      tasks: [],
      createdAt: now,
      lastModified: now
    };
    
    await saveDocument(newDocument);
    console.log("Document created successfully:", newDocument);
    return newDocument;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

// Add a task to a document
export async function addTask(documentId: string, taskText: string): Promise<TaskItem | null> {
  const document = await getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return null;
  }
  
  const newTask: TaskItem = {
    id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: taskText,
    completed: false,
    createdAt: Date.now()
  };
  
  document.tasks.push(newTask);
  document.lastModified = Date.now();
  
  await saveDocument(document);
  return newTask;
}

// Update a task in a document
export async function updateTask(documentId: string, taskId: string, updates: Partial<TaskItem>): Promise<boolean> {
  const document = await getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  const taskIndex = document.tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    toast.error("Task not found");
    return false;
  }
  
  document.tasks[taskIndex] = {
    ...document.tasks[taskIndex],
    ...updates
  };
  
  document.lastModified = Date.now();
  await saveDocument(document);
  return true;
}

// Delete a task from a document
export async function deleteTask(documentId: string, taskId: string): Promise<boolean> {
  const document = await getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  const taskIndex = document.tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    toast.error("Task not found");
    return false;
  }
  
  document.tasks.splice(taskIndex, 1);
  document.lastModified = Date.now();
  await saveDocument(document);
  return true;
}

// Update document content
export async function updateDocumentContent(documentId: string, content: string): Promise<boolean> {
  const document = await getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  document.content = content;
  document.lastModified = Date.now();
  await saveDocument(document);
  return true;
}

// Update document title
export async function updateDocumentTitle(documentId: string, title: string): Promise<boolean> {
  const document = await getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  document.title = title;
  document.lastModified = Date.now();
  await saveDocument(document);
  return true;
}

// Format date for display
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}
