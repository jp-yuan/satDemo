import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase credentials
const supabaseUrl = 'https://paapvragfcrypyclcyzm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB2cmFnZmNyeXB5Y2xjeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTAxMTAsImV4cCI6MjA2MjIyNjExMH0.BHDA7fK-k5_UP2pZ1cgB2qHqiCo0804CxKKq0UdxstI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fetchMathQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_number', '1')

  if (error) {
    throw new Error(`Error fetching math questions: ${error.message}`)
  }

  return data
}
fetchMathQuestions()
  .then(data => {
    console.log('Math questions loaded:', data.length, 'questions');
    console.log('Sample question:', data[0]);
    console.log('Sample question:', data[1]);
    console.log('Sample question:', data[2]);
    console.log('Sample question:', data[3]);
    console.log('Sample question:', data[4]);
    console.log('Sample question:', data[5]);
    console.log('Sample question:', data[6]);
    console.log('Sample question:', data[7]);
    console.log('Sample question:', data[8]);
    console.log('Sample question:', data[9]);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
