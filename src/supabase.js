import { createClient } from "@supabase/supabase-js";
import { useMainStore } from "src/stores/main";

const store = useMainStore();
//supabase
const supabaseKey = store.supabase_Key;
const supabaseUrl = store.supabase_Url;
export const supabase = createClient(supabaseUrl, supabaseKey);
