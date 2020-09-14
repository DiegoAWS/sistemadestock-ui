import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, Button, Hidden } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SaveAltIcon from '@material-ui/icons/SaveAlt'


const useStyle = makeStyles( ( theme ) => ( {

    dialogWrapper: {
        padding: theme.spacing( 2 ),
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',

    }
} ) )


const Popup = ( { title, clearform, children, openPopup, setOpenPopup, recolocaEditItem, logo, saveData } ) =>
{




    const classes = useStyle()

    return (

        <Dialog
            disableBackdropClick
            disableEscapeKeyDown


            open={ openPopup }

            maxWidth='md'

            classes={ { paper: classes.dialogWrapper } }>


            <DialogTitle>
                <div style={ { display: 'flex' } }>

                    <Hidden xsDown >
                        <img src={ logo } height="60px" alt="" /></Hidden>
                    <Typography variant="h6" component="div" style={ { flexGrow: 1, textAlign: 'center' } }>{ title }</Typography>


                    <Button
                        color="primary"
                        variant="contained"
                        style={ { margin: '10px' } }
                        onClick={ () => { saveData() } } >
                        <Hidden xsDown >
                            Guardar</Hidden>
                        <SaveAltIcon />
                    </Button>

                    <Button
                        color="secondary"
                        style={ { margin: '10px' } }
                        onClick={ () =>
                        {
                            if ( title.includes( 'Editar' ) )
                                recolocaEditItem()


                            setOpenPopup( false )
                        } } >
                        <CloseIcon />

                    </Button>

                </div>
            </DialogTitle>
            <DialogContent dividers>
                { children }
            </DialogContent>
        </Dialog>
    )

}
export default Popup