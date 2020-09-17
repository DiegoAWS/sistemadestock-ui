import React, { useState } from 'react'

import { TextField, Grid, Dialog, Hidden, Typography, Button, DialogContent, makeStyles, DialogTitle, Divider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SaveAltIcon from '@material-ui/icons/SaveAlt'


import logo from '../../assets/images/logo.png'
import ProveedoresSelect from './ProveedoresSelect'




const useStyle = makeStyles( ( theme ) => ( {

    dialogWrapper: {
        padding: theme.spacing( 2 ),
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',

    }
} ) )


const MakeCompra = ( { openPopup, setOpenPopup, saveData } ) =>
{
    const classes = useStyle()


    const [ facturaCompra, setFacturaCompra ] = useState( '' )
    const [ fechaCompra, setFechaCompra ] = useState( ( new Date() ).toISOString().slice( 0, 10 ) )

    return (

        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            scroll='paper'

            open={ openPopup }

            maxWidth='xl'
            fullWidth
            classes={ { paper: classes.dialogWrapper } }>


            <DialogTitle disableTypography>
                <Grid container spacing={ 3 }>
                    <Grid item xs={ 12 } style={ { display: 'flex' } }>
                        <Hidden xsDown >
                            <img src={ logo } height="60px" alt="" />
                        </Hidden>
                        <Typography variant="h6" component="div" style={ { flexGrow: 1, textAlign: 'center' } }>{ 'Añadir Compra al Stock' }</Typography>


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
                            onClick={ () => { setOpenPopup( false ) } }
                        >
                            <CloseIcon />

                        </Button>




                    </Grid>
                    <Divider />
                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <TextField label='Factura de Compra' variant="outlined"
                            margin='normal' size="small" fullWidth
                            value={ facturaCompra } onChange={ e => { setFacturaCompra( e.target.value ) } } />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Fecha de Compra' type="date" value={ fechaCompra }

                            onChange={ e => { setFechaCompra( e.target.value ) } }
                            InputLabelProps={ {
                                shrink: true,
                            } }
                            fullWidth />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <ProveedoresSelect />
                    </Grid>
                    <Hidden smDown lgUp > <Grid item md={ 6 } ></Grid></Hidden>
                    <Grid item xs={ 12 } sm={ 6 } >
                        <TextField label='Factura de Compra' variant="outlined"
                            margin='normal' size="small" fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={ 3 }>

                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus iste similique praesentium. Laudantium voluptate pariatur facere assumenda. Earum eos quisquam maiores veniam impedit similique quaerat ea temporibus illo tempore nemo architecto rem dignissimos, sit necessitatibus modi commodi totam et sunt, dolores quia. Aperiam pariatur veniam minima eum sed delectus animi ipsam rerum quis exercitationem officia expedita eos doloremque ratione aut, natus eligendi magnam dolorum temporibus quo quod labore sint. Magni quod porro illum doloribus ullam architecto reiciendis facilis numquam sunt perspiciatis ipsum odio deleniti veritatis non, asperiores provident nesciunt quo perferendis voluptatem modi sint molestiae sapiente, quis excepturi! Necessitatibus iusto eligendi recusandae iure commodi quo quibusdam eius explicabo maxime vitae sint sit molestiae eaque libero atque adipisci id ducimus delectus perspiciatis autem, voluptate similique ea totam? Placeat consequuntur a repudiandae quia deserunt, officia, aliquid, nam modi at minus veniam asperiores sequi adipisci esse alias nesciunt accusamus sint! Odit saepe, ea numquam id vero sequi inventore nostrum deleniti rem, tenetur labore error, esse cumque maiores. Illum deleniti ducimus quod, doloremque officiis cupiditate consequatur doloribus fuga aliquam incidunt voluptate modi facere eligendi. Illum soluta sapiente, veniam totam laboriosam reprehenderit excepturi quas velit rem dolor voluptatem dicta quasi eum non quaerat commodi, assumenda, voluptas fuga cupiditate neque fugit odio. Nemo sit error tempora ad quisquam, maxime dignissimos dolorum atque asperiores modi. Neque provident commodi possimus dignissimos, quaerat temporibus sint voluptatum alias iste, labore magni, eius similique corrupti in incidunt eveniet quidem inventore molestiae totam nesciunt eaque pariatur? Veritatis vel, eligendi illum doloribus eos quibusdam beatae eum quaerat accusantium quo quae deserunt obcaecati pariatur sequi impedit voluptatem aperiam repellendus magnam est a reiciendis aliquid ipsa. Unde fugit dolorum ea accusamus sequi perferendis accusantium at neque similique magni? Perferendis accusamus voluptatum, illo similique, tempore aliquam iusto fugit distinctio itaque aperiam quidem earum accusantium amet fugiat, consequuntur impedit hic deleniti tempora sapiente consectetur! Assumenda mollitia consequatur, vitae voluptate consequuntur laudantium eius eveniet error distinctio illum cupiditate non dicta reprehenderit rerum debitis nemo expedita iusto totam molestias, optio cum fugiat soluta! Magni tempora sequi soluta nihil neque repellat amet quos. Recusandae omnis voluptatem quae eveniet totam numquam eum nisi repellendus dolor animi odit ut rerum at voluptate officia, corporis inventore enim eos deserunt voluptates? Nulla consequuntur error perferendis inventore laboriosam eaque repudiandae amet quia reiciendis excepturi? Repellendus aliquam vero dolore maxime nulla repudiandae quod omnis sed, nihil consequuntur, commodi sequi blanditiis autem quas atque neque! Molestiae adipisci amet ut enim accusantium debitis atque quo consequuntur? Maiores maxime natus alias quisquam quos, cupiditate recusandae similique dolorem esse! Est possimus blanditiis hic odio nulla. Necessitatibus voluptas voluptatum eum molestias! Illum totam tempora quam explicabo libero est facilis consequatur, at suscipit nobis sapiente nam, deleniti sequi veritatis. Obcaecati necessitatibus quod perferendis iste earum, libero optio eos nihil, repudiandae ipsam quisquam veritatis possimus doloremque! Minima cumque dolorem, officia maiores nam libero corrupti, iste magnam provident molestias minus nemo assumenda recusandae obcaecati blanditiis est quis voluptatum, veniam non soluta. Deleniti fugit, sint beatae voluptas nihil consequuntur accusamus soluta eum quidem obcaecati laudantium.

                </Grid>
            </DialogContent>
        </Dialog>





    )

}
export default MakeCompra