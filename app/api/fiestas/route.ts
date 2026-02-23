import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("fiestas")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Error cargando fiestas" },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: "Error guardando fiesta" },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id es obligatorio" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("fiestas").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Error eliminando fiesta" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

