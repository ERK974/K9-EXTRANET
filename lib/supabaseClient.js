import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://azovpxruloorbaipthrs.supabase.co"
const supabaseAnonKey = "sb_publishable_JJcHXzgfkSSq-FfHSG_sYw_6HTcJobY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)