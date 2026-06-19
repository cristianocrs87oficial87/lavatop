import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const userId =
      searchParams.get("user_id");

    const plano =
      searchParams.get("plano");

    if (!userId) {
      return NextResponse.json(
        {
          erro: "Usuário não informado",
        },
        {
          status: 400,
        }
      );
    }

    const tokenResponse = await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/pay2m/token`
);

    const tokenData =
      await tokenResponse.json();

    const accessToken =
      tokenData.access_token;

    console.log(
      "GERANDO PIX PARA:",
      userId
    );

    const valor =
  plano === "anual"
    ? 497.00
    : 49.90;

    const response = await fetch(
      "https://portal.pay2m.com.br/api/v1/pix/qrcode",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          value: valor,
          generator_name:
            "Teste LavaTop",
          generator_document:
            "58120345835",
          external_reference:
            `LAVATOP-${Date.now()}`,
          expiration_time: 1800,
          payer_message:
            "Pagamento LavaTop",
        }),
      }
    );

    const data =await response.json();
    console.log(
  "RETORNO PAY2M COMPLETO:",
  JSON.stringify(data, null, 2)
);

    const { error } = await supabase
      .from("premium_pagamentos")
      .insert({
        usuario_id: userId,
        reference_code:
          data.reference_code,
        valor: valor,
        status:
          "awaiting_payment",
        pix_copia_cola:
          data.content,
      });

    console.log(
      "ERRO SUPABASE:",
      error
    );

    console.log(
      "STATUS:",
      response.status
    );

    console.log(
      "RESPOSTA:",
      data
    );

    return NextResponse.json({
  retorno_completo: data,
  content: data.content,
  reference_code: data.reference_code,
});
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        erro:
          "Falha ao gerar PIX",
      },
      {
        status: 500,
      }
    );
  }
}