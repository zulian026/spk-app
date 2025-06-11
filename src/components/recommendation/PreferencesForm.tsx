"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Cpu,
  HardDrive,
  Battery,
  Weight,
  Monitor,
  DollarSign,
} from "lucide-react";
import { UserPreferences } from "@/types/recommendation";

const USAGE_OPTIONS = [
  { value: "gaming", label: "Gaming & Hiburan" },
  { value: "office", label: "Kantor & Produktivitas" },
  { value: "design", label: "Desain & Kreatif" },
  { value: "student", label: "Pelajar & Studi" },
  { value: "multimedia", label: "Multimedia & Konten" },
  { value: "programming", label: "Pemrograman & Pengembangan" },
];

const SCREEN_SIZE_OPTIONS = [
  { value: "small", label: 'Kompak (≤ 13")' },
  { value: "medium", label: 'Standar (14-15")' },
  { value: "large", label: 'Besar (≥ 16")' },
];

const BRANDS = ["ASUS", "Lenovo", "HP", "Dell", "Apple", "Acer", "MSI"];

interface PreferencesFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onCalculate: () => void;
  calculating: boolean;
  loading: boolean;
}

export default function PreferencesForm({
  preferences,
  onPreferencesChange,
  onCalculate,
  calculating,
  loading,
}: PreferencesFormProps) {
  const handleWeightChange = (
    criterion: keyof UserPreferences,
    value: number[]
  ) => {
    onPreferencesChange({
      ...preferences,
      [criterion]: value[0],
    });
  };

  const toggleBrand = (brand: string) => {
    const updatedBrands = preferences.preferred_brands.includes(brand)
      ? preferences.preferred_brands.filter((b) => b !== brand)
      : [...preferences.preferred_brands, brand];

    onPreferencesChange({
      ...preferences,
      preferred_brands: updatedBrands,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi Anda</CardTitle>
        <CardDescription>
          Sesuaikan tingkat kepentingan setiap kriteria (bobot akan
          dinormalisasi)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Criterion Weights */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="price-weight" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Kepentingan Harga: {(preferences.price_weight * 100).toFixed(0)}%
            </Label>
            <Slider
              id="price-weight"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.price_weight]}
              onValueChange={(value) =>
                handleWeightChange("price_weight", value)
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label
              htmlFor="performance-weight"
              className="flex items-center gap-2"
            >
              <Cpu className="h-4 w-4" />
              Performa: {(preferences.performance_weight * 100).toFixed(0)}%
            </Label>
            <Slider
              id="performance-weight"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.performance_weight]}
              onValueChange={(value) =>
                handleWeightChange("performance_weight", value)
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="ram-weight" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              RAM: {(preferences.ram_weight * 100).toFixed(0)}%
            </Label>
            <Slider
              id="ram-weight"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.ram_weight]}
              onValueChange={(value) => handleWeightChange("ram_weight", value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="storage-weight" className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Penyimpanan: {(preferences.storage_weight * 100).toFixed(0)}%
            </Label>
            <Slider
              id="storage-weight"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.storage_weight]}
              onValueChange={(value) =>
                handleWeightChange("storage_weight", value)
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label
              htmlFor="weight-importance"
              className="flex items-center gap-2"
            >
              <Weight className="h-4 w-4" />
              Portabilitas: {(preferences.weight_importance * 100).toFixed(0)}%
            </Label>
            <Slider
              id="weight-importance"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.weight_importance]}
              onValueChange={(value) =>
                handleWeightChange("weight_importance", value)
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="battery-weight" className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              Baterai: {(preferences.battery_weight * 100).toFixed(0)}%
            </Label>
            <Slider
              id="battery-weight"
              min={0}
              max={1}
              step={0.01}
              value={[preferences.battery_weight]}
              onValueChange={(value) =>
                handleWeightChange("battery_weight", value)
              }
              className="mt-2"
            />
          </div>
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-4">
          <Label>Rentang Anggaran</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-budget" className="text-sm">
                Anggaran Minimum
              </Label>
              <Input
                id="min-budget"
                type="number"
                value={preferences.min_budget}
                onChange={(e) =>
                  onPreferencesChange({
                    ...preferences,
                    min_budget: Number(e.target.value),
                  })
                }
                min={5000000}
                step={1000000}
              />
            </div>
            <div>
              <Label htmlFor="max-budget" className="text-sm">
                Anggaran Maksimum
              </Label>
              <Input
                id="max-budget"
                type="number"
                value={preferences.max_budget || ""}
                onChange={(e) =>
                  onPreferencesChange({
                    ...preferences,
                    max_budget: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                min={preferences.min_budget}
                step={1000000}
              />
            </div>
          </div>
        </div>

        {/* Usage Type */}
        <div>
          <Label htmlFor="primary-usage">Penggunaan Utama</Label>
          <Select
            value={preferences.primary_usage}
            onValueChange={(value) =>
              onPreferencesChange({
                ...preferences,
                primary_usage: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Screen Size Preference */}
        <div>
          <Label htmlFor="screen-size">Preferensi Ukuran Layar</Label>
          <Select
            value={preferences.screen_size_preference}
            onValueChange={(value) =>
              onPreferencesChange({
                ...preferences,
                screen_size_preference: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCREEN_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preferred Brands */}
        <div>
          <Label>Merek Favorit (Opsional)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {BRANDS.map((brand) => (
              <Badge
                key={brand}
                variant={
                  preferences.preferred_brands.includes(brand)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleBrand(brand)}
              >
                {brand}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={onCalculate}
          disabled={calculating || loading}
          className="w-full"
        >
          {calculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menghitung...
            </>
          ) : (
            "Dapatkan Rekomendasi"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
