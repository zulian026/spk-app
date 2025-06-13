"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Filter,
  RotateCcw,
  Search,
  Loader2,
} from "lucide-react";

// Types
interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  processor: string;
  processor_score: number;
  ram: number;
  storage: number;
  storage_type: string;
  graphics_card: string;
  graphics_type: string;
  screen_size: number;
  screen_resolution: string;
  weight: number;
  battery_life: number;
  operating_system: string;
  description: string;
  image_url: string;
  avg_rating: number;
  review_count: number;
}

interface UserPreferences {
  price_weight: number;
  performance_weight: number;
  ram_weight: number;
  storage_weight: number;
  weight_importance: number;
  battery_weight: number;
  max_budget: number;
  min_budget: number;
  preferred_brands: string[];
  primary_usage: string;
  screen_size_preference: string;
}

interface Recommendation {
  laptop: Laptop;
  topsis_score: number;
  rank_position: number;
  normalized_values: any;
  weighted_values: any;
  distance_positive: number;
  distance_negative: number;
}

const BRANDS = ["ASUS", "Lenovo", "HP", "Dell", "Apple", "Acer", "MSI"];
const USAGE_TYPES = [
  { value: "gaming", label: "Gaming & Entertainment" },
  { value: "office", label: "Office & Business" },
  { value: "design", label: "Design & Creative" },
  { value: "student", label: "Student & Learning" },
  { value: "multimedia", label: "Multimedia & Content" },
  { value: "programming", label: "Programming & Development" },
];

const SCREEN_SIZE_OPTIONS = [
  { value: "small", label: 'Portable (≤13")' },
  { value: "medium", label: 'Standard (14-15")' },
  { value: "large", label: 'Large (≥16")' },
];

