// PreferencesForm.tsx
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Filter,
  RotateCcw,
  Search,
  Loader2,
  DollarSign,
  Zap,
  Monitor,
  HardDrive,
  Weight,
  Battery,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  UserPreferences,
  BRANDS,
  USAGE_TYPES,
  SCREEN_SIZE_OPTIONS,
} from "./types";

// Updated interface to match what the parent component is passing
interface PreferencesFormProps {
  preferences: UserPreferences;
  setPreferences: (preferences: UserPreferences) => void;
  onGenerateRecommendations: () => Promise<void>; // Changed to Promise<void>
  isLoading: boolean;
  onReset: () => void; // Added this prop
  showResults: boolean; // Added this prop
}

export default function PreferencesForm({
  preferences,
  setPreferences,
  onGenerateRecommendations,
  isLoading,
  onReset, // Now accepting onReset from parent
  showResults, // Now accepting showResults from parent
}: PreferencesFormProps) {
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

  // Remove the local resetPreferences function since we're using onReset from parent
  // const resetPreferences = () => { ... }

  const formatToRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const getTotalWeight = (): number => {
    return (
      preferences.price_weight +
      preferences.performance_weight +
      preferences.ram_weight +
      preferences.storage_weight +
      preferences.weight_importance +
      preferences.battery_weight
    );
  };

  const totalWeightPercentage = getTotalWeight() * 100;
  const isWeightValid = Math.abs(totalWeightPercentage - 100) < 0.1;
  const isWeightOver = totalWeightPercentage > 100;

  return (
    <Card className="sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Preferensi Anda
        </CardTitle>
        <CardDescription>
          Sesuaikan bobot kriteria sesuai prioritas Anda
        </CardDescription>
      </CardHeader>

      {/* Scrollable Content */}
      <CardContent className="flex-1 overflow-y-auto space-y-6 pb-4">
        {/* Total Weight Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Total Bobot Kriteria</Label>
            <span
              className={`text-sm font-bold ${
                isWeightValid
                  ? "text-green-600"
                  : isWeightOver
                  ? "text-red-600"
                  : "text-orange-600"
              }`}
            >
              {totalWeightPercentage.toFixed(1)}%
            </span>
          </div>

          <Progress
            value={Math.min(totalWeightPercentage, 100)}
            className={`h-3 ${isWeightOver ? "bg-red-100" : "bg-gray-200"}`}
          />

          {/* Weight Status Alert */}
          {!isWeightValid && (
            <Alert
              className={`${
                isWeightOver
                  ? "border-red-200 bg-red-50"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  isWeightOver ? "text-red-600" : "text-orange-600"
                }`}
              />
              <AlertDescription
                className={`text-sm ${
                  isWeightOver ? "text-red-800" : "text-orange-800"
                }`}
              >
                {isWeightOver
                  ? `Total bobot melebihi 100% (${totalWeightPercentage.toFixed(
                      1
                    )}%). Bobot akan dinormalisasi secara otomatis.`
                  : `Total bobot kurang dari 100% (${totalWeightPercentage.toFixed(
                      1
                    )}%). Sesuaikan bobot untuk hasil optimal.`}
              </AlertDescription>
            </Alert>
          )}

          {isWeightValid && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800">
                Bobot kriteria sudah seimbang dan optimal!
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

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
              <p className="text-xs text-gray-600 mt-1">
                {formatToRupiah(preferences.min_budget)}
              </p>
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
              <p className="text-xs text-gray-600 mt-1">
                {formatToRupiah(preferences.max_budget)}
              </p>
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
              onValueChange={(value) => handleWeightChange("ram_weight", value)}
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
          <Label className="text-sm font-medium">Preferensi Tambahan</Label>

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
                          preferred_brands: preferences.preferred_brands.filter(
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
      </CardContent>

      {/* Fixed Action Buttons */}
      <div className="flex-shrink-0 p-6 pt-0 space-y-3 border-t bg-white">
        <Button
          onClick={onGenerateRecommendations}
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
          onClick={onReset} // Now using onReset from parent instead of local resetPreferences
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
