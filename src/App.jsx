import { useState, useEffect } from 'react' /* useState is for storing and updating data while useEffect is for running code at specific moments*/
import { supabase } from './supabaseClient' /**/
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'
import Sidebar from './Sidebar'

function App() 
{
    const [bookmarks, setBookmarks] = useState([])
    const [collections, setCollections] = useState([])
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState({ type: null, value: null })
  
    /*This effectively makes useEffect a lambda, this will be called whenever I need to update something at runtime.*/
    /*The empty array makes it so that the fetBookmarks is called once.*/
    useEffect(() => 
    {
      fetchAll()
    }, [])
  
    async function fetchAll() 
    {
      const [{ data: bookmarks }, { data: collections }, { data: tags }] = await Promise.all([
        supabase.from('bookmarks').select('*, collections(*), bookmark_tags(*, tags(*))').order('created_at', { ascending: false }),
        supabase.from('collections').select('*'),
        supabase.from('tags').select('*')
      ])
      setBookmarks(bookmarks || [])
      setCollections(collections || [])
      setTags(tags || [])
    }

  function handleFilterChange(type, value) {
    if (value === null) {
      setFilter({ type: null, value: null })
    } else {
      setFilter({ type, value })
    }
  }

  const filteredBookmarks = bookmarks
      .filter(b => {
        if (filter.type === 'collection') return b.collection_id === filter.value
        if (filter.type === 'tag') return b.bookmark_tags.some(bt => bt.tag_id === filter.value)
        return true
      })
      .filter(b => {
        if (!search) return true
        return b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.url.toLowerCase().includes(search.toLowerCase())
      })
    
  
    return(
        /*<div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-200 to-blue-500 p-8">
          <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookmarks</h1>
            <pre>{JSON.stringify(bookmarks, null, 2)}</pre>
          </div>
        </div>*/
        
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-200 to-blue-500 p-8">
          <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Bookmark Manager</h1>
            <div className="flex gap-8">
              <div className="w-48 shrink-0">
                <Sidebar collections={collections} tags={tags} onFilterChange={handleFilterChange} onDataChanged={fetchAll} />
              </div>
              <div className="flex-1">
                <input value={search} onChange={e => setSearch(e.target.value)}
                       placeholder="Search bookmarks..." className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 bg-white mb-6" />
                <BookmarkForm collections={collections} tags={tags} onBookmarkAdded={fetchAll} />
                <BookmarkList bookmarks={filteredBookmarks} onBookmarkDeleted={fetchAll} />
              </div>
            </div>
          </div>
        </div>
        
    )
  
}
export default App
