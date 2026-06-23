import { supabase } from './supabaseClient'


function BookmarkList({ bookmarks, onBookmarkDeleted }) 
{
    async function handleDelete(id) 
    {
        const {error} = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) console.error(error)
        else onBookmarkDeleted()
    }

    return (
        <div className="flex flex-col gap-4">
            {bookmarks.length === 0 && (
                <p className="text-gray-400 text-sm">No bookmarks yet. Add one above!</p>
            )}
            {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <a href={bookmark.url} target="_blank" rel="noreferrer"
                               className="text-blue-500 font-medium hover:underline">
                                {bookmark.title}
                            </a>
                            <p className="text-gray-400 text-xs mt-1">{bookmark.url}</p>
                            {bookmark.notes && <p className="text-gray-600 text-sm mt-2">{bookmark.notes}</p>}
                            {bookmark.collections && (
                                <span className="text-xs text-purple-500 mt-2 inline-block">
                  {bookmark.collections.name}
                </span>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {bookmark.bookmark_tags.map(bt => (
                                    <span key={bt.tag_id} className="bg-blue-50 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                    {bt.tags.name}
                  </span>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(bookmark.id)}
                                className="text-gray-300 hover:text-red-400 text-sm transition-colors">
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookmarkList
