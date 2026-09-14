import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new Error("La variable BACKEND_URL est introuvable");
    }

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
    });

    response.cookies.set("sportsee_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("❌ Erreur login:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}