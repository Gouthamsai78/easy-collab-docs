
import React, { useState } from 'react';
import { DocumentData, addTask, updateTask, deleteTask, TaskItem } from '../utils/documentUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TaskListProps {
  document: DocumentData;
  onDocumentUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ document, onDocumentUpdate }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskText.trim()) {
      toast.error("Task text cannot be empty");
      return;
    }

    setIsAdding(true);
    
    try {
      await addTask(document.id, newTaskText.trim());
      setNewTaskText('');
      onDocumentUpdate();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (task: TaskItem) => {
    try {
      await updateTask(document.id, task.id, { completed: !task.completed });
      onDocumentUpdate();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(document.id, taskId);
      onDocumentUpdate();
      toast.success("Task deleted");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            disabled={isAdding}
          />
          <Button 
            onClick={handleAddTask}
            disabled={isAdding || !newTaskText.trim()}
            className="shrink-0"
          >
            {isAdding ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-2">Add</span>
          </Button>
        </div>
        
        <div className="space-y-1">
          {document.tasks.length === 0 ? (
            <div className="text-muted-foreground text-center py-6 border border-dashed rounded-md">
              No tasks yet. Add your first task above.
            </div>
          ) : (
            document.tasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-item group flex items-center p-2 hover:bg-accent/40 rounded-md ${task.completed ? 'completed' : ''}`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task)}
                  className="h-5 w-5 mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <span className={`ml-3 flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors duration-200" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
