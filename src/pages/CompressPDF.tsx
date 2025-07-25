import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { ArrowLeft, Download, Archive, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CompressPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFileSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0])
      setIsComplete(false)
    }
  }

  const handleCompress = async () => {
    if (!file) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setIsComplete(true)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCompressionInfo = (level: string) => {
    switch (level) {
      case 'low':
        return { reduction: '20-30%', quality: 'High quality, minimal compression' }
      case 'medium':
        return { reduction: '40-60%', quality: 'Good quality, balanced compression' }
      case 'high':
        return { reduction: '60-80%', quality: 'Smaller size, optimized for web' }
      default:
        return { reduction: '40-60%', quality: 'Good quality, balanced compression' }
    }
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
              <h1 className="text-xl font-semibold text-gray-900">Compress PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Archive className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compress PDF files</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reduce file size while optimizing for maximal PDF quality.
          </p>
        </div>

        {!isComplete ? (
          <>
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                multiple={false}
                onFilesSelected={handleFileSelected}
                title="Select PDF file to compress"
                description="or drop PDF file here"
              />
            </div>

            {/* File Info and Compression Options */}
            {file && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Compression settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-6 w-6 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">Original size: {formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Compression Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Compression level
                    </label>
                    <div className="space-y-3">
                      {(['low', 'medium', 'high'] as const).map((level) => {
                        const info = getCompressionInfo(level)
                        return (
                          <div key={level} className="flex items-start space-x-3">
                            <input
                              type="radio"
                              id={level}
                              name="compressionLevel"
                              value={level}
                              checked={compressionLevel === level}
                              onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high')}
                              className="h-4 w-4 text-primary mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor={level} className="block text-sm font-medium text-gray-900 capitalize">
                                {level} compression
                              </label>
                              <p className="text-xs text-gray-500">{info.quality}</p>
                              <p className="text-xs text-green-600 font-medium">
                                Expected reduction: {info.reduction}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compress Button */}
            {file && (
              <div className="text-center">
                <Button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Compressing PDF...
                    </>
                  ) : (
                    <>
                      <Archive className="mr-2 h-5 w-5" />
                      Compress PDF
                    </>
                  )}
                </Button>
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
                Your PDF has been compressed!
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Original size:</span>
                  <span className="font-medium">{file && formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Compressed size:</span>
                  <span className="font-medium text-green-600">
                    {file && formatFileSize(Math.floor(file.size * (compressionLevel === 'low' ? 0.75 : compressionLevel === 'medium' ? 0.5 : 0.3)))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Size reduction:</span>
                  <span className="font-medium text-green-600">
                    {compressionLevel === 'low' ? '25%' : compressionLevel === 'medium' ? '50%' : '70%'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Download className="mr-2 h-5 w-5" />
                  Download compressed PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setFile(null)
                    setIsComplete(false)
                  }}
                >
                  Compress another PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Archive className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart compression</h3>
              <p className="text-sm text-gray-600">
                Advanced algorithms reduce size while preserving quality
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple levels</h3>
              <p className="text-sm text-gray-600">
                Choose from low, medium, or high compression levels
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast processing</h3>
              <p className="text-sm text-gray-600">
                Compress your PDFs in seconds with optimal results
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}