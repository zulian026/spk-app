// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Laptop, LaptopCategory } from "@/lib/supabase";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const [featuredLaptops, setFeaturedLaptops] = useState<Laptop[]>([]);
  const [categories, setCategories] = useState<LaptopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured laptops (top 6 by rating/popularity)
        const { data: laptops } = await supabase
          .from("laptops")
          .select("*")
          .eq("availability_status", "available")
          .order("processor_score", { ascending: false })
          .limit(6);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from("laptop_categories")
          .select("*")
          .order("name");

        setFeaturedLaptops(laptops || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryIcon = (iconName?: string) => {
    const icons: { [key: string]: string } = {
      "gamepad-2": "🎮",
      laptop: "💻",
      briefcase: "💼",
      "graduation-cap": "🎓",
      monitor: "🖥️",
      "dollar-sign": "💰",
    };
    return icons[iconName || "laptop"] || "💻";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SPK</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LaptopFinder
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/recommendations"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Cari Laptop
                  </Link>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={signOut}
                      className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Temukan Laptop
              <br />
              <span className="text-gray-800">Impian Anda</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Sistem Pendukung Keputusan cerdas yang membantu Anda menemukan
              laptop terbaik berdasarkan kebutuhan dan budget Anda menggunakan
              metode TOPSIS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={user ? "/recommendations" : "/register"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
              >
                {user ? "Mulai Pencarian" : "Mulai Gratis"}
              </Link>
              <Link
                href="/laptops"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg"
              >
                Lihat Semua Laptop
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Kategori Laptop
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih kategori yang sesuai dengan kebutuhan Anda
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/laptops?category=${category.name.toLowerCase()}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl mb-3">
                        {getCategoryIcon(category.icon)}
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cara Kerja Sistem
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proses sederhana untuk mendapatkan rekomendasi laptop terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Tentukan Preferensi
              </h3>
              <p className="text-gray-600">
                Atur bobot kriteria sesuai kebutuhan: harga, performa, RAM,
                storage, portabilitas, dan daya tahan baterai
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Analisis TOPSIS
              </h3>
              <p className="text-gray-600">
                Sistem menganalisis semua laptop menggunakan metode TOPSIS untuk
                perhitungan yang akurat dan objektif
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Dapatkan Rekomendasi
              </h3>
              <p className="text-gray-600">
                Terima daftar laptop terbaik yang diurutkan berdasarkan skor
                kesesuaian dengan preferensi Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SPK</span>
                </div>
                <span className="font-bold text-xl">LaptopFinder</span>
              </div>
              <p className="text-gray-400">
                Sistem Pendukung Keputusan untuk menemukan laptop terbaik sesuai
                kebutuhan Anda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/recommendations"
                    className="hover:text-white transition-colors"
                  >
                    Rekomendasi Laptop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/laptops"
                    className="hover:text-white transition-colors"
                  >
                    Database Laptop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="hover:text-white transition-colors"
                  >
                    Perbandingan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Bantuan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    Cara Kerja
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Kontak</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@laptopfinder.com</p>
                <p>Phone: +62 123 456 7890</p>
                <p>Alamat: Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LaptopFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
