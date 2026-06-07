import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    console.log("CHECK-PAYMENTS NOVO ARQUIVO");
  try {
    const { data: pagamentos, error } = await supabase
      .from("premium_pagamentos")
      .select("*")
      .eq("status", "awaiting_payment");

    if (error) {
      console.error("ERRO SUPABASE:", error);

      return NextResponse.json(
        {
          error: "Erro ao buscar pagamentos",
        },
        {
          status: 500,
        }
      );
    }

    console.log("=================================");
    console.log("TOTAL PAGAMENTOS:", pagamentos?.length);
    console.log("=================================");

    const resultados = [];

    for (const pagamento of pagamentos || []) {
      try {
        console.log("---------------------------------");
        console.log(
          "VERIFICANDO PIX:",
          pagamento.reference_code
        );
        console.log(
          "USUARIO:",
          pagamento.usuario_id
        );

        const response = await fetch(
          `http://localhost:3000/api/pay2m/status/${pagamento.reference_code}`
        );

        const statusData = await response.json();

        console.log(
          "STATUS RETORNADO:",
          statusData.status
        );

        if (statusData.status === "paid") {
          console.log("✅ PIX PAGO ENCONTRADO");
          console.log(
            "REFERENCE:",
            pagamento.reference_code
          );

          const { error: pagamentoError } =
            await supabase
              .from("premium_pagamentos")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
              })
              .eq(
                "reference_code",
                pagamento.reference_code
              );

          console.log(
            "ERRO UPDATE PAGAMENTO:",
            pagamentoError
          );

          const premiumAte = new Date();

          premiumAte.setDate(
            premiumAte.getDate() + 30
          );

          const {
            data: empresaData,
            error: empresaError,
          } = await supabase
            .from("empresas")
            .update({
              premium: true,
              premium_ate:
                premiumAte.toISOString(),
            })
            .eq(
              "usuario_id",
              pagamento.usuario_id
            )
            .select();

          console.log(
            "EMPRESA DATA:",
            empresaData
          );

          console.log(
            "EMPRESA ERROR:",
            empresaError
          );

          resultados.push({
            reference_code:
              pagamento.reference_code,
            status: "paid",
          });
        } else {
          resultados.push({
            reference_code:
              pagamento.reference_code,
            status: statusData.status,
          });
        }
      } catch (err) {
        console.error(
          "ERRO PROCESSANDO PIX:",
          err
        );
      }
    }

    return NextResponse.json({
      sucesso: true,
      processados: resultados.length,
      resultados,
    });
  } catch (error) {
    console.error(
      "ERRO GERAL:",
      error
    );

    return NextResponse.json(
      {
        error: "Erro ao verificar pagamentos",
      },
      {
        status: 500,
      }
    );
  }
}