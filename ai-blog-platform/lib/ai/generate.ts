export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    
    const result = await response.json()
    
    if (result.error) {
      throw new Error(`${result.error} - ${result.solution || ''}`)
    }
    
    if (!result.content) {
      throw new Error('Empty content received from API')
    }
    
    return result.content
  } catch (error: unknown) {
    let message = "An unknown Error occured";
    if(error instanceof Error){
      message = error.message;
    }
    console.error('AI Generation Error:', error)
    throw new Error(message || 'Failed to generate content. Please try again later.')
  }
}