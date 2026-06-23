import { useState } from 'react'
import { supabase } from './supabaseClient'
function BookmarkForm({collections, tags, onBookmarkAdded})
{
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [notes, setNotes] = useState('')
    const [collectionId, setCollectionId] = useState('')
    const [selectedTags, setSelectedTags] = useState([])

    async function handleSubmit(e) 
    {
        e.preventDefault()
        
        const {data: bookmark, error} = await supabase
            .from('bookmarks')
            .insert({title, url, notes, collection_id: collectionId || null})
            .select()
            .single()
        
        if (error) 
        {
            if (error.code === '23505')
                alert('This URL has already been bookmarked!')
            else
                console.error(error); 
            return 
        }
        
        if(selectedTags.length > 0)
        {
            const tagLinks = selectedTags.map(tagId => ({
                bookmark_id: bookmark.id,
                tag_id: tagId
            }))
            await supabase.from('bookmark_tags').insert(tagLinks)

            setTitle(''); setUrl(''); setNotes(''); setCollectionId(''); setSelectedTags([])
            onBookmarkAdded()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Add Bookmark</h2>
            <div className="flex flex-col gap-3">
                <input required value={title} onChange={e => setTitle(e.target.value)}
                       placeholder="Title" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <input required value={url} onChange={e => setUrl(e.target.value)}
                       placeholder="URL" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                          placeholder="Notes (optional)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
                <select value={collectionId} onChange={e => setCollectionId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                    <option value="">No collection</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <button type="button" key={tag.id} onClick={() => toggleTag(tag.id)}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTags.includes(tag.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                            {tag.name}
                        </button>
                    ))}
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                    Save Bookmark
                </button>
            </div>
        </form>
    )
}

export default BookmarkForm