export default function RecommendationPage() {
  const [supabase] = useState(() => createClientComponentClient());
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Form state
  const [preferences, setPreferences] = useState<UserPreferences>({
    price_weight: 0.25,
    performance_weight: 0.2,
    ram_weight: 0.15,
    storage_weight: 0.15,
    weight_importance: 0.15,
    battery_weight: 0.1,
    max_budget: 25000000,
    min_budget: 5000000,
    preferred_brands: [],
    primary_usage: "office",
    screen_size_preference: "medium",
  });

  // Load laptops on component mount
  useEffect(() => {
    loadLaptops();
  }, []);

  const loadLaptops = async () => {
    try {
      const { data, error } = await supabase
        .from("laptops_with_ratings")
        .select("*")
        .eq("availability_status", "available")
        .order("name");

      if (error) throw error;
      setLaptops(data || []);
    } catch (error) {
      console.error("Error loading laptops:", error);
    }
  };

  const calculateTOPSIS = (
    laptops: Laptop[],
    prefs: UserPreferences
  ): Recommendation[] => {
    if (laptops.length === 0) return [];

    // Filter laptops based on budget and preferences
    const filteredLaptops = laptops.filter((laptop) => {
      const withinBudget =
        laptop.price >= prefs.min_budget && laptop.price <= prefs.max_budget;
      const brandMatch =
        prefs.preferred_brands.length === 0 ||
        prefs.preferred_brands.includes(laptop.brand);
      return withinBudget && brandMatch;
    });

    if (filteredLaptops.length === 0) return [];

    // Step 1: Create decision matrix with explicit value extraction
    const criteria = [
      { key: "price", weight: prefs.price_weight, isBenefit: false },
      {
        key: "processor_score",
        weight: prefs.performance_weight,
        isBenefit: true,
      },
      { key: "ram", weight: prefs.ram_weight, isBenefit: true },
      { key: "storage", weight: prefs.storage_weight, isBenefit: true },
      { key: "weight", weight: prefs.weight_importance, isBenefit: false },
      { key: "battery_life", weight: prefs.battery_weight, isBenefit: true },
    ];

    // Helper function to get numeric value from laptop
    const getLaptopValue = (laptop: Laptop, key: string): number => {
      switch (key) {
        case "price":
          return laptop.price;
        case "processor_score":
          return laptop.processor_score;
        case "ram":
          return laptop.ram;
        case "storage":
          return laptop.storage;
        case "weight":
          return laptop.weight;
        case "battery_life":
          return laptop.battery_life;
        default:
          return 0;
      }
    };

    // Step 2: Normalize decision matrix
    const normalizedMatrix = criteria.map((criterion) => {
      const values = filteredLaptops.map((laptop) =>
        getLaptopValue(laptop, criterion.key)
      );
      const sumOfSquares = Math.sqrt(
        values.reduce((sum, val) => sum + val * val, 0)
      );

      return filteredLaptops.map((laptop) => {
        const value = getLaptopValue(laptop, criterion.key);
        return sumOfSquares > 0 ? value / sumOfSquares : 0;
      });
    });

    // Step 3: Calculate weighted normalized matrix
    const weightedMatrix = normalizedMatrix.map((column, criterionIndex) =>
      column.map((value) => value * criteria[criterionIndex].weight)
    );

    // Step 4: Determine ideal solutions
    const idealPositive = criteria.map((criterion, index) => {
      const values = weightedMatrix[index];
      return criterion.isBenefit ? Math.max(...values) : Math.min(...values);
    });

    const idealNegative = criteria.map((criterion, index) => {
      const values = weightedMatrix[index];
      return criterion.isBenefit ? Math.min(...values) : Math.max(...values);
    });

    // Step 5: Calculate distances and TOPSIS scores
    const results: Recommendation[] = filteredLaptops.map(
      (laptop, laptopIndex) => {
        const laptopValues = criteria.map(
          (_, criterionIndex) => weightedMatrix[criterionIndex][laptopIndex]
        );

        const distancePositive = Math.sqrt(
          laptopValues.reduce(
            (sum, value, index) =>
              sum + Math.pow(value - idealPositive[index], 2),
            0
          )
        );

        const distanceNegative = Math.sqrt(
          laptopValues.reduce(
            (sum, value, index) =>
              sum + Math.pow(value - idealNegative[index], 2),
            0
          )
        );

        const topsisScore =
          distancePositive + distanceNegative > 0
            ? distanceNegative / (distancePositive + distanceNegative)
            : 0;

        const normalizedValues = Object.fromEntries(
          criteria.map((criterion, index) => [
            criterion.key,
            normalizedMatrix[index][laptopIndex],
          ])
        );

        const weightedValues = Object.fromEntries(
          criteria.map((criterion, index) => [
            criterion.key,
            weightedMatrix[index][laptopIndex],
          ])
        );

        return {
          laptop,
          topsis_score: topsisScore,
          rank_position: 0, // Will be set after sorting
          normalized_values: normalizedValues,
          weighted_values: weightedValues,
          distance_positive: distancePositive,
          distance_negative: distanceNegative,
        };
      }
    );

    // Sort by TOPSIS score and assign ranks
    results.sort((a, b) => b.topsis_score - a.topsis_score);
    results.forEach((result, index) => {
      result.rank_position = index + 1;
    });

    return results;
  };
  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Calculate TOPSIS
      const results = calculateTOPSIS(laptops, preferences);
      setRecommendations(results);

      // Save to database if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Save user preferences
        const { data: prefData, error: prefError } = await supabase
          .from("user_preferences")
          .insert({
            user_id: user.id,
            ...preferences,
            preference_name: `Preferences ${new Date().toLocaleDateString()}`,
          })
          .select()
          .single();

        if (prefError) throw prefError;

        // Save recommendations
        const recommendationData = results.map((result) => ({
          user_id: user.id,
          preference_id: prefData.id,
          laptop_id: result.laptop.id,
          topsis_score: result.topsis_score,
          rank_position: result.rank_position,
          normalized_values: result.normalized_values,
          weighted_values: result.weighted_values,
          distance_positive: result.distance_positive,
          distance_negative: result.distance_negative,
        }));

        const { error: recError } = await supabase
          .from("recommendations")
          .insert(recommendationData);

        if (recError) throw recError;
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeightChange = (criterionKey: string, value: number[]) => {
    const newWeight = value[0] / 100;
    const oldWeight = getWeightValue(preferences, criterionKey);

    // Define the weight keys explicitly
    const weightKeys = [
      "price_weight",
      "performance_weight",
      "ram_weight",
      "storage_weight",
      "weight_importance",
      "battery_weight",
    ] as const;

    // Get other weight keys (excluding the one being changed)
    const otherKeys = weightKeys.filter((key) => key !== criterionKey);

    const totalOtherWeights = otherKeys.reduce(
      (sum, key) => sum + getWeightValue(preferences, key),
      0
    );

    if (totalOtherWeights > 0) {
      const adjustmentFactor = (1 - newWeight) / totalOtherWeights;
      const newPreferences = { ...preferences };

      // Set the new weight for the changed criterion
      setWeightValue(newPreferences, criterionKey, newWeight);

      // Adjust other weights proportionally
      otherKeys.forEach((key) => {
        const currentWeight = getWeightValue(preferences, key);
        setWeightValue(newPreferences, key, currentWeight * adjustmentFactor);
      });

      setPreferences(newPreferences);
    }
  };

  // Helper function to get weight value
  const getWeightValue = (prefs: UserPreferences, key: string): number => {
    switch (key) {
      case "price_weight":
        return prefs.price_weight;
      case "performance_weight":
        return prefs.performance_weight;
      case "ram_weight":
        return prefs.ram_weight;
      case "storage_weight":
        return prefs.storage_weight;
      case "weight_importance":
        return prefs.weight_importance;
      case "battery_weight":
        return prefs.battery_weight;
      default:
        return 0;
    }
  };

  // Helper function to set weight value
  const setWeightValue = (
    prefs: UserPreferences,
    key: string,
    value: number
  ): void => {
    switch (key) {
      case "price_weight":
        prefs.price_weight = value;
        break;
      case "performance_weight":
        prefs.performance_weight = value;
        break;
      case "ram_weight":
        prefs.ram_weight = value;
        break;
      case "storage_weight":
        prefs.storage_weight = value;
        break;
      case "weight_importance":
        prefs.weight_importance = value;
        break;
      case "battery_weight":
        prefs.battery_weight = value;
        break;
    }
  };
  const resetPreferences = () => {
    setPreferences({
      price_weight: 0.25,
      performance_weight: 0.2,
      ram_weight: 0.15,
      storage_weight: 0.15,
      weight_importance: 0.15,
      battery_weight: 0.1,
      max_budget: 25000000,
      min_budget: 5000000,
      preferred_brands: [],
      primary_usage: "office",
      screen_size_preference: "medium",
    });
    setShowResults(false);
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Laptop className="h-8 w-8 text-blue-600" />
          Sistem Rekomendasi Laptop
        </h1>
        <p className="text-gray-600">
          Temukan laptop yang tepat untuk kebutuhan Anda menggunakan metode
          TOPSIS (Technique for Order Preference by Similarity to Ideal
          Solution)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preferences Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Preferensi Anda
              </CardTitle>
              <CardDescription>
                Sesuaikan bobot kriteria sesuai prioritas Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget Range
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">Minimum</Label>
                    <Input
                      type="number"
                      value={preferences.min_budget}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          min_budget: Number(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Maximum</Label>
                    <Input
                      type="number"
                      value={preferences.max_budget}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          max_budget: Number(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Criteria Weights */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Bobot Kriteria</Label>

                {/* Price Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Harga
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.price_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.price_weight * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("price_weight", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Performance Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Performa
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.performance_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.performance_weight * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("performance_weight", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* RAM Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      RAM
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.ram_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.ram_weight * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("ram_weight", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Storage Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-purple-600" />
                      Storage
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.storage_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.storage_weight * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("storage_weight", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Weight Importance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <Weight className="h-4 w-4 text-gray-600" />
                      Portabilitas
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.weight_importance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.weight_importance * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("weight_importance", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Battery Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm flex items-center gap-2">
                      <Battery className="h-4 w-4 text-green-600" />
                      Baterai
                    </Label>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {(preferences.battery_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Slider
                    value={[preferences.battery_weight * 100]}
                    onValueChange={(value) =>
                      handleWeightChange("battery_weight", value)
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Preferences */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Preferensi Tambahan
                </Label>

                <div className="space-y-3">
                  <Label className="text-sm">Kegunaan Utama</Label>
                  <Select
                    value={preferences.primary_usage}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, primary_usage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USAGE_TYPES.map((usage) => (
                        <SelectItem key={usage.value} value={usage.value}>
                          {usage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm">Ukuran Layar</Label>
                  <Select
                    value={preferences.screen_size_preference}
                    onValueChange={(value) =>
                      setPreferences({
                        ...preferences,
                        screen_size_preference: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCREEN_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm">Brand Preferensi (Opsional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BRANDS.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={preferences.preferred_brands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPreferences({
                                ...preferences,
                                preferred_brands: [
                                  ...preferences.preferred_brands,
                                  brand,
                                ],
                              });
                            } else {
                              setPreferences({
                                ...preferences,
                                preferred_brands:
                                  preferences.preferred_brands.filter(
                                    (b) => b !== brand
                                  ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={brand} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghitung...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Rekomendasi
                    </>
                  )}
                </Button>

                <Button
                  onClick={resetPreferences}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {!showResults ? (
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
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hasil Rekomendasi
                  </h2>
                  <p className="text-gray-600">
                    Ditemukan {recommendations.length} laptop sesuai kriteria
                    Anda
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
                                onError={(e) => {
                                  // Fallback ke icon jika gambar gagal dimuat
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling.style.display =
                                    "flex";
                                }}
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
                                        i <
                                        Math.floor(
                                          recommendation.laptop.avg_rating
                                        )
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
                                {(recommendation.topsis_score * 100).toFixed(1)}
                                %
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
                                  {(recommendation.topsis_score * 100).toFixed(
                                    2
                                  )}
                                  %
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
                                  <span className="text-gray-600">
                                    Performa:
                                  </span>
                                  <span className="font-medium ml-1">
                                    {(
                                      recommendation.weighted_values
                                        .processor_score * 100
                                    ).toFixed(1)}
                                  </span>
                                </div>
                                <div className="bg-white rounded px-2 py-1">
                                  <span className="text-gray-600">RAM:</span>
                                  <span className="font-medium ml-1">
                                    {(
                                      recommendation.weighted_values.ram * 100
                                    ).toFixed(1)}
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
                              Bandingkan
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
                      <div className="text-sm text-gray-600">
                        Laptop Dievaluasi
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {recommendations.length > 0
                          ? (recommendations[0].topsis_score * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600">
                        Skor Tertinggi
                      </div>
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
                      <div className="text-sm text-gray-600">
                        Harga Rata-rata
                      </div>
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
                        <div className="text-xs text-gray-600">
                          Portabilitas
                        </div>
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
                  <CardTitle className="text-lg">
                    Bagaimana TOPSIS Bekerja?
                  </CardTitle>
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
                        <li>
                          Normalisasi matriks keputusan menggunakan metode
                          vektor
                        </li>
                        <li>
                          Pembobotan matriks ternormalisasi sesuai preferensi
                          Anda
                        </li>
                        <li>Menentukan solusi ideal positif dan negatif</li>
                        <li>
                          Menghitung jarak setiap alternatif ke solusi ideal
                        </li>
                        <li>
                          Menghitung skor TOPSIS berdasarkan kedekatan relatif
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Keunggulan Metode:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>
                          Mempertimbangkan jarak ke solusi ideal positif dan
                          negatif
                        </li>
                        <li>Menghasilkan ranking yang stabil dan konsisten</li>
                        <li>
                          Dapat menangani kriteria benefit dan cost secara
                          bersamaan
                        </li>
                        <li>
                          Memberikan hasil yang dapat diinterpretasi dengan
                          mudah
                        </li>
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
                          Skor TOPSIS berkisar antara 0-100%. Semakin tinggi
                          skor, semakin dekat laptop tersebut dengan solusi
                          ideal berdasarkan preferensi Anda. Laptop dengan skor
                          di atas 80% dapat dianggap sangat sesuai dengan
                          kebutuhan Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
