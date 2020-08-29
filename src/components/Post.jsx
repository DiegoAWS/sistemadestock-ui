import React from 'react';
import PostForm from './PostForm';
import makeStyles from '@material-ui/core/styles/makeStyles'

import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPost } from '../redux/actions/postActions'


const useStyle = makeStyles({
    posts: {
        width: '90%',
        margin: 'auto'
    }
})


const Post = ({posts}) => {

    const clases = useStyle()

   
   
    const postItems = posts.reverse().map(post => (
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


Post.propTypes={
    fetchPost:propTypes.func.isRequired,
    posts:propTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    posts: state.data.items
})



export default connect(mapStateToProps, fetchPost)(Post);