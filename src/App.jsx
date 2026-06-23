import { useState, useEffect } from 'react' /* useState is for storing and updating data while useEffect is for running code at specific moments*/
import { supabase } from './supabaseClient' /**/

function App() 
{
  const [bookmarks, setBookmarks] = useState([])

  /*This effectively makes useEffect a lambda, this will be called whenever I need to update something at runtime.*/
  /*The empty array makes it so that the fetBookmarks is called once.*/
  useEffect(() => 
  {
    fetchBookmarks()
  }, [])

  async function fetchBookmarks()
  {
    const {data, error} = await supabase
        .from('bookmarks')
        .select('*, collections(*), bookmark_tags(*, tags(*))')
        .order('created_at', {ascending: false})

    if (error) console.error(error)
    else setBookmarks(data)
  }

  return(
      /*<div className="min-h-screen bg-[#07162E]">*/
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-200 to-blue-500 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookmarks</h1>
        <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
      </div>
  )
  
}
export default App
