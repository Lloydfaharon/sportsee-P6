import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Appel du vrai backend Express
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();

    //  Stocke le vrai JWT dans un cookie
    const response = NextResponse.json({
      success: true,
      userId: data.userId,
    });

    response.cookies.set("sportsee_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 jour
    });

    return response;
  } catch (err: any) {
    console.error("❌ Erreur login:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
