// src/lib/topsis.ts
export interface LaptopData {
  id: string
  name: string
  price: number
  processor_score: number
  ram: number
  storage: number
  weight: number
  battery_life: number | null
}

export interface Criteria {
  code: string
  weight: number
  is_benefit: boolean // true untuk benefit (lebih besar lebih baik), false untuk cost (lebih kecil lebih baik)
}

export interface TOPSISResult {
  laptop_id: string
  topsis_score: number
  rank_position: number
  normalized_values: Record<string, number>
  weighted_values: Record<string, number>
  distance_positive: number
  distance_negative: number
}

export class TOPSISCalculator {
  private laptops: LaptopData[]
  private criteria: Criteria[]

  constructor(laptops: LaptopData[], criteria: Criteria[]) {
    this.laptops = laptops
    this.criteria = criteria
  }

  /**
   * Menjalankan perhitungan TOPSIS lengkap
   */
  calculate(): TOPSISResult[] {
    if (this.laptops.length === 0) return []

    // Step 1: Buat matriks keputusan
    const decisionMatrix = this.createDecisionMatrix()
    
    // Step 2: Normalisasi matriks
    const normalizedMatrix = this.normalizeMatrix(decisionMatrix)
    
    // Step 3: Buat matriks terbobot
    const weightedMatrix = this.createWeightedMatrix(normalizedMatrix)
    
    // Step 4: Tentukan solusi ideal positif dan negatif
    const { positiveIdeal, negativeIdeal } = this.findIdealSolutions(weightedMatrix)
    
    // Step 5: Hitung jarak ke solusi ideal
    const distances = this.calculateDistances(weightedMatrix, positiveIdeal, negativeIdeal)
    
    // Step 6: Hitung skor TOPSIS dan ranking
    const results = this.calculateTOPSISScores(distances, normalizedMatrix, weightedMatrix)
    
    return results.sort((a, b) => b.topsis_score - a.topsis_score)
      .map((result, index) => ({ ...result, rank_position: index + 1 }))
  }

  /**
   * Membuat matriks keputusan dari data laptop
   */
  private createDecisionMatrix(): number[][] {
    return this.laptops.map(laptop => [
      laptop.price,
      laptop.processor_score,
      laptop.ram,
      laptop.storage,
      laptop.weight,
      laptop.battery_life || 8 // default battery life jika null
    ])
  }

  /**
   * Normalisasi matriks menggunakan vector normalization
   */
  private normalizeMatrix(matrix: number[][]): number[][] {
    const numCriteria = matrix[0].length
    const normalizedMatrix: number[][] = []

    // Hitung sum of squares untuk setiap kriteria
    const sumSquares = new Array(numCriteria).fill(0)
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < numCriteria; j++) {
        sumSquares[j] += matrix[i][j] ** 2
      }
    }

    // Normalisasi setiap elemen
    for (let i = 0; i < matrix.length; i++) {
      const normalizedRow: number[] = []
      for (let j = 0; j < numCriteria; j++) {
        const normalizedValue = matrix[i][j] / Math.sqrt(sumSquares[j])
        normalizedRow.push(normalizedValue)
      }
      normalizedMatrix.push(normalizedRow)
    }

    return normalizedMatrix
  }

  /**
   * Membuat matriks terbobot
   */
  private createWeightedMatrix(normalizedMatrix: number[][]): number[][] {
    return normalizedMatrix.map(row => 
      row.map((value, index) => value * this.criteria[index].weight)
    )
  }

  /**
   * Mencari solusi ideal positif dan negatif
   */
  private findIdealSolutions(weightedMatrix: number[][]) {
    const numCriteria = weightedMatrix[0].length
    const positiveIdeal: number[] = []
    const negativeIdeal: number[] = []

    for (let j = 0; j < numCriteria; j++) {
      const columnValues = weightedMatrix.map(row => row[j])
      const isBenefit = this.criteria[j].is_benefit

      if (isBenefit) {
        // Untuk kriteria benefit, ideal positif = max, ideal negatif = min
        positiveIdeal.push(Math.max(...columnValues))
        negativeIdeal.push(Math.min(...columnValues))
      } else {
        // Untuk kriteria cost, ideal positif = min, ideal negatif = max
        positiveIdeal.push(Math.min(...columnValues))
        negativeIdeal.push(Math.max(...columnValues))
      }
    }

    return { positiveIdeal, negativeIdeal }
  }

  /**
   * Menghitung jarak Euclidean ke solusi ideal
   */
  private calculateDistances(
    weightedMatrix: number[][],
    positiveIdeal: number[],
    negativeIdeal: number[]
  ) {
    return weightedMatrix.map(row => {
      const distancePositive = Math.sqrt(
        row.reduce((sum, value, index) => 
          sum + Math.pow(value - positiveIdeal[index], 2), 0
        )
      )

      const distanceNegative = Math.sqrt(
        row.reduce((sum, value, index) => 
          sum + Math.pow(value - negativeIdeal[index], 2), 0
        )
      )

      return { distancePositive, distanceNegative }
    })
  }

  /**
   * Menghitung skor TOPSIS final
   */
  private calculateTOPSISScores(
    distances: { distancePositive: number; distanceNegative: number }[],
    normalizedMatrix: number[][],
    weightedMatrix: number[][]
  ): TOPSISResult[] {
    return this.laptops.map((laptop, index) => {
      const { distancePositive, distanceNegative } = distances[index]
      
      // Skor TOPSIS = D- / (D+ + D-)
      const topsisScore = distanceNegative / (distancePositive + distanceNegative)

      // Buat object untuk normalized dan weighted values
      const normalizedValues: Record<string, number> = {}
      const weightedValues: Record<string, number> = {}
      
      this.criteria.forEach((criterion, j) => {
        normalizedValues[criterion.code] = normalizedMatrix[index][j]
        weightedValues[criterion.code] = weightedMatrix[index][j]
      })

      return {
        laptop_id: laptop.id,
        topsis_score: Number(topsisScore.toFixed(4)),
        rank_position: 0, // akan diisi setelah sorting
        normalized_values: normalizedValues,
        weighted_values: weightedValues,
        distance_positive: Number(distancePositive.toFixed(4)),
        distance_negative: Number(distanceNegative.toFixed(4))
      }
    })
  }
}

/**
 * Helper function untuk menjalankan TOPSIS dengan data dari database
 */
export async function calculateRecommendations(
  laptops: LaptopData[],
  preferences: {
    price_weight: number
    performance_weight: number
    ram_weight: number
    storage_weight: number
    weight_importance: number
    battery_weight: number
  }
): Promise<TOPSISResult[]> {
  const criteria: Criteria[] = [
    { code: 'price', weight: preferences.price_weight, is_benefit: false },
    { code: 'performance', weight: preferences.performance_weight, is_benefit: true },
    { code: 'ram', weight: preferences.ram_weight, is_benefit: true },
    { code: 'storage', weight: preferences.storage_weight, is_benefit: true },
    { code: 'weight', weight: preferences.weight_importance, is_benefit: false },
    { code: 'battery', weight: preferences.battery_weight, is_benefit: true }
  ]

  const calculator = new TOPSISCalculator(laptops, criteria)
  return calculator.calculate()
}