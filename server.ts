import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Wolfram Alpha API Proxy
  app.get("/api/wolfram", async (req, res) => {
    const { query } = req.query;
    const appId = process.env.WOLFRAM_APP_ID;

    if (!appId) {
      return res.status(500).json({ error: "Wolfram App ID not configured" });
    }

    try {
      // Short Answers API for quick facts
      const response = await axios.get("https://api.wolframalpha.com/v1/result", {
        params: {
          i: query,
          appid: appId,
        },
      });
      res.json({ result: response.data });
    } catch (error: any) {
      // Wolfram Alpha returns 501 if it can't find a short answer for the query
      if (error.response && error.response.status === 501) {
        return res.json({ result: null, message: "No short answer available" });
      }
      
      // Only log unexpected errors
      console.error("Wolfram API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch from Wolfram Alpha" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
