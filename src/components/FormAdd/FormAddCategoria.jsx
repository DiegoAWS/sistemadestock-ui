import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, Button, Hidden, TextField } from '@material-ui/core'

import { postRequest } from '../../API/apiFunctions'

import CloseIcon from '@material-ui/icons/Close'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import logo from '../../assets/images/logo.png'
import loading from '../../assets/images/loading.gif'


const useStyle = makeStyles( ( theme ) => ( {

    dialogWrapper: {
        padding: theme.spacing( 2 ),
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',

    }
} ) )




const FormAddCategoria = ( { openPopup, setOpenPopup, formCategorias, setFormCategorias, cargaData } ) =>
{// Abrir y cerrar Dialog ,  Control del Form  y  CallBack de Actuliza from BD

    const [ loadingStatus, setLoadingStatus ] = useState( false )
    const classes = useStyle()



    const saveCategoriaNueva = () =>
    {

        setLoadingStatus( true )


        postRequest( '/categorias', formCategorias )
            .then( () =>
            {
                setLoadingStatus( false )

                setOpenPopup( false )


                cargaData()

            } )



    }



    return (

        <Dialog
            disableBackdropClick
            disableEscapeKeyDown


            open={ openPopup }

            maxWidth={ 'sm' }
            fullWidth
            classes={ { paper: classes.dialogWrapper } }>


            <DialogTitle>
                <div style={ { display: 'flex' } }>

                    <Hidden xsDown >
                        <img src={ logo } height="60px" alt="" /></Hidden>
                    <Typography variant="h6" component="div" style={ { flexGrow: 1, textAlign: 'center' } }>
                        Añadir Categoría
                        </Typography>


                    <Button
                        color="primary"
                        variant="contained"
                        style={ { margin: '10px' } }
                        onClick={ () =>
                        {
                            if ( !loadingStatus )
                                saveCategoriaNueva()
                        } } >


                        { loadingStatus ?
                            < img src={ loading } style={ { width: '20px' } } alt="" /> :
                            <>
                                <Hidden xsDown >
                                    Guardar
                                </Hidden>
                                <SaveAltIcon />
                            </> }


                    </Button>

                    <Button
                        color="secondary"
                        style={ { margin: '10px' } }
                        onClick={ () =>
                        {
                            setFormCategorias( {} )
                            setOpenPopup( false )
                        } } >
                        <CloseIcon />

                    </Button>

                </div>
            </DialogTitle>
            <DialogContent dividers>

                <TextField label='Categoría Nueva' variant="outlined" autoFocus margin='normal' size="small" fullWidth
                    value={ formCategorias.Nombre }
                    onChange={ e => { setFormCategorias( { ...formCategorias, Nombre: e.target.value } ) } } />

            </DialogContent>
        </Dialog>
    )

}
export default FormAddCategoria