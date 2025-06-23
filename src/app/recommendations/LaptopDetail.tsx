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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Wifi,
  Bluetooth,
  Usb,
  Camera,
  Keyboard,
  MousePointer,
  Shield,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { Recommendation } from "./types";

interface LaptopDetailProps {
  recommendation: Recommendation;
  onBack: () => void;
}

export default function LaptopDetail({
  recommendation,
  onBack,
}: LaptopDetailProps) {
  const { laptop, topsis_score, rank_position } = recommendation;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 0.6) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 0.4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-blue-500 text-white";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 0.8) return { level: "Sangat Baik", color: "text-green-600" };
    if (score >= 0.6) return { level: "Baik", color: "text-blue-600" };
    if (score >= 0.4) return { level: "Cukup", color: "text-yellow-600" };
    return { level: "Kurang", color: "text-red-600" };
  };

  const performanceLevel = getPerformanceLevel(topsis_score);

  // Mock data untuk fitur yang tidak ada di type asli
  const additionalFeatures = {
    connectivity: ["Wi-Fi 6", "Bluetooth 5.2", "USB-C", "USB 3.0", "HDMI"],
    audio: "Premium Audio with Dolby Atmos",
    webcam: "HD 720p",
    keyboard: "Backlit Keyboard",
    security: ["Fingerprint Reader", "TPM 2.0"],
    warranty: "2 Tahun Garansi Resmi",
    availability: "Tersedia",
    shipping: "Gratis Ongkir Se-Indonesia",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{laptop.name}</h1>
          <p className="text-gray-600">
            {laptop.brand} • {laptop.operating_system}
          </p>
        </div>
        <Badge className={getRankBadgeColor(rank_position)} variant="secondary">
          Rank #{rank_position}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {laptop.image_url ? (
                  <img
                    src={laptop.image_url}
                    alt={laptop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Laptop className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Beli Sekarang
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Simpan
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price & TOPSIS Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(laptop.price)}
                  </p>
                  <p className="text-sm text-gray-600">Harga Terbaik</p>
                </div>

                <Separator />

                <div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-lg border ${getScoreColor(
                      topsis_score
                    )}`}
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-semibold">
                      {(topsis_score * 100).toFixed(1)}% Match
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-2 font-medium ${performanceLevel.color}`}
                  >
                    {performanceLevel.level} untuk kebutuhan Anda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rating & Ulasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(laptop.avg_rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {laptop.avg_rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Berdasarkan {laptop.review_count} ulasan pengguna
              </p>

              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="text-gray-600">Editor's Choice</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
              <TabsTrigger value="topsis">Analisis TOPSIS</TabsTrigger>
              <TabsTrigger value="features">Fitur</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spesifikasi Lengkap</CardTitle>
                  <CardDescription>
                    Detail teknis dan spesifikasi hardware
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance Specs */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Performa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Processor</p>
                        <p className="font-medium">{laptop.processor}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Graphics Card</p>
                        <p className="font-medium">{laptop.graphics_card}</p>
                      </div>
                    </div>
                  </div>

                  {/* Memory & Storage */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-purple-600" />
                      Memori & Penyimpanan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">RAM</p>
                        <p className="font-medium">{laptop.ram}GB DDR4</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Storage</p>
                        <p className="font-medium">
                          {laptop.storage}GB {laptop.storage_type}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Display */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      Display
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Ukuran Layar</p>
                        <p className="font-medium">{laptop.screen_size} inch</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Resolusi</p>
                        <p className="font-medium">
                          {laptop.screen_resolution}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Physical */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Weight className="h-4 w-4 text-gray-600" />
                      Fisik & Baterai
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Berat</p>
                        <p className="font-medium">{laptop.weight}kg</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          Daya Tahan Baterai
                        </p>
                        <p className="font-medium">{laptop.battery_life} jam</p>
                      </div>
                    </div>
                  </div>

                  {/* Operating System */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Sistem Operasi
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{laptop.operating_system}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Sistem operasi terbaru dengan update keamanan reguler
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TOPSIS Analysis Tab */}
            <TabsContent value="topsis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analisis TOPSIS Detail</CardTitle>
                  <CardDescription>
                    Penjelasan mendalam tentang skor dan ranking laptop ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {(topsis_score * 100).toFixed(2)}%
                    </div>
                    <p className="text-gray-600 mb-4">
                      Skor TOPSIS Keseluruhan
                    </p>
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(
                        topsis_score
                      )}`}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {performanceLevel.level}
                    </div>
                  </div>

                  {/* Distance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Jarak ke Solusi Ideal Positif
                      </h4>
                      <div className="text-2xl font-bold text-green-600">
                        {recommendation.distance_positive.toFixed(4)}
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Semakin kecil, semakin baik
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Jarak ke Solusi Ideal Negatif
                      </h4>
                      <div className="text-2xl font-bold text-red-600">
                        {recommendation.distance_negative.toFixed(4)}
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Semakin besar, semakin baik
                      </p>
                    </div>
                  </div>

                  {/* Weighted Values */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Kontribusi Kriteria (Nilai Terbobot)
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Harga</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {(
                              recommendation.weighted_values.price * 100
                            ).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-600">
                            dari total 100
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">
                            Performa Processor
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {(
                              recommendation.weighted_values.processor_score *
                              100
                            ).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-600">
                            dari total 100
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">RAM</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {(recommendation.weighted_values.ram * 100).toFixed(
                              2
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            dari total 100
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ranking Position */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getRankBadgeColor(rank_position)}
                        variant="secondary"
                      >
                        #{rank_position}
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-blue-800">
                          Posisi Ranking
                        </h4>
                        <p className="text-sm text-blue-700">
                          Laptop ini menempati posisi ke-{rank_position} dari
                          semua laptop yang dievaluasi berdasarkan preferensi
                          Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fitur & Konektivitas</CardTitle>
                  <CardDescription>
                    Fitur lengkap dan opsi konektivitas yang tersedia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Connectivity */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-blue-600" />
                      Konektivitas
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {additionalFeatures.connectivity.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="justify-center py-2"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Input & Interaction */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Keyboard className="h-4 w-4 text-purple-600" />
                      Input & Interaksi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Keyboard className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Keyboard</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {additionalFeatures.keyboard}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Webcam</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {additionalFeatures.webcam}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Security */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Keamanan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {additionalFeatures.security.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                        >
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Audio */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-indigo-600" />
                      Audio & Multimedia
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{additionalFeatures.audio}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pengalaman audio premium untuk hiburan dan meeting
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan & Rating</CardTitle>
                  <CardDescription>
                    Pendapat pengguna tentang laptop ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Rating */}
                  <div className="text-center bg-gray-50 rounded-lg p-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {laptop.avg_rating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.floor(laptop.avg_rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Berdasarkan {laptop.review_count} ulasan
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Deskripsi Produk
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {laptop.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      Informasi Pembelian
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">
                            Ketersediaan
                          </span>
                        </div>
                        <p className="text-green-700">
                          {additionalFeatures.availability}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Garansi
                          </span>
                        </div>
                        <p className="text-blue-700">
                          {additionalFeatures.warranty}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-800">
                          Pengiriman
                        </span>
                      </div>
                      <p className="text-purple-700">
                        {additionalFeatures.shipping}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
