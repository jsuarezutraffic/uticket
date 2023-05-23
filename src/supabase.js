import { createClient } from "@supabase/supabase-js";
import { useMainStore } from "src/stores/main";

const store = useMainStore();
//supabase
// const supabaseKey = store.supabase_Key;
// const supabaseKey = store.supabase_Key;
const supabaseUrl = store.supabase_Url;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b3ZrbmprZGZ5a3Z4aW1wZ3hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzMyMjY2NCwiZXhwIjoxOTk4ODk4NjY0fQ.Vm7vlm4xnk5FxXwTR66_GcFw8iF5SISvo8U9JRwXvh0';
export const supabase = createClient(supabaseUrl, supabaseKey);
