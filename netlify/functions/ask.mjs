export const config = { path: "/api/ask" };

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const apiKey = Netlify.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API is not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: message }]
        }],
        systemInstruction: {
          parts: [{
            text: "You are Arad's portfolio AI assistant. Be concise, technical, helpful, and friendly. You know the portfolio projects, skills, AI automation, software engineering, and music technology context. Answer in the user's language when possible."
          }]
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.error?.message || "Gemini request failed"
      }), {
        status: response.status,
        headers: { "content-type": "application/json" }
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "No response.";
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request or server error" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};
