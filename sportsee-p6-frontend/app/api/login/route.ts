import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Utilise la variable d'environnement si présente, sinon l'URL Render en direct
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://sportsee-p6.onrender.com";

    const res = await fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();

    const response = NextResponse.json({
      success: true,
      userId: data.userId,
      token: data.token,
    });

    response.cookies.set("sportsee_token", data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("❌ Erreur login:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}