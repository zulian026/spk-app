// hooks/useRecommendation.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  calculateRecommendations,
  type TOPSISResult,
} from "@/lib/topsis";
import { UserPreferences, LaptopWithDetails } from "@/types/recommendation";

export function useRecommendation() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    price_weight: 0.25,
    performance_weight: 0.2,
    ram_weight: 0.15,
    storage_weight: 0.15,
    weight_importance: 0.15,
    battery_weight: 0.1,
    min_budget: 5000000,
    max_budget: 50000000,
    preferred_brands: [],
    primary_usage: "office",
    screen_size_preference: "medium",
  });

  const [laptops, setLaptops] = useState<LaptopWithDetails[]>([]);
  const [recommendations, setRecommendations] = useState<TOPSISResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Load laptops from database
  useEffect(() => {
    loadLaptops();
  }, []);

  const loadLaptops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("laptops_with_ratings")
        .select("*")
        .eq("availability_status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const laptopData: LaptopWithDetails[] = data.map((laptop) => ({
        id: laptop.id,
        name: laptop.name,
        brand: laptop.brand,
        price: laptop.price,
        processor_score: laptop.processor_score,
        ram: laptop.ram,
        storage: laptop.storage,
        storage_type: laptop.storage_type,
        weight: laptop.weight,
        battery_life: laptop.battery_life,
        graphics_card: laptop.graphics_card,
        screen_size: laptop.screen_size,
        screen_resolution: laptop.screen_resolution,
        image_url: laptop.image_url,
        description: laptop.description,
        avg_rating: laptop.avg_rating,
        review_count: laptop.review_count,
      }));

      setLaptops(laptopData);
    } catch (error) {
      console.error("Error loading laptops:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeWeights = (prefs: UserPreferences): UserPreferences => {
    const weights = [
      prefs.price_weight,
      prefs.performance_weight,
      prefs.ram_weight,
      prefs.storage_weight,
      prefs.weight_importance,
      prefs.battery_weight,
    ];

    const total = weights.reduce((sum, weight) => sum + weight, 0);

    if (total === 0) return prefs;

    return {
      ...prefs,
      price_weight: prefs.price_weight / total,
      performance_weight: prefs.performance_weight / total,
      ram_weight: prefs.ram_weight / total,
      storage_weight: prefs.storage_weight / total,
      weight_importance: prefs.weight_importance / total,
      battery_weight: prefs.battery_weight / total,
    };
  };

  const calculateRecommendation = async () => {
    try {
      setCalculating(true);

      // Normalize weights first
      const normalizedPrefs = normalizeWeights(preferences);
      setPreferences(normalizedPrefs);

      // Filter laptops based on budget and preferences
      let filteredLaptops = laptops.filter((laptop) => {
        const withinBudget =
          laptop.price >= normalizedPrefs.min_budget &&
          (!normalizedPrefs.max_budget || laptop.price <= normalizedPrefs.max_budget);

        const brandMatch =
          normalizedPrefs.preferred_brands.length === 0 ||
          normalizedPrefs.preferred_brands.includes(laptop.brand);

        return withinBudget && brandMatch;
      });

      if (filteredLaptops.length === 0) {
        alert(
          "No laptops found matching your criteria. Please adjust your preferences."
        );
        return;
      }

      // Calculate TOPSIS recommendations
      const results = await calculateRecommendations(
        filteredLaptops,
        normalizedPrefs
      );
      setRecommendations(results);

      // Save preferences and recommendations to database
      if (user) {
        await savePreferencesAndRecommendations(results);
      }
    } catch (error) {
      console.error("Error calculating recommendations:", error);
      alert("Error calculating recommendations. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const savePreferencesAndRecommendations = async (results: TOPSISResult[]) => {
    try {
      // Save user preferences
      const { data: prefData, error: prefError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user?.id,
          ...preferences,
          preference_name: `Recommendation ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single();

      if (prefError) throw prefError;

      // Save recommendations
      const recommendationsData = results.map((result) => ({
        user_id: user?.id,
        preference_id: prefData.id,
        laptop_id: result.laptop_id,
        topsis_score: result.topsis_score,
        rank_position: result.rank_position,
        normalized_values: result.normalized_values,
        weighted_values: result.weighted_values,
        distance_positive: result.distance_positive,
        distance_negative: result.distance_negative,
      }));

      const { error: recError } = await supabase
        .from("recommendations")
        .insert(recommendationsData);

      if (recError) throw recError;
    } catch (error) {
      console.error("Error saving recommendations:", error);
    }
  };

  return {
    preferences,
    setPreferences,
    laptops,
    recommendations,
    loading,
    calculating,
    calculateRecommendation,
  };
}