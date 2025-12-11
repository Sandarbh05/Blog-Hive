import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from '../appwrite/config'
import {useNavigate, useParams} from "react-router-dom"

function EditPost() {
    const [post,setPosts]=useState(null)
    const {slug}=useParams()
    const navigate=useNavigate()

    useEffect(()=>{

        console.log("This is EditPost's slug :", slug, "This is its post", post)
        if(slug){   
            appwriteService.getPost(slug).then((post)=>{
                if(post){
                    setPosts(post)
                }
            })

        } else{
            navigate("/")
        }
    }, [navigate, slug])

  return post ? (
    <div className="py-8">
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  ) : null
    
  
}

export default EditPost