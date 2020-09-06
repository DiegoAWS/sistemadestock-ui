import React from 'react';
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyle = makeStyles((theme) => ({

    dialogWrapper: {
        padding: theme.spacing(2),
        background: 'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(142,142,153,1) 13%, rgba(121,121,121,1) 100%)'
    }
}))


const Popup = ({ title, children, openPopup, setOpenPopup }) => {

    const classes = useStyle()

    return (

        <Dialog open={openPopup} maxWidth='md' classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle>
                <div style={{ display: 'flex' }}>

                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>{title}</Typography>

                    <Button
                        color="secondary"
                        onClick={() => { setOpenPopup(false) }} >
                        <CloseIcon />

                    </Button>

                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )

}
export default Popup;