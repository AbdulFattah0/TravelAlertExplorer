import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "node:fs/promises";

import {
  refreshDatabase,
  retrieveAlerts,
  retrieveAlertByCode,
  retrieveBookmarks,
  setBookmark
} from "./data.js";

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(cors());

// Logger middleware
app.use((req, _res, next) => {
  const timestamp = new Date();
  console.warn(
    `[${timestamp.toISOString()}] ${req.method} ${req.path}`
  );
  next();
});

// ---------------- Serve React Build ----------------
// api.js is in: server/modules/
// client/dist is in: client/dist  → go up TWO levels
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

app.use(express.static(clientDistPath));

// ---------------- API Routes ----------------

// About
app.get("/about", (_req, res) => {
  res.sendFile("package.json", { root: "." });
});

app.get("/about/:what", async (req, res) => {
  try {
    const pj = JSON.parse(await readFile("package.json"));
    res.json({ [req.params.what]: pj[req.params.what] });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Alerts (search only)
app.get("/alerts", async (_req, res) => {
  const alerts = await retrieveAlerts();
  res.json(alerts);
});

// Alert by country code (full details)
app.get("/alerts/:code", async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const alert = await retrieveAlertByCode(code);
    if (!alert) return res.sendStatus(404);
    res.json(alert);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// ---------------- Bookmarks ----------------

// Get all bookmarked alerts
app.get("/bookmarks", async (_req, res) => {
  try {
    const bookmarks = await retrieveBookmarks();
    res.json(bookmarks);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});


app.post("/bookmarks/:code", async (request, response) => {
  try {
    const code = (request.params.code || "").toUpperCase();


    const { bookmarked } = request.body;

    if (typeof bookmarked !== "boolean") {
      return response.status(400).json({ error: "bookmarked must be boolean" });
    }

    await setBookmark(code, bookmarked);
    response.sendStatus(200);
  } catch (e) {
    console.error(e);
    response.sendStatus(500);
  }
});


// ---------------- DB Refresh ----------------
app.post("/db/refresh", async (_req, res) => {
  try {
    await refreshDatabase();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// ---------------- SPA Fallback ----------------
// MUST be last, and MUST NOT break API routes
app.get(/.*/, (req, res) => {
  if (
    req.path.startsWith("/alerts") ||
    req.path.startsWith("/bookmarks") ||
    req.path.startsWith("/db") ||
    req.path.startsWith("/about")
  ) {
    return res.sendStatus(404);
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ---------------- Start Server ----------------
const startServer = (port) => {
  app.listen(port, () =>
    console.warn(`Server running at http://localhost:${port}`)
  );
};

console.log("✅ API + React hosting ready");

export { startServer };
