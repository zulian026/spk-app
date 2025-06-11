// app/recommendation/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RecommendationForm from "@/components/recommendation/RecommendationForm";

export default function RecommendationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Kembali ke Beranda</span>
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Rekomendasi Laptop
              </h1>
            </div>
            <div className="w-40"></div> {/* Spacer for centering */}
          </div>
        </div>  
      </header>

      {/* Main Content */}
      <RecommendationForm />
    </main>
  );
}

// Optional: Tambahkan metadata untuk halaman ini
export const metadata = {
  title: "Laptop Recommendations | TOPSIS System",
  description: "Get personalized laptop recommendations using TOPSIS algorithm",
};
