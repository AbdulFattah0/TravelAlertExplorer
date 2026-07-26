import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

import * as api from "../util/api";
import Alert from "./Alert";

const Bookmarks = (props) => {
  const [bookmarkedAlerts, setBookmarkedAlerts] = useState([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const result = await api.bookmarks.getAll();
        setBookmarkedAlerts(result);
        props.log?.(`${result.length} bookmarks loaded`);
      } catch (e) {
        console.error(e);
        props.log?.(e.message);
      }
    };

    loadBookmarks();
  }, []); 

  const handleBookmarkChanged = (code, bookmarked) => {
    
    if (!bookmarked) {
      setBookmarkedAlerts((prev) => prev.filter((a) => a.country_code !== code));
    } else {
      
      setBookmarkedAlerts((prev) =>
        prev.map((a) => (a.country_code === code ? { ...a, bookmarked: true } : a))
      );
    }
  };

  return (
    <>
      <Card sx={{ marginTop: "1em" }}>
        <CardHeader title="Bookmarks" />
        {bookmarkedAlerts.length === 0 && (
          <CardContent>
            <Typography>No bookmarks yet.</Typography>
          </CardContent>
        )}
      </Card>

      {bookmarkedAlerts.map((a) => (
        <Alert
          key={a.country_code}
          alert={a}
          log={props.log}
          onBookmarkChanged={handleBookmarkChanged}
        />
      ))}
    </>
  );
};

export default Bookmarks;
