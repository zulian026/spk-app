"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Laptop, Home, ArrowLeft } from "lucide-react";
import { Laptop as LaptopType, UserPreferences, Recommendation } from "./types";
import PreferencesForm from "./PreferencesForm";
import RecommendationResults from "./RecommendationResults";

export default function RecommendationPage() {
  const [supabase] = useState(() => createClientComponentClient());
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
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

  const handleBackToHome = () => {
    // You can customize this based on your routing setup
    window.location.href = "/"; // Simple redirect to home
    // Or if using Next.js router:
    // router.push("/");
    // Or if using React Router:
    // navigate("/");
  };

  const calculateTOPSIS = (
    laptops: LaptopType[],
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
    const getLaptopValue = (laptop: LaptopType, key: string): number => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SPK</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LaptopFinder
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
            <PreferencesForm
              preferences={preferences}
              setPreferences={setPreferences}
              isLoading={isLoading}
              onGenerateRecommendations={handleGenerateRecommendations}
              onReset={resetPreferences}
              showResults={showResults}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <RecommendationResults
              showResults={showResults}
              recommendations={recommendations}
              preferences={preferences}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
