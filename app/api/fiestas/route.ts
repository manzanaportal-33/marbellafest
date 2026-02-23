import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("fiestas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("GET /api/fiestas failed:", error);
      return NextResponse.json(
        { error: error.message || "Error cargando fiestas" },
        { status: 500 },
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/fiestas threw:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    const body = await request.json();

    const { titulo, fecha, lugar, mood } = body ?? {};

    if (!titulo || !fecha || !lugar) {
      return NextResponse.json(
        { error: "titulo, fecha y lugar son obligatorios" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("fiestas")
      .insert([{ titulo, fecha, lugar, mood }])
      .select("*")
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("POST /api/fiestas failed:", error);
      return NextResponse.json(
        { error: error.message || "Error guardando fiesta" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/fiestas threw:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id es obligatorio" }, { status: 400 });
    }

    const { error } = await supabase.from("fiestas").delete().eq("id", id);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("DELETE /api/fiestas failed:", error);
      return NextResponse.json(
        { error: error.message || "Error eliminando fiesta" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/fiestas threw:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

