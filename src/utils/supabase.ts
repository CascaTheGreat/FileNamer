import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
let oldFilenameGlobal = "";

export async function uploadFile(file: Blob, filename: string) {
  const { data, error } = await supabase.storage
    .from("csv-uploads")
    .upload(filename, file);

  if (error) {
    throw error;
  }

  oldFilenameGlobal = filename;

  return data;
}

export async function updateFileName(newFilename: string) {
  const { data, error } = await supabase.storage
    .from("csv-uploads")
    .move(oldFilenameGlobal, newFilename);

  if (error) {
    throw error;
  }

  oldFilenameGlobal = newFilename;

  return data;
}
