import React, { useEffect } from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

const drawerWidth = 240

const useStyles = makeStyles( ( theme ) => ( {
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1

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

    transition: theme.transitions.create( "width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    } ),
  },
  drawerClose: {
    color: 'white',

    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 100%)',

    transition: theme.transitions.create( "width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    } ),
    overflowX: "hidden",
    width: theme.spacing( 7 ) + 1,
    [ theme.breakpoints.up( "sm" ) ]: {
      width: theme.spacing( 7 ) + 1,
    },
  },
  toolbar: {
    height: '60px',
    width: '100%',
    backgroundColor: 'transparent'
  },
  toolbarContent: {
    height: '60px',
    width: '100%'
  },
  content: {

    position: 'absolute',
    marginLeft: '60px',
    padding: '10px',
    marginTop: '30px',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
} ) )

export default function Skeleton ( { ToolbarContent, SideBar, children, } )
{
  const classes = useStyles()

  const [ open, setOpen ] = React.useState( false )
  const [ show, setShow ] = React.useState( false )



  useEffect( () =>
  {
    setShow( localStorage.getItem( 'usertoken' ) ? true : false )


  }, [] )


  const handleDrawerOpen = () =>
  {
    if ( window.innerWidth > 600 )
      setOpen( true )
  }

  const handleDrawerClose = () =>
  {
    setOpen( false )
  }

  const accesManager = ( state ) =>
  {

    setShow( state )
  }

  return (
    <div className={ classes.root }>


      <AppBar position="fixed" className={ classes.appBar } color={ show ? 'default' : 'transparent' }>
        <Toolbar>
          <ToolbarContent accesManager={ accesManager } access={ show } />
        </Toolbar>
      </AppBar>
      <Drawer
        hidden={ !show }
        onMouseLeave={ handleDrawerClose }
        onMouseEnter={ handleDrawerOpen }
        variant="permanent"
        className={ clsx( classes.drawer, {
          [ classes.drawerOpen ]: open,
          [ classes.drawerClose ]: !open,
        } ) }
        classes={ {
          paper: clsx( {
            [ classes.drawerOpen ]: open,
            [ classes.drawerClose ]: !open,

          } ),
        } }
      >
        <div className={ classes.toolbar }> </div>
        { SideBar }
      </Drawer>
      <main className={ classes.content }>
        <div className={ classes.toolbarContent } />
        { children }
      </main>
    </div>
  )
}
