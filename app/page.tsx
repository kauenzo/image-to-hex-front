'use client'

import type React from 'react'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  analyzeColorsService,
  applyFilterService,
} from './services/colorServices'

interface ColorAnalysisResult {
  colors: string[]
}

export default function ColorAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [colors, setColors] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const [filteredImg, setFilteredImg] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError('')
    } else {
      setError('Please select a valid image file')
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
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
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
    setError('')
    setFilteredImg(null)
    setColors([])

    try {
      const result = await analyzeColorsService(selectedFile)
      setColors(result.colors)
    } catch (err) {
      setError('Falha ao analisar cores da imagem. Tenta novamente.')
      console.error('Erro ao analisar cores:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilter = async (filterType: number) => {
    if (!selectedFile) return

    setIsLoading(true)
    setError('')
    setFilteredImg(null)
    setColors([])

    try {
      const result = await applyFilterService(selectedFile, filterType)
      if (result.filtered) {
        setFilteredImg(result.filtered)
      } else {
        setError('Resposta inesperada do servidor.')
      }
    } catch (err) {
      setError('Falha ao aplicar filtro. Tente novamente.')
      console.error('Erro ao aplicar filtro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Analisador de cores
          </h1>
          <p className='text-gray-600'>
            Faça upload de uma imagem para analisar cores ou aplicar filtro{' '}
          </p>
        </header>

        <div className='grid grid-cols-2 gap-8 h-[calc(100vh-200px)]'>
          {/* Left Section - Image Upload */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Enviar imagem
            </h2>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <p className='text-lg font-medium text-gray-900 mb-2'>
                Arraste e solte a imagem aqui, ou clique para selecionar
              </p>
              <p className='text-sm text-gray-500 mb-4'>
                Formatos suportados JPG e PNG até 10MB
              </p>

              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
                id='file-upload'
                disabled={isLoading}
              />
              <label
                htmlFor='file-upload'
                className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Escolher imagem
              </label>
            </div>

            {selectedFile && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm font-medium text-gray-900'>
                  Imagem selecionada:
                </p>
                <p className='text-sm text-gray-600'>{selectedFile.name}</p>
                <p className='text-xs text-gray-500'>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {error && (
              <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <div className='mt-6 flex gap-3'>
              <Button
                onClick={analyzeColors}
                disabled={!selectedFile || isLoading}
                className='flex-1'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processando...
                  </>
                ) : (
                  'Analisar cores'
                )}
              </Button>

              {/* Botões de filtro */}
              <Button
                onClick={() => applyFilter(0)}
                disabled={!selectedFile || isLoading}
                variant='outline'
                className='flex-1'
              >
                Escala de Cinza
              </Button>
              <Button
                onClick={() => applyFilter(1)}
                disabled={!selectedFile || isLoading}
                variant='outline'
                className='flex-1'
              >
                Sépia
              </Button>
              <Button
                onClick={() => applyFilter(2)}
                disabled={!selectedFile || isLoading}
                variant='outline'
                className='flex-1'
              >
                Negativo
              </Button>
            </div>
          </div>

          {/* Visual Divider */}
          <div className='w-px bg-gray-200 absolute left-1/2 transform -translate-x-1/2 h-full'></div>

          {/* Right Section - Results Display */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              {filteredImg ? 'Imagem filtrada' : 'Cores encontradas'}
            </h2>

            <div className='h-full'>
              {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                  <div className='text-center'>
                    <Loader2 className='mx-auto h-8 w-8 animate-spin text-blue-500 mb-4' />
                    <p className='text-gray-600'>Processando imagem...</p>
                  </div>
                </div>
              ) : filteredImg ? (
                <div className='flex flex-col items-center justify-center h-64'>
                  <img
                    src={`data:image/png;base64,${filteredImg}`}
                    alt='Imagem filtrada'
                    className='max-h-60 rounded shadow border mb-4'
                  />
                  <p className='text-xs text-gray-600'>
                    Pré-visualização do filtro aplicado
                  </p>
                </div>
              ) : colors.length > 0 ? (
                <div className='space-y-4'>
                  <p className='text-sm text-gray-600'>
                    Encontrado {colors.length} cores nessa imagem:
                  </p>
                  <div className='grid grid-cols-6 gap-3'>
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className='group'
                      >
                        <div
                          className='w-full aspect-square rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105'
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <p className='text-xs text-gray-600 text-center mt-1 font-mono'>
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center h-64'>
                  <div className='text-center'>
                    <div className='w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center'>
                      <Upload className='h-8 w-8 text-gray-400' />
                    </div>
                    <p className='text-gray-600'>
                      Envie uma imagem para ver as cores encontradas
                    </p>
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

