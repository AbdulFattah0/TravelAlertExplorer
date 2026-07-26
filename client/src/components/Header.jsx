import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import * as api from "../util/api";

const Header = (props) => {
  const [anchor, setAnchor] = useState(null);

  let refreshDatabase = async () => {
    try {
      let result = await api.util.refreshDatabase();
      if (result.ok) {
        props.log("Database refreshed");
        window.location.reload();
      }
    } catch (e) {
      console.error(e.message);
      props.log(e.message);
    }
  };

  const goHome = () => {
    setAnchor(null);
    props.setPage?.("home");
  };

  const goBookmarks = () => {
    setAnchor(null);
    props.setPage?.("bookmarks");
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{props.appTitle}</Typography>

        <IconButton color="inherit" onClick={(e) => setAnchor(e.target)}>
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
        >
          <MenuItem onClick={goHome}>Home</MenuItem>
          <MenuItem onClick={goBookmarks}>Bookmarks</MenuItem>

          <MenuItem
            onClick={async () => {
              setAnchor(null);
              await refreshDatabase();
            }}
          >
            Refresh Database
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
