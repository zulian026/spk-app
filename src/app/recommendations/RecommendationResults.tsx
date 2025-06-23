"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Laptop,
  Star,
  TrendingUp,
  Zap,
  HardDrive,
  Monitor,
  Battery,
  Weight,
  DollarSign,
} from "lucide-react";
import { Recommendation, UserPreferences } from "./types";
import LaptopDetail from "./LaptopDetail";

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  preferences: UserPreferences;
  showResults: boolean;
}

export default function RecommendationResults({
  recommendations,
  preferences,
  showResults,
}: RecommendationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-50";
    if (score >= 0.6) return "text-blue-600 bg-blue-50";
    if (score >= 0.4) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-blue-500 text-white";
  };

  if (!showResults) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <Laptop className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Siap untuk Mencari Laptop?
          </h3>
          <p className="text-gray-500">
            Sesuaikan preferensi Anda di panel kiri, lalu klik "Cari
            Rekomendasi" untuk melihat hasil perhitungan TOPSIS.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Hasil Rekomendasi
          </h2>
          <p className="text-gray-600">
            Ditemukan {recommendations.length} laptop sesuai kriteria Anda
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <TrendingUp className="h-4 w-4 mr-1" />
          TOPSIS Score
        </Badge>
      </div>

      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => (
          <Card
            key={recommendation.laptop.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <Badge
                    className={`${getRankBadgeColor(
                      recommendation.rank_position
                    )} text-lg px-3 py-2`}
                  >
                    #{recommendation.rank_position}
                  </Badge>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {recommendation.laptop.image_url ? (
                      <img
                        src={recommendation.laptop.image_url}
                        alt={recommendation.laptop.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        display: recommendation.laptop.image_url
                          ? "none"
                          : "flex",
                      }}
                    >
                      <Laptop className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Laptop Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {recommendation.laptop.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {recommendation.laptop.brand} •{" "}
                        {recommendation.laptop.operating_system}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(recommendation.laptop.avg_rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({recommendation.laptop.review_count} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                          recommendation.topsis_score
                        )}`}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {(recommendation.topsis_score * 100).toFixed(1)}%
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {formatCurrency(recommendation.laptop.price)}
                      </p>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-gray-600">CPU:</span>
                      <span className="font-medium">
                        {recommendation.laptop.processor
                          .split(" ")
                          .slice(0, 3)
                          .join(" ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">RAM:</span>
                      <span className="font-medium">
                        {recommendation.laptop.ram}GB
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium">
                        {recommendation.laptop.storage}GB{" "}
                        {recommendation.laptop.storage_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Weight className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">
                        {recommendation.laptop.weight}kg
                      </span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4 text-indigo-600" />
                      <span className="text-gray-600">Display:</span>
                      <span className="font-medium">
                        {recommendation.laptop.screen_size}"{" "}
                        {recommendation.laptop.screen_resolution}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Battery className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">Battery:</span>
                      <span className="font-medium">
                        {recommendation.laptop.battery_life}h
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Graphics:</span>
                      <span className="font-medium text-xs">
                        {recommendation.laptop.graphics_card}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recommendation.laptop.description}
                  </p>

                  {/* TOPSIS Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Analisis TOPSIS
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Skor Akhir
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {(recommendation.topsis_score * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Jarak ke Ideal+
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {recommendation.distance_positive.toFixed(4)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Jarak ke Ideal-
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {recommendation.distance_negative.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    {/* Criteria Contribution */}
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">
                        Kontribusi Kriteria:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded px-2 py-1">
                          <span className="text-gray-600">Harga:</span>
                          <span className="font-medium ml-1">
                            {(
                              recommendation.weighted_values.price * 100
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div className="bg-white rounded px-2 py-1">
                          <span className="text-gray-600">Performa:</span>
                          <span className="font-medium ml-1">
                            {(
                              recommendation.weighted_values.processor_score *
                              100
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div className="bg-white rounded px-2 py-1">
                          <span className="text-gray-600">RAM:</span>
                          <span className="font-medium ml-1">
                            {(recommendation.weighted_values.ram * 100).toFixed(
                              1
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1" size="sm">
                      Lihat Detail
                    </Button>

                    <Button variant="outline" size="sm">
                      Simpan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ringkasan Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {recommendations.length}
              </div>
              <div className="text-sm text-gray-600">Laptop Dievaluasi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {recommendations.length > 0
                  ? (recommendations[0].topsis_score * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Skor Tertinggi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {recommendations.length > 0
                  ? formatCurrency(
                      recommendations.reduce(
                        (sum, r) => sum + r.laptop.price,
                        0
                      ) / recommendations.length
                    ).replace("Rp", "")
                  : "Rp0"}
              </div>
              <div className="text-sm text-gray-600">Harga Rata-rata</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {preferences.preferred_brands.length || "Semua"}
              </div>
              <div className="text-sm text-gray-600">Brand Dipilih</div>
            </div>
          </div>

          {/* Criteria Weight Summary */}
          <Separator className="my-6" />
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Bobot Kriteria yang Digunakan:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.price_weight * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Harga</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.performance_weight * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Performa</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <Monitor className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.ram_weight * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">RAM</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <HardDrive className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.storage_weight * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Storage</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <Weight className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.weight_importance * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Portabilitas</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <Battery className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {(preferences.battery_weight * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Baterai</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How TOPSIS Works */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Bagaimana TOPSIS Bekerja?</CardTitle>
          <CardDescription>
            Memahami metodologi di balik rekomendasi ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Langkah Perhitungan:
              </h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Normalisasi matriks keputusan menggunakan metode vektor</li>
                <li>
                  Pembobotan matriks ternormalisasi sesuai preferensi Anda
                </li>
                <li>Menentukan solusi ideal positif dan negatif</li>
                <li>Menghitung jarak setiap alternatif ke solusi ideal</li>
                <li>Menghitung skor TOPSIS berdasarkan kedekatan relatif</li>
              </ol>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Keunggulan Metode:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>
                  Mempertimbangkan jarak ke solusi ideal positif dan negatif
                </li>
                <li>Menghasilkan ranking yang stabil dan konsisten</li>
                <li>
                  Dapat menangani kriteria benefit dan cost secara bersamaan
                </li>
                <li>Memberikan hasil yang dapat diinterpretasi dengan mudah</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">
                  Interpretasi Skor
                </h4>
                <p className="text-sm text-blue-700">
                  Skor TOPSIS berkisar antara 0-100%. Semakin tinggi skor,
                  semakin dekat laptop tersebut dengan solusi ideal berdasarkan
                  preferensi Anda. Laptop dengan skor di atas 80% dapat dianggap
                  sangat sesuai dengan kebutuhan Anda.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
