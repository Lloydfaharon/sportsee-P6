import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();


    if (username === "user@test.com" && password === "12345") {
      const response = NextResponse.json({ success: true });

     
      response.cookies.set("auth_token", "mocked-server-token", {
        path: "/",
        httpOnly: false, // (true en prod)
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 jour
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Identifiants incorrects" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Erreur route API /login :", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
