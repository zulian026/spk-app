// components/RecommendationForm.tsx
"use client";

import PreferencesForm from "@/components/recommendation/PreferencesForm";
import RecommendationsResults from "@/components/recommendation/RecommendationsResults";
import { useRecommendation } from "@/hooks/useRecommendation";

export default function RecommendationForm() {
  const {
    preferences,
    setPreferences,
    laptops,
    recommendations,
    loading,
    calculating,
    calculateRecommendation,
  } = useRecommendation();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistem Rekomendasi Laptop
        </h1>
        <p className="text-gray-600">
          Temukan laptop yang sempurna berdasarkan kebutuhan Anda menggunakan
          algoritma TOPSIS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulir Preferensi */}
        <div className="lg:col-span-1">
          <PreferencesForm
            preferences={preferences}
            onPreferencesChange={setPreferences}
            onCalculate={calculateRecommendation}
            calculating={calculating}
            loading={loading}
          />
        </div>

        {/* Hasil Rekomendasi */}
        <div className="lg:col-span-2">
          <RecommendationsResults
            loading={loading}
            recommendations={recommendations}
            laptops={laptops}
          />
        </div>
      </div>
    </div>
  );
}
