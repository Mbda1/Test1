const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// Rate limiting: track calls per user in memory (resets on cold start)
// For production, use Firestore or Redis for persistent rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_CALLS = 20; // 20 calls per minute per user

function checkRateLimit(uid) {
  const now = Date.now();
  const userCalls = rateLimitMap.get(uid) || [];
  const recent = userCalls.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_CALLS) {
    rateLimitMap.set(uid, recent);
    return false;
  }
  recent.push(now);
  rateLimitMap.set(uid, recent);
  return true;
}

exports.callGemini = onCall(
  {
    cors: true,
    maxInstances: 10,
  },
  async (request) => {
    // Require authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;

    // Rate limit
    if (!checkRateLimit(uid)) {
      throw new HttpsError(
        "resource-exhausted",
        "Too many requests. Please wait a moment."
      );
    }

    const { prompt, systemPrompt } = request.data;

    if (!prompt || typeof prompt !== "string") {
      throw new HttpsError("invalid-argument", "prompt is required.");
    }
    if (prompt.length > 10000) {
      throw new HttpsError(
        "invalid-argument",
        "prompt exceeds max length (10000)."
      );
    }
    if (systemPrompt && typeof systemPrompt !== "string") {
      throw new HttpsError("invalid-argument", "systemPrompt must be string.");
    }
    if (systemPrompt && systemPrompt.length > 5000) {
      throw new HttpsError(
        "invalid-argument",
        "systemPrompt exceeds max length (5000)."
      );
    }

    // Read the user's own Gemini API key from their Firestore document
    const userDoc = await db.collection("users").doc(uid).get();
    const apiKey = userDoc.exists ? userDoc.data().geminiApiKey : null;

    if (!apiKey) {
      throw new HttpsError(
        "failed-precondition",
        "No Gemini API key found. Add your key in Settings."
      );
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" +
      encodeURIComponent(apiKey);

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    };
    if (systemPrompt) {
      body.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "unknown");
      console.error(`Gemini API error ${response.status}: ${errText}`);
      throw new HttpsError(
        "internal",
        `Gemini API returned ${response.status}.`
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new HttpsError("internal", "No response from Gemini.");
    }

    // Parse and return the JSON (validates it's actually JSON)
    try {
      return { result: JSON.parse(text) };
    } catch {
      return { result: text };
    }
  }
);
