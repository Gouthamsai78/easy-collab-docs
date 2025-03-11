
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CreateDocument from '../components/CreateDocument';
import JoinDocument from '../components/JoinDocument';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                Collaborative documents <span className="relative inline-block">
                  <span className="relative z-10">without the hassle</span>
                  <span className="absolute bottom-1.5 left-0 w-full h-3 bg-primary/10 rounded-sm -z-10"></span>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create and share documents or to-do lists with your team instantly.
                No sign-up required.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <Link to="/documents">
              <Button variant="outline" className="animate-fade-in">
                <ListFilter className="w-4 h-4 mr-2" />
                View All Documents
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <CreateDocument />
            <JoinDocument />
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in delay-200">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Simple Documents</h3>
              <p className="text-sm text-muted-foreground">
                Create rich text documents with your team in seconds
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.0915 1.99162C10.7086 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">No Sign-Up Needed</h3>
              <p className="text-sm text-muted-foreground">
                Just create or join with a simple 6-character code
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM2 6C2 5.44772 2.44772 5 3 5H12C12.5523 5 13 5.44772 13 6V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12V6ZM12 6H3V12H12V6Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Task Lists</h3>
              <p className="text-sm text-muted-foreground">
                Create to-do lists and track progress together
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>EasyCollab - Collaborative documents without the complexity</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
