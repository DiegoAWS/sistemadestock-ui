import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: 'transparent',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: 'transparent',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(6) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(6) + 1,
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
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Skeleton({ ToolbarContent, SideBar, children, }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);



  useEffect(() => {
    setShow(localStorage.getItem('usertoken') ? true : false)


  }, [])


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const accesManager=(state)=>{

    setShow(state)
  }

  return (
    <div className={classes.root}>


      <AppBar position="fixed" className={classes.appBar} color={show ? 'default' : 'transparent'}>
        <Toolbar>
          <ToolbarContent accesManager={accesManager} access={show}/>
        </Toolbar>
      </AppBar>
      <Drawer
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
        {SideBar}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbarContent} />
        {children}
      </main>
    </div>
  );
}
