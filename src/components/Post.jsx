import React, { useEffect } from 'react';
import PostForm from './PostForm';
import makeStyles from '@material-ui/core/styles/makeStyles'


import { connect } from 'react-redux'
import { FETCH_POST } from "../redux/types"

const useStyle = makeStyles({
    posts: {
        width: '90%',
        margin: 'auto'
    }
})


const Post = ({ posted, data, getData }) => {

    const clases = useStyle()

    useEffect(() => {

        getData()
        
       // eslint-disable-next-line 
    }, [posted])



    const ReverseArray = (Arr) => Arr.sort((a, b) => (b.id - a.id))


    return (

        <div className={clases.posts}>
            <PostForm update={getData} />
            <h1>Post!</h1>
            <hr />
            {ReverseArray(data).map((post, i) => (
                <div key={i}>
                    <span>{post.id}</span>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    )

}




const mapStateToProps = (state) => ({
    data: state.data.items,
    posted: state.data.posted
})

const mapDispatchToProps = (dispatch) => ({

    getData() {
        fetch("http://localhost:5000/api")
            .then((res) => res.json())
            .then((posts) =>
                dispatch({
                    type: FETCH_POST,
                    payload: posts,
                })
            )
    }
})





export default connect(mapStateToProps, mapDispatchToProps)(Post);