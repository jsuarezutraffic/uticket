import { createClient } from "@supabase/supabase-js";
import { useMainStore } from "src/stores/main";

const store = useMainStore();
const supabaseKeyAdmi = store.supabase_Key_Admi;
const supabaseUrl = store.supabase_Url;
export const supabase = createClient(supabaseUrl, supabaseKeyAdmi);
