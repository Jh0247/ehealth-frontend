import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ( user ) => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {user && user?.user_info?.user_role === 'admin' ? (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              eabcd
            </Typography>
            <Button color="inherit" component={Link} to="/logout">
              Logout
            </Button>
          </Toolbar>
          <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
            <List>
              <ListItem component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem component={Link} to="/report">
                <ListItemText primary="Report" />
              </ListItem>
            </List>
          </Drawer>
        </AppBar>
      ) : (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1  }}>
              E-Health
            </Typography>
            <Button color="inherit" component={Link} to="/login" size="large">Login</Button>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};

export default Navbar;
