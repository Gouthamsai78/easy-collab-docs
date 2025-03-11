
import { toast } from "sonner";

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

// Simulate saving document to local storage (in a real app this would connect to a backend)
export function saveDocument(document: DocumentData): void {
  try {
    const documentsMap = getDocumentsMap();
    documentsMap[document.id] = document;
    localStorage.setItem('easycollab_documents', JSON.stringify(documentsMap));
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error("Failed to save document. Please try again.");
  }
}

// Get a document by its ID
export function getDocument(id: string): DocumentData | null {
  try {
    const documentsMap = getDocumentsMap();
    return documentsMap[id] || null;
  } catch (error) {
    console.error('Error getting document:', error);
    toast.error("Failed to retrieve document.");
    return null;
  }
}

// Get all documents map from localStorage
export function getDocumentsMap(): Record<string, DocumentData> {
  try {
    const documents = localStorage.getItem('easycollab_documents');
    return documents ? JSON.parse(documents) : {};
  } catch (error) {
    console.error('Error getting documents:', error);
    return {};
  }
}

// Create a new document
export function createDocument(title: string = 'Untitled Document'): DocumentData {
  const id = generateDocumentCode();
  const now = Date.now();
  
  const newDocument: DocumentData = {
    id,
    title,
    content: '',
    tasks: [],
    createdAt: now,
    lastModified: now
  };
  
  saveDocument(newDocument);
  return newDocument;
}

// Add a task to a document
export function addTask(documentId: string, taskText: string): TaskItem | null {
  const document = getDocument(documentId);
  
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
  
  saveDocument(document);
  return newTask;
}

// Update a task in a document
export function updateTask(documentId: string, taskId: string, updates: Partial<TaskItem>): boolean {
  const document = getDocument(documentId);
  
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
  saveDocument(document);
  return true;
}

// Delete a task from a document
export function deleteTask(documentId: string, taskId: string): boolean {
  const document = getDocument(documentId);
  
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
  saveDocument(document);
  return true;
}

// Update document content
export function updateDocumentContent(documentId: string, content: string): boolean {
  const document = getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  document.content = content;
  document.lastModified = Date.now();
  saveDocument(document);
  return true;
}

// Update document title
export function updateDocumentTitle(documentId: string, title: string): boolean {
  const document = getDocument(documentId);
  
  if (!document) {
    toast.error("Document not found");
    return false;
  }
  
  document.title = title;
  document.lastModified = Date.now();
  saveDocument(document);
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
