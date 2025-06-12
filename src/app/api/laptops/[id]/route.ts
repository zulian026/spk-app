// app/api/laptops/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

// GET - Ambil laptop by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("laptops_with_ratings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update laptop
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Filter out fields that don't exist in the laptops table
    const allowedFields = [
      "name",
      "brand",
      "price",
      "processor",
      "processor_score",
      "ram",
      "storage",
      "storage_type",
      "graphics_card",
      "graphics_type",
      "screen_size",
      "screen_resolution",
      "screen_type",
      "weight",
      "thickness",
      "battery_capacity",
      "battery_life",
      "operating_system",
      "wifi_standard",
      "bluetooth_version",
      "usb_ports",
      "has_hdmi",
      "has_usb_c",
      "image_url",
      "description",
      "availability_status",
    ];

    // Filter body to only include allowed fields
    const filteredBody = Object.keys(body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {} as any);

    // Check if there are any valid fields to update
    if (Object.keys(filteredBody).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("laptops")
      .update(filteredBody)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Laptop updated successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE - Hapus laptop
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("laptops").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Laptop deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
