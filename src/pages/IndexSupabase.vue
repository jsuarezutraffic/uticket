<template>
<h1>hpla</h1>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'
import { process } from 'ipaddr.js';
import { useMainStore } from 'src/stores/main';
const store = useMainStore()
const supabaseKey = store.supabase_Key;
const supabaseUrl = store.supabase_Url;
const supabase = createClient(supabaseUrl, supabaseKey);

let concesion = await supabase
  .from('concesion')
  .select()
console.log(concesion)

//login
// const { data, error } = await supabase.auth.signInWithPassword({
//   email: 'jsuarez@utraffic.co',
//   password: '12345',
// })
console.log(data)



</script>
