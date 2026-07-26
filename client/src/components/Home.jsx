import { Paper, CardHeader, CardContent, Fab } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import * as api from "../util/api";
import Search from "./Search";
import Alert from "./Alert";

const Home = (props) => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        let result = await api.alerts.getSearchData();
        setAlerts(result);
        props.log?.(`${result.length} alerts loaded`);
      } catch (e) {
        console.error(e);
        props.log?.(e.message);
      }
    };
    loadAlerts();
  }, []);

  const handleSelection = async (selection) => {
    if (!selection) {
      setSelectedAlert(null);
      return;
    }

    try {
      const fullAlert = await api.alerts.getByCode(selection.country_code);
      setSelectedAlert(fullAlert);
    } catch (e) {
      console.error(e);
      props.log?.(e.message);
    }
  };

  const toggleBookmark = async () => {
  if (!selectedAlert) return;

  const code = selectedAlert.country_code;
  const nextStatus = !selectedAlert.bookmarked;

  try {
    const res = await api.bookmarks.setStatus(code, nextStatus);

    if (res.ok) {
      setSelectedAlert((prev) => ({
        ...prev,
        bookmarked: nextStatus,
      }));

      props.log?.(
        nextStatus
          ? `Bookmarked ${code}`
          : `Removed bookmark ${code}`
      );
    } else {
      props.log?.("Bookmark update failed");
    }
  } catch (e) {
    console.error(e);
    props.log?.(e.message);
  }
};


  return (
    <>
      <Paper elevation={4} sx={{ marginTop: "0.5em", textAlign: "center", position: "relative" }}>
        <img
          src={logo}
          alt="App Logo"
          style={{ width: "40%", maxWidth: "200px", margin: "1em" }}
        />

        <CardHeader title="Travel Alerts" />

        <CardContent>
          <Search alerts={alerts} onSelection={handleSelection} />
        </CardContent>

        {selectedAlert && (
          <Fab
            color="primary"
            onClick={toggleBookmark}
            sx={{
              zIndex: 100,
              border: "2px solid #e1e1e1",
              position: "fixed",
              bottom: "1em",
              right: "1em",
            }}
          >
            {selectedAlert.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </Fab>
        )}
      </Paper>

      <Alert alert={selectedAlert} />
    </>
  );
};

export default Home;
