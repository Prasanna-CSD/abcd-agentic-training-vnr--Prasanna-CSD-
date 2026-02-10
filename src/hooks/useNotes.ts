import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type NoteInput = Pick<Note, "title" | "subject" | "content">;

export function useNotes(userId?: string) {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes", userId],
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const createNote = useMutation({
    mutationFn: async (note: NoteInput) => {
      const { data, error } = await supabase.from("notes").insert({ ...note, user_id: userId }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      toast.success("Note created!");
    },
    onError: () => toast.error("Failed to create note"),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...note }: NoteInput & { id: string }) => {
      const { data, error } = await supabase.from("notes").update(note).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      toast.success("Note updated!");
    },
    onError: () => toast.error("Failed to update note"),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      toast.success("Note deleted!");
    },
    onError: () => toast.error("Failed to delete note"),
  });

  return { notesQuery, createNote, updateNote, deleteNote };
}
