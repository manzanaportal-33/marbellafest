import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase";

export async function GET() {
  const supabaseUrlSet = Boolean(process.env.SUPABASE_URL);
  const serviceRoleKeySet = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrlSet || !serviceRoleKeySet) {
    return NextResponse.json(
      {
        ok: false,
        supabaseUrlSet,
        serviceRoleKeySet,
        canQuery: false,
        error: "Missing env vars in this deployment",
      },
      { status: 500 },
    );
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("cumples").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          supabaseUrlSet,
          serviceRoleKeySet,
          canQuery: false,
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      supabaseUrlSet,
      serviceRoleKeySet,
      canQuery: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        supabaseUrlSet,
        serviceRoleKeySet,
        canQuery: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

