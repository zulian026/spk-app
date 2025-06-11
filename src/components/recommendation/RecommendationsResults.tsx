// components/recommendation/RecommendationsResults.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Monitor } from "lucide-react";
import { LaptopWithDetails } from "@/types/recommendation";
import { TOPSISResult } from "@/lib/topsis";
import LaptopCard from "./LaptopCard";

interface RecommendationsResultsProps {
  loading: boolean;
  recommendations: TOPSISResult[];
  laptops: LaptopWithDetails[];
}

export default function RecommendationsResults({
  loading,
  recommendations,
  laptops,
}: RecommendationsResultsProps) {
  const getLaptopDetails = (laptopId: string): LaptopWithDetails | undefined => {
    return laptops.find((laptop) => laptop.id === laptopId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekomendasi Laptop</CardTitle>
        <CardDescription>
          {recommendations.length > 0 &&
            `Top ${recommendations.length} rekomendasi berdasarkan preferensi Anda`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat laptop...</span>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              Belum ada rekomendasi. Atur preferensi Anda dan klik "Dapatkan Rekomendasi"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 10).map((rec) => {
              const laptop = getLaptopDetails(rec.laptop_id);
              if (!laptop) return null;

              return (
                <LaptopCard
                  key={rec.laptop_id}
                  laptop={laptop}
                  recommendation={rec}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}