import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const premiumAte = new Date();
    premiumAte.setDate(premiumAte.getDate() + 30);

    const { error } = await supabaseAdmin
      .from("empresas")
      .update({
        premium: true,
        premium_ate: premiumAte.toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}