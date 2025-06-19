export const config = {
    runtime: "edge",
  };
  
  export default async function handler(request: Request) {
    const response = await fetch(`https://fruity-proxy.vercel.app/api/fruits`, {
      headers: {
        "x-api-key": "fruit-api-challenge-2025",
        Origin: request.headers.get("origin") || "http://localhost:5173",
      },
    });
  
    if (!response.ok) {
      throw new Error(
        `Failed to fetch fruits: ${response.status} ${response.statusText}`
      );
    }
  
    const data = await response.json();
  
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      },
    });
  }
  