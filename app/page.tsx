"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColorAnalysisResult {
  colors: string[]
}

export default function ColorAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [colors, setColors] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setError("")
    } else {
      setError("Please select a valid image file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const analyzeColors = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError("")
    setColors([])

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Using analyze-colors endpoint
      const response = await fetch("/api/analyze-colors", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze colors")
      }

      const result: ColorAnalysisResult = await response.json()
      setColors(result.colors)
    } catch (err) {
      setError("Failed to analyze image colors. Please try again.")
      console.error("Error analyzing colors:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilter = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError("")
    setColors([])

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Using apply-filter endpoint
      const response = await fetch("/api/apply-filter", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to apply filter")
      }

      const result: ColorAnalysisResult = await response.json()
      setColors(result.colors)
    } catch (err) {
      setError("Failed to apply filter. Please try again.")
      console.error("Error applying filter:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Analyzer</h1>
          <p className="text-gray-600">Upload an image to analyze its colors or apply filters</p>
        </header>

        <div className="grid grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Section - Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop your image here, or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, GIF up to 10MB</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Choose File
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Selected File:</p>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button onClick={analyzeColors} disabled={!selectedFile || isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Analyze Colors"
                )}
              </Button>

              <Button onClick={applyFilter} disabled={!selectedFile || isLoading} variant="outline" className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Apply Filter"
                )}
              </Button>
            </div>
          </div>

          {/* Visual Divider */}
          <div className="w-px bg-gray-200 absolute left-1/2 transform -translate-x-1/2 h-full"></div>

          {/* Right Section - Results Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Results</h2>

            <div className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600">Analyzing image colors...</p>
                  </div>
                </div>
              ) : colors.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Found {colors.length} colors in your image:</p>
                  <div className="grid grid-cols-6 gap-3">
                    {colors.map((color, index) => (
                      <div key={index} className="group">
                        <div
                          className="w-full aspect-square rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <p className="text-xs text-gray-600 text-center mt-1 font-mono">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Upload an image to see color analysis results</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
