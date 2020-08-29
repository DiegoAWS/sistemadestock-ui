import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyle = makeStyles({
    posts: {
        width: '90%',
        margin: 'auto'
    }
})


const Post = props => {

    const clases = useStyle()

    const [post, setPost] = useState([])


    useEffect(() => {

        fetch('http://localhost:5000/api')
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(e => console.log(e))

    }, []);

    const postItems = post.reverse().map(post => (
        <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
        </div>
    ))

    return (

        <div className={clases.posts}>
            <PostForm />
            <h1>Post!</h1>
            <hr />
            {postItems}
        </div>
    )

}
export default Post;