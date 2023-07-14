import { createClient } from "@supabase/supabase-js";
import { useMainStore } from "src/stores/main";
const store = useMainStore();
const supabaseUrl = store.supabase_Url;
const supabaseKeyAdmi = store.supabase_Key_Admi;
export const supabase = createClient(supabaseUrl, supabaseKeyAdmi);
