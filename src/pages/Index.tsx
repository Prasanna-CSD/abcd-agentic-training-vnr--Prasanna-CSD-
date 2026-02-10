import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useAuth } from "@/hooks/useAuth";
import { NoteForm } from "@/components/NoteForm";
import { NoteCard } from "@/components/NoteCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, StickyNote, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuth();
  const { notesQuery, createNote, updateNote, deleteNote } = useNotes(user?.id);
  const [showForm, setShowForm] = useState(false);

  const notes = notesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">Student Notes</h1>
              <p className="text-xs font-body text-muted-foreground">Organize your study notes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                await signOut();
                toast.success("Logged out!");
              }}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-8">
        {/* Create Form */}
        {showForm && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="font-display text-lg">Create a New Note</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteForm
                onSubmit={(data) => {
                  createNote.mutate(data);
                  setShowForm(false);
                }}
                isLoading={createNote.isPending}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Notes Grid */}
        {notesQuery.isLoading ? (
          <div className="text-center py-16 text-muted-foreground font-body">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <StickyNote className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold">No notes yet</h2>
              <p className="text-sm text-muted-foreground font-body">
                Click "New Note" to create your first study note.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                onUpdate={(data) => updateNote.mutate(data)}
                onDelete={(id) => deleteNote.mutate(id)}
                isUpdating={updateNote.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
