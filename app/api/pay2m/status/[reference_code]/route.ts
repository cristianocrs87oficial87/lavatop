import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ reference_code: string }> }
) {
  try {
    const { reference_code } = await context.params;

    console.log("REFERENCE:", reference_code);

    const clientId = process.env.PAY2M_CLIENT_ID!;
const clientSecret = process.env.PAY2M_CLIENT_SECRET!;

const credentials = Buffer.from(
  `${clientId}:${clientSecret}`
).toString("base64");

const tokenResponse = await fetch(
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

const tokenData = await tokenResponse.json();

const accessToken = tokenData.access_token;

    const response = await fetch(
      `https://portal.pay2m.com.br/api/v1/pix/qrcode/${reference_code}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("STATUS PAY2M:", response.status);

    const data = await response.json();

    console.log("RESPOSTA PAY2M:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERRO STATUS PIX:", error);

    return NextResponse.json(
      {
        error: "Erro ao consultar PIX",
      },
      {
        status: 500,
      }
    );
  }
}