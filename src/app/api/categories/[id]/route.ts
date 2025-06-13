// src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Ambil category berdasarkan ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from("laptop_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching category:", error);
      return NextResponse.json(
        { error: "Failed to fetch category" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, icon } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Cek apakah category exists
    const { data: existingCategory } = await supabase
      .from("laptop_categories")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Cek apakah nama category sudah digunakan oleh category lain
    const { data: duplicateCategory } = await supabase
      .from("laptop_categories")
      .select("id")
      .eq("name", name.trim())
      .neq("id", id)
      .single();

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }

    // Update category
    const { data: updatedCategory, error } = await supabase
      .from("laptop_categories")
      .update({
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Cek apakah category sedang digunakan oleh laptop
    const { data: categoryMappings } = await supabase
      .from("laptop_category_mappings")
      .select("laptop_id")
      .eq("category_id", id)
      .limit(1);

    if (categoryMappings && categoryMappings.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is currently assigned to laptops",
        },
        { status: 409 }
      );
    }

    // Hapus category
    const { error } = await supabase
      .from("laptop_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
