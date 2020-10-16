import React, { useEffect } from "react"
import { withRouter } from 'react-router-dom'
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Hidden from "@material-ui/core/Hidden"
import SideBar from '../components/SideBar/SideBar'
import NavBar from '../components/NavBar/NavBar'
const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'relative'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    color: 'white',

    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 100%)',

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    color: 'white',

    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 100%)',

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    height: '70px',
    width: '100%',
    backgroundColor: 'transparent'
  },
  toolbarContent: {
    height: '60px',
    width: '100%'
  },
  content: {

    position: 'absolute',

    padding: '10px',
    marginTop: '30px',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  nombreUsuario: {
    color: 'white',
    position: 'absolute',
    bottom: '10px',
    right: '70px',
    fontSize: 'small',
    border: '1px solid white',
    borderRadius: '5px',
    padding: ' 0 5px'
  }
}))

const Skeleton = ({ children, history, location }) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [show, setShow] = React.useState(false)

  const isAdmin = localStorage.getItem('UserRole') === 'admin'


  let title = location.pathname.replace('/', '').toLowerCase()

  if (title.length > 0)
    title = title[0].toUpperCase() + title.substring(1)

  if (title === 'Ventas')
    title = 'Facturación'

  useEffect(() => {
    setShow(localStorage.getItem('usertoken') ? true : false)


  }, [])


  const handleDrawerOpen = () => {
    if (window.innerWidth > 600)
      setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const accesManager = (state) => {

    setShow(state)
  }

  return (
    <div className={classes.root}>


      <AppBar position="fixed" className={classes.appBar}
        style={{ backgroundColor: show ? 'black' : 'transparent' }}>

        <Toolbar>
          <NavBar history={history} accesManager={accesManager} access={show} title={title} />
        </Toolbar>
        <Hidden xsDown > {show && <div className={classes.nombreUsuario}>{localStorage.getItem('UserOficialName')}</div>} </Hidden>
      </AppBar>

      {isAdmin && <Drawer
        hidden={!show}
        onMouseLeave={handleDrawerClose}
        onMouseEnter={handleDrawerOpen}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,

          }),
        }}
      >
        <div className={classes.toolbar}> </div>
        <SideBar />
      </Drawer>}
      <main className={classes.content} style={{ marginLeft: isAdmin ? '60px' : '0px' }}>
        <div className={classes.toolbarContent} />
        {children}
      </main>
    </div>
  )
}
export default withRouter(Skeleton)