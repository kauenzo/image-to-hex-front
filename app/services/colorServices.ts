export interface ColorAnalysisResult {
  colors: string[]
}
const API_URL = 'http://localhost:3333'

export async function analyzeColorsService(
  file: File
): Promise<ColorAnalysisResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/analyze-colors`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Falha ao analisar cores')
  }

  return response.json()
}

export async function applyFilterService(
  file: File
): Promise<ColorAnalysisResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/apply-filter`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Falha ao aplicar filtro')
  }

  return response.json()
}

