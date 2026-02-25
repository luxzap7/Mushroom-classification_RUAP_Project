// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

// Windows/DNS workaround (često pomaže kod network/TLS čudnih grešaka)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const http = require("http");
const https = require("https");

const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

const app = express();
app.use(cors());
app.use(express.json());

// Serviraj statički frontend iz /public (index.html, styles.css, pages/, picture/...)
app.use(express.static("public"));

function buildAzurePayload(features) {
  return {
    Inputs: {
      [process.env.AZUREML_INPUT_NAME]: [features],
    },
    GlobalParameters: {},
  };
}

app.post("/predict", async (req, res) => {
  try {
    const endpoint = process.env.AZUREML_ENDPOINT;
    const apiKey = process.env.AZUREML_KEY;

    if (!endpoint || !apiKey) {
      return res.status(500).json({
        error: "Missing AZUREML_ENDPOINT or AZUREML_KEY in .env",
      });
    }

    const features = req.body; // očekujemo objekt s feature-ima
    const payload = buildAzurePayload(features);

    // ✅ Najčešći header je Authorization: Bearer <key>.
    // Ako tvoj Consume tab kaže x-api-key, samo prebaci na taj header (vidi komentar dolje).
    const azureResp =  await axios.post(process.env.AZUREML_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        // Alternativa (ako endpoint tako traži):
        // "x-api-key": apiKey
      },
      timeout: 30000,
      httpAgent,
      httpsAgent,
      // validateStatus: () => true, // ako želiš da ne baca exception na 4xx/5xx
    });

    const data = azureResp.data;

    // Izvuci prvi red iz Results (bez pogađanja naziva outputa)
    const results = data?.Results || data?.results || {};
    let row = null;

    for (const k of Object.keys(results)) {
      if (Array.isArray(results[k]) && results[k].length > 0) {
        row = results[k][0];
        break;
      }
    }

    // Ako ne možemo pronaći row, vrati cijeli response radi debug-a
    if (!row) return res.json(data);

    // Vrati samo osnovno što želiš na UI
    return res.json({
      "Scored Labels": row["Scored Labels"],
      "Scored Probabilities": row["Scored Probabilities"],
      predicted_class: row["predicted_class"],
      predicted_is_poisonous: row["predicted_is_poisonous"],
      score_probability: row["score_probability"],
      prob_poisonous: row["prob_poisonous"],
    });
  } catch (e) {
    // Axios error detalji
    const status = e.response?.status;
    const body = e.response?.data;

    console.error("Azure call failed:", e.message);
    if (status) console.error("Status:", status);
    if (body) console.error("Body:", body);
    if (e.code) console.error("Code:", e.code);

    return res.status(500).json({
      error: e.message,
      code: e.code || null,
      status: status || null,
      body: body || null,
      endpoint: process.env.AZUREML_ENDPOINT,
    });
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));