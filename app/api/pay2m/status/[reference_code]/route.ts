import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ reference_code: string }> }
) {
  try {
    const { reference_code } = await context.params;

    console.log("REFERENCE:", reference_code);

    const tokenResponse = await fetch(
      "http://localhost:3000/api/pay2m/token"
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