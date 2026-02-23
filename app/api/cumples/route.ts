import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("cumples")
      .select("*")
      .order("dia", { ascending: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("GET /api/cumples failed:", error);
      return NextResponse.json(
        { error: error.message || "Error cargando cumpleaños" },
        { status: 500 },
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/cumples threw:", error);
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
      // eslint-disable-next-line no-console
      console.error("POST /api/cumples failed:", error);
      return NextResponse.json(
        { error: error.message || "Error guardando cumpleaños" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/cumples threw:", error);
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

    const { error } = await supabase.from("cumples").delete().eq("id", id);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("DELETE /api/cumples failed:", error);
      return NextResponse.json(
        { error: error.message || "Error eliminando cumpleaños" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/cumples threw:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}

