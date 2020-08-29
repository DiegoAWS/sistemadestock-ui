import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyle = makeStyles({
    root: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        '& input': {
            margin: '10px'
        }
    },

    bodyTextArea: {
        width: '90%'
    }
})



const PostForm = props => {

    const clases = useStyle()

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const submit = () => {
 console.log('Here')

        const post = {
            title,
            body
        }

        fetch('http://localhost:5000/api', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(post)
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))


            setTitle('')
            setBody('')
    }

    return (
        <div>
            <div className={clases.root}>
                <br />
                <h1>Add Post</h1>
                <br /><br />

                <form>
                    <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="button" value="Submit!" onClick={() => submit()} />
                    <input type="text" placeholder="body" className={clases.bodyTextArea} value={body} onChange={(e) => setBody(e.target.value)} />
                </form>
            </div>
        </div>
    )

}
export default PostForm;