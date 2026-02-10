import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NoteForm } from "./NoteForm";
import type { Note, NoteInput } from "@/hooks/useNotes";
import { Pencil, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

interface NoteCardProps {
  note: Note;
  onUpdate: (note: NoteInput & { id: string }) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  index: number;
}

export function NoteCard({ note, onUpdate, onDelete, isUpdating, index }: NoteCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Card
        className="group hover:shadow-lg transition-all duration-200 animate-fade-in border-border/60"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-lg font-display leading-tight truncate">
                {note.title}
              </CardTitle>
              <Badge variant="secondary" className="font-body text-xs font-medium">
                {note.subject}
              </Badge>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(note.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
            {note.content}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Clock className="h-3 w-3" />
            {format(new Date(note.updated_at), "MMM d, yyyy 'at' h:mm a")}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Note</DialogTitle>
          </DialogHeader>
          <NoteForm
            initialData={note}
            isLoading={isUpdating}
            onSubmit={(data) => {
              onUpdate({ ...data, id: note.id });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
