import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { NoteInput, Note } from "@/hooks/useNotes";
import { BookOpen } from "lucide-react";

interface NoteFormProps {
  onSubmit: (note: NoteInput) => void;
  initialData?: Note;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function NoteForm({ onSubmit, initialData, isLoading, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subject, setSubject] = useState(initialData?.subject ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !content.trim()) return;
    onSubmit({ title: title.trim(), subject: subject.trim(), content: content.trim() });
    if (!initialData) {
      setTitle("");
      setSubject("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-body font-medium text-sm">Title</Label>
        <Input
          id="title"
          placeholder="e.g. Photosynthesis Overview"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="font-body font-medium text-sm">Subject</Label>
        <Input
          id="subject"
          placeholder="e.g. Biology"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={50}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="font-body font-medium text-sm">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={5}
          required
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading} className="gap-2">
          <BookOpen className="h-4 w-4" />
          {initialData ? "Save Changes" : "Add Note"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
