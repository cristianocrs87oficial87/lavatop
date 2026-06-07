import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const agora = new Date().toISOString();

  const { data, error } = await supabaseAdmin
  .from("empresas")
  .update({
    premium: false,
    premium_ate: null,
  })
  .lt("premium_ate", agora)
  .eq("premium", true)
  .select();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    empresasAtualizadas: data?.length || 0,
  });
}