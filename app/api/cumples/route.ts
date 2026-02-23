import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("cumples")
    .select("*")
    .order("dia", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Error cargando cumpleaños" },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  const body = await request.json();

  const { nombre, dia, nota } = body ?? {};

  if (!nombre || !dia) {
    return NextResponse.json(
      { error: "nombre y dia son obligatorios" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("cumples")
    .insert([{ nombre, dia, nota }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Error guardando cumpleaños" },
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

  const { error } = await supabase.from("cumples").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Error eliminando cumpleaños" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

