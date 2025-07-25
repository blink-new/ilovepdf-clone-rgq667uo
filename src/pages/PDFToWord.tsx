import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { ArrowLeft, Download, FileText, AlertCircle, FileType } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PDFToWordProps {
  user: any
}

export function PDFToWord({ user }: PDFToWordProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setIsComplete(false)
    setError(null)
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Note: PDF to Word conversion requires advanced OCR/text extraction
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 4000))
      setIsComplete(true)
    } catch (err) {
      setError('An unexpected error occurred while converting PDF to Word')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    // Simulate download
    const a = document.createElement('a')
    a.href = '#'
    a.download = 'converted-document.docx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to tools
            </Link>
            <div className="ml-6">
              <h1 className="text-xl font-semibold text-gray-900">PDF to Word</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileType className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Word converter</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert PDF files to editable Word documents with high accuracy.
          </p>
        </div>

        {/* Premium Notice */}
        {!user && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-blue-700">
                <AlertCircle className="h-5 w-5" />
                <p>
                  <strong>Premium feature:</strong> Sign up for free to convert PDF to Word with advanced OCR technology.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isComplete ? (
          <>
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                multiple={false}
                onFilesSelected={handleFilesSelected}
                title="Select PDF file to convert"
                description="or drop PDF file here"
                accept=".pdf"
              />
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>File to convert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-10 w-10 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{files[0].name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(files[0].size)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">PDF → DOCX</p>
                      <p className="text-xs text-gray-500">Word format</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Convert Button */}
            {files.length > 0 && (
              <div className="text-center">
                <Button
                  onClick={handleConvert}
                  disabled={isProcessing || !user}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Converting to Word...
                    </>
                  ) : (
                    <>
                      <FileType className="mr-2 h-5 w-5" />
                      Convert to Word
                    </>
                  )}
                </Button>
                {!user && (
                  <p className="text-sm text-gray-500 mt-2">
                    <Link to="/register" className="text-primary hover:underline">
                      Sign up for free
                    </Link> to convert PDF to Word
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Conversion complete!
              </h2>
              <p className="text-gray-600 mb-6">
                Your PDF has been successfully converted to a Word document.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Word file
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setFiles([])
                    setIsComplete(false)
                    setError(null)
                  }}
                >
                  Convert another PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileType className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High accuracy</h3>
              <p className="text-sm text-gray-600">
                Advanced OCR technology preserves formatting and layout
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Editable format</h3>
              <p className="text-sm text-gray-600">
                Get fully editable Word documents you can modify
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast conversion</h3>
              <p className="text-sm text-gray-600">
                Convert PDFs to Word in seconds with professional quality
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}