import React from 'react';

import { connect } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { ADD_COUNTER, FORM_CHANGE,CLEAR_FORM,POSTED } from "../redux/types"


const useStyle = makeStyles({
    root: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',

        '& input': {
            margin: '10px',
            borderRadius: '10px'
        }
    },

    bodyTextArea: {
        width: '90%'
    }
})



const PostForm = ({ counter, addCounter, formData, handleForm,clearForm,posted }) => {

    const clases = useStyle()



    const submit = () => {


        fetch("http://localhost:5000/api", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then( posted()        )
            .catch((e) => console.log(e))

    
       clearForm()
    }

    const click = (e) => {
        e.preventDefault()

        addCounter()

    }
    return (
        <div>
            <div className={clases.root}>
                <br />
                <h1>Add Post</h1>
                <br /><br />

                <form>
                    <button onClick={click}>Value:{counter}</button>

                    <input type="text"
                        placeholder="title"
                        name='name'
                        value={formData.name}
                        onChange={(e) => handleForm(e)} />

                    <input type="button" value="Submit!" onClick={() => submit()} />

                    <input type="text"
                        placeholder="body"
                        name='coment'
                        className={clases.bodyTextArea}
                        value={formData.coment}
                        onChange={(e) => handleForm(e)} />
                </form>
            </div>
        </div>
    )

}
const mapStateToProps = (state) => ({
    counter: state.data.counter,
    formData: {
        name: state.data.name,
        coment: state.data.coment
    }
})
const mapDispatchToProps = (dispatch) => ({
    addCounter() {
        dispatch({
            type: ADD_COUNTER
        })
    },
    handleForm(item) {
        dispatch({
            type: FORM_CHANGE,
            payload: {
                element: item.target.name,
                value: item.target.value
            }
        })
    },
    clearForm(){
        dispatch({
            type:CLEAR_FORM
        })
    
    },
    posted(){
        dispatch({
            type:POSTED
        })
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(PostForm)