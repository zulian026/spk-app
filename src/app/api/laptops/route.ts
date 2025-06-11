import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

interface LaptopData {
  name: string;
  brand: string;
  price: number;
  processor: string;
  processor_score?: number;
  ram: number;
  storage: number;
  storage_type?: string;
  graphics_card?: string;
  graphics_type?: string;
  screen_size: number;
  screen_resolution: string;
  screen_type?: string;
  weight: number;
  thickness?: number;
  battery_capacity?: number;
  battery_life?: number;
  operating_system?: string;
  wifi_standard?: string;
  bluetooth_version?: string;
  usb_ports?: number;
  has_hdmi?: boolean;
  has_usb_c?: boolean;
  image_url?: string;
  description?: string;
  availability_status?: string;
}

// GET - Ambil semua laptops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit") || "50";

    let query = supabase
      .from("laptops_with_ratings")
      .select("*")
      .eq("availability_status", "available");

    if (brand) {
      query = query.eq("brand", brand);
    }

    if (minPrice) {
      query = query.gte("price", parseInt(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", parseInt(maxPrice));
    }

    query = query.limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Tambah laptop baru
export async function POST(request: NextRequest) {
  try {
    const body: LaptopData = await request.json();

    // Validasi data required
    const requiredFields = [
      "name",
      "brand",
      "price",
      "processor",
      "ram",
      "storage",
      "screen_size",
      "screen_resolution",
      "weight",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof LaptopData]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set default values
    const laptopData = {
      ...body,
      processor_score: body.processor_score || 0,
      storage_type: body.storage_type || "SSD",
      graphics_type: body.graphics_type || "Integrated",
      screen_type: body.screen_type || "LCD",
      operating_system: body.operating_system || "Windows 11",
      wifi_standard: body.wifi_standard || "Wi-Fi 6",
      bluetooth_version: body.bluetooth_version || "5.0",
      usb_ports: body.usb_ports || 2,
      has_hdmi: body.has_hdmi !== undefined ? body.has_hdmi : true,
      has_usb_c: body.has_usb_c !== undefined ? body.has_usb_c : true,
      availability_status: body.availability_status || "available",
    };

    const { data, error } = await supabase
      .from("laptops")
      .insert([laptopData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Laptop added successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
