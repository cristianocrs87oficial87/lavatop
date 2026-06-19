import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.PAY2M_CLIENT_ID!;
    const clientSecret = process.env.PAY2M_CLIENT_SECRET!;
    console.log("CLIENT_ID:", clientId ? "OK" : "VAZIO");
console.log("CLIENT_SECRET:", clientSecret ? "OK" : "VAZIO");

    const credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(
      "https://portal.pay2m.com.br/api/auth/generate_token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
        }),
      }
    );

    const data = await response.json();
    console.log("TOKEN STATUS:", response.status);
console.log("TOKEN RETORNO:", data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao gerar token",
      },
      {
        status: 500,
      }
    );
  }
}