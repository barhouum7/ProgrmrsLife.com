import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Link from 'next/link'

import { getRecentPosts, getSimilarPosts } from '../services'

const PostWidget = ({ categories, slug }) => {
    const [relatedPosts, setRelatedPosts] = useState([])
    useEffect(() => {
        if (slug) {
            getSimilarPosts(categories, slug)
                .then((result) => setRelatedPosts(result))
                .catch((err) => console.log(err))
            } else {
                getRecentPosts()
                    .then((result) => setRelatedPosts(result))
                    .catch((err) => console.log(err))
            }        
    }, [slug])
    
    console.log(relatedPosts)

    return (
        <div>
            PostWidget
        </div>
    )
}

export default PostWidget