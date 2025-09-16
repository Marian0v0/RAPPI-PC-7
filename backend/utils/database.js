
/**
 * SUPABASE CONNECTION
 * @author German Marcillo
 */

const { createClient } = require( '@supabase/supabase-js');

const supabaseUrl = 'https://zowuzxnwcfenpcxrkgqd.supabase.co';
const supabaseKey = 'Rappi12345.67';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

