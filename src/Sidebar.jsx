import { useState } from 'react'
import { supabase } from './supabaseClient'

function Sidebar({ collections, tags, onFilterChange, onDataChanged })
{
    const [newCollection, setNewCollection] = useState('')
    const [newTag, setNewTag] = useState('')


    async function addCollection() {
        if (!newCollection.trim()) return
        const { error } = await supabase.from('collections').insert({ name: newCollection.trim() })
        if (error) console.error(error)
        else { setNewCollection(''); onDataChanged() }
    }    
    async function addTag() {
        if (!newTag.trim()) return
        const { error } = await supabase.from('tags').insert({ name: newTag.trim() })
        if (error) console.error(error)
        else { setNewTag(''); onDataChanged() }
    }

    async function deleteCollection(id) {
        const { error } = await supabase.from('collections').delete().eq('id', id)
        if (error) console.error(error)
        else onDataChanged()
    }

    async function deleteTag(id) {
        const { error } = await supabase.from('tags').delete().eq('id', id)
        if (error) console.error(error)
        else onDataChanged()
    }
    
    

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-xs font-medium text-gray-800 mb-83">Collections</h3>
                <div className="flex flex-col gap-1 mb-3">
                    <button onClick={() => onFilterChange('collection', null)}
                            className="text-left text-sm text-gray-600 hover:text-blue-500 py-1 transition-colors">
                        All bookmarks
                    </button>
                    {collections.map(c => (
                        <div key={c.id} className="flex items-center justify-between group">
                            <button onClick={() => onFilterChange('collection', c.id)}
                                    className="text-left text-sm text-gray-600 hover:text-blue-500 py-1 transition-colors">
                                {c.name}
                            </button>
                            <button onClick={() => deleteCollection(c.id)}
                                    className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={newCollection} onChange={e => setNewCollection(e.target.value)}
                           placeholder="New collection" className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-400 flex-1" />
                    <button onClick={addCollection} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 text-xs transition-colors">
                        Add
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-medium text-gray-800 mb-8">Tags</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                    {tags.map(tag => (
                        <div key={tag.id} className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-0.5">
                            <button onClick={() => onFilterChange('tag', tag.id)}
                                    className="text-blue-500 text-xs hover:text-blue-700 transition-colors">
                                {tag.name}
                            </button>
                            <button onClick={() => deleteTag(tag.id)}
                                    className="text-blue-300 hover:text-red-400 text-xs transition-colors">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={newTag} onChange={e => setNewTag(e.target.value)}
                           placeholder="New tag" className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-400 flex-1" />
                    <button onClick={addTag} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 text-xs transition-colors">
                        Add
                    </button>
                </div>
            </div>
        </div>
    )

}

export default Sidebar
