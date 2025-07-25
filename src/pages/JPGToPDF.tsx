import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, FileImage, Download, CheckCircle, Loader2, Image } from 'lucide-react'

interface JPGToPDFProps {
  user: any
}

export default function JPGToPDF({ user }: JPGToPDFProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ file: Blob; filename: string } | null>(null)
  const [error, setError] = useState<string>('')

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setError('')
    setResult(null)
  }

  const handleProcess = async () => {
    if (files.length === 0) return

    setProcessing(true)
    setError('')
    
    try {
      const result = await PDFProcessor.imagesToPDF(files)
      
      if (result.success && result.file) {
        setResult({
          file: result.file,
          filename: result.filename || 'converted-images.pdf'
        })
      } else {
        throw new Error(result.error || 'Failed to convert images')
      }
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

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">JPG to PDF Conversion Complete!</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-600">Conversion Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your images have been combined into a single PDF document. Download the file below.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 max-w-md mx-auto">
                <div className="flex items-center">
                  <FileImage className="h-8 w-8 text-purple-500 mr-3" />
                  <span className="font-medium">{result.filename}</span>
                </div>
                <Button
                  onClick={() => downloadFile(result.file, result.filename)}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                PDF contains {files.length} image{files.length > 1 ? 's' : ''} • Ready to share or print
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => {
                setFiles([])
                setResult(null)
                setError('')
              }}
              variant="outline"
              size="lg"
            >
              Convert More Images
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JPG to PDF</h1>
          <p className="text-gray-600">Convert JPG, PNG, BMP, GIF and TIFF images to PDF in seconds.</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Image className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-600">Support for JPG, PNG, BMP, GIF, and TIFF images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Combine Images</h3>
              <p className="text-sm text-gray-600">Merge multiple images into a single PDF document</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Optimized Output</h3>
              <p className="text-sm text-gray-600">Images are optimized for PDF format and file size</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Upload Image Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes={['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']}
              maxFiles={50}
              maxSize={10 * 1024 * 1024} // 10MB per image
            />
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Selected Images ({files.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Image className="h-5 w-5 text-purple-500 mr-3" />
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
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Converting to PDF...
                      </>
                    ) : (
                      <>
                        <FileImage className="mr-2 h-5 w-5" />
                        Convert to PDF
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
            <h3 className="font-semibold mb-4">How JPG to PDF Conversion Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your image files (JPG, PNG, BMP, GIF, or TIFF format)</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Images are automatically resized and optimized for PDF format</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>Each image becomes a separate page in the PDF document</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Download your PDF document ready for sharing, printing, or archiving</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}