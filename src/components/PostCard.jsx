import React from 'react'
import appwriteService from '../appwrite/config.js'
import { Link } from 'react-router-dom'

function PostCard({$id, title, featuredImage}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className="w-full bg-amber-200 border-2 border-amber-300 rounded-xl up-4">
            <div className="w-full justify-center items-center mb-4">
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className="rounded-xl mx-auto " />
            </div>
                <h2 className='text-lg font-bold text-center font-serif'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard