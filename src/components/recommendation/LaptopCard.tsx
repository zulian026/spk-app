"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Cpu,
  HardDrive,
  Weight,
  Monitor,
} from "lucide-react";
import { LaptopWithDetails } from "@/types/recommendation";
import { TOPSISResult } from "@/lib/topsis";

interface LaptopCardProps {
  laptop: LaptopWithDetails;
  recommendation: TOPSISResult;
}

export default function LaptopCard({ laptop, recommendation }: LaptopCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">
                #{recommendation.rank_position}
              </Badge>
              <h3 className="font-semibold text-lg">
                {laptop.name}
              </h3>
              <Badge variant="outline">{laptop.brand}</Badge>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-2">
              {formatPrice(laptop.price)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {(recommendation.topsis_score * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              Skor TOPSIS
            </div>
            {laptop.avg_rating && laptop.avg_rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">
                  {laptop.avg_rating} ({laptop.review_count} ulasan)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              Skor: {laptop.processor_score}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {laptop.ram}GB RAM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {laptop.storage}GB {laptop.storage_type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{laptop.weight}kg</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Grafis:</strong> {laptop.graphics_card}
          </div>
          <div>
            <strong>Layar:</strong> {laptop.screen_size}" {laptop.screen_resolution}
          </div>
          {laptop.battery_life && (
            <div>
              <strong>Baterai:</strong> {laptop.battery_life} jam
            </div>
          )}
        </div>

        {laptop.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {laptop.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
