import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, Presentation, Download, CheckCircle, Loader2 } from 'lucide-react'

interface PDFToPowerPointProps {
  user: any
}

export default function PDFToPowerPoint({ user }: PDFToPowerPointProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<Array<{ file: Blob; filename: string }>>([])
  const [error, setError] = useState<string>('')

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setError('')
    setResults([])
  }

  const handleProcess = async () => {
    if (files.length === 0) return

    setProcessing(true)
    setError('')
    
    try {
      const processedResults = []
      
      for (const file of files) {
        const result = await PDFProcessor.pdfToPowerPoint(file)
        
        if (result.success && result.file) {
          processedResults.push({
            file: result.file,
            filename: result.filename || `${file.name}-presentation.txt`
          })
        } else {
          throw new Error(result.error || 'Failed to convert PDF')
        }
      }
      
      setResults(processedResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion')
    } finally {
      setProcessing(false)
    }
  }

  const downloadFile = (file: Blob, filename: string) => {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    results.forEach(result => {
      downloadFile(result.file, result.filename)
    })
  }

  if (results.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">PDF to PowerPoint Conversion Complete!</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-orange-600">Conversion Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your PDF files have been converted to PowerPoint format. Download the files below.
              </p>
              
              <div className="space-y-4 mb-6">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Presentation className="h-8 w-8 text-orange-500 mr-3" />
                      <span className="font-medium">{result.filename}</span>
                    </div>
                    <Button
                      onClick={() => downloadFile(result.file, result.filename)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              {results.length > 1 && (
                <Button
                  onClick={downloadAll}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download All Files
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => {
                setFiles([])
                setResults([])
                setError('')
              }}
              variant="outline"
              size="lg"
            >
              Convert Another PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to PowerPoint</h1>
          <p className="text-gray-600">Turn your PDF files into PowerPoint presentations - free and easy to use.</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Presentation className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Page to Slide</h3>
              <p className="text-sm text-gray-600">Each PDF page becomes a presentation slide</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Preserve Layout</h3>
              <p className="text-sm text-gray-600">Maintain original formatting and structure</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ready to Edit</h3>
              <p className="text-sm text-gray-600">Open in PowerPoint and customize as needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Upload PDF Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes={['.pdf']}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
            />
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Selected Files ({files.length})</h3>
                <div className="space-y-2 mb-6">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Presentation className="h-5 w-5 text-orange-500 mr-3" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleProcess}
                    disabled={processing}
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Converting to PowerPoint...
                      </>
                    ) : (
                      <>
                        <Presentation className="mr-2 h-5 w-5" />
                        Convert to PowerPoint
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">How PDF to PowerPoint Conversion Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your PDF files that you want to convert to presentation format</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Each PDF page is converted into a separate PowerPoint slide</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>Text, images, and layout are preserved and optimized for presentation</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Download your PowerPoint file and customize it in Microsoft PowerPoint</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}