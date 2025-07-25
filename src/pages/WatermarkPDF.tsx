import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Slider } from '../components/ui/slider'
import { FileUpload } from '../components/FileUpload'
import { ArrowLeft, Download, FileText, AlertCircle, Type, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'

interface WatermarkPDFProps {
  user: any
}

export function WatermarkPDF({ user }: WatermarkPDFProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [processedFile, setProcessedFile] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Watermark settings
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState([30])
  const [fontSize, setFontSize] = useState([50])
  const [color, setColor] = useState('#FF0000')

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setIsComplete(false)
    setError(null)
  }

  const handleAddWatermark = async () => {
    if (files.length === 0 || !watermarkText.trim()) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const result = await PDFProcessor.addWatermark(files[0], watermarkText, {
        opacity: opacity[0] / 100,
        fontSize: fontSize[0],
        color: color
      })
      
      if (result.success && result.file) {
        setProcessedFile(result.file)
        setIsComplete(true)
      } else {
        setError(result.error || 'Failed to add watermark to PDF')
      }
    } catch (err) {
      setError('An unexpected error occurred while adding watermark')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedFile) return
    
    const url = URL.createObjectURL(processedFile)
    const a = document.createElement('a')
    a.href = url
    a.download = `watermarked-${files[0]?.name || 'document.pdf'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
              <h1 className="text-xl font-semibold text-gray-900">Add Watermark</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Type className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add watermark to PDF</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Protect your documents by adding custom text watermarks to your PDF files.
          </p>
        </div>

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
                title="Select PDF file to watermark"
                description="or drop PDF file here"
                accept=".pdf"
              />
            </div>

            {/* Watermark Settings */}
            {files.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Watermark Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Watermark Text */}
                  <div className="space-y-2">
                    <Label htmlFor="watermark-text">Watermark Text</Label>
                    <Input
                      id="watermark-text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="max-w-md"
                    />
                  </div>

                  {/* Opacity */}
                  <div className="space-y-3">
                    <Label>Opacity: {opacity[0]}%</Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={10}
                      step={5}
                      className="max-w-md"
                    />
                  </div>

                  {/* Font Size */}
                  <div className="space-y-3">
                    <Label>Font Size: {fontSize[0]}px</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={100}
                      min={20}
                      step={5}
                      className="max-w-md"
                    />
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="watermark-color">Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="watermark-color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#FF0000"
                        className="max-w-32"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div 
                      className="text-center transform -rotate-45 select-none"
                      style={{
                        color: color,
                        opacity: opacity[0] / 100,
                        fontSize: `${Math.min(fontSize[0] / 3, 24)}px`,
                        fontWeight: 'bold'
                      }}
                    >
                      {watermarkText || 'WATERMARK'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Preview */}
            {files.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>File to watermark</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-10 w-10 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{files[0].name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(files[0].size)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Watermark Button */}
            {files.length > 0 && watermarkText.trim() && (
              <div className="text-center">
                <Button
                  onClick={handleAddWatermark}
                  disabled={isProcessing}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding watermark...
                    </>
                  ) : (
                    <>
                      <Type className="mr-2 h-5 w-5" />
                      Add Watermark
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
                Watermark added successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your PDF has been watermarked with "{watermarkText}".
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download watermarked PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setFiles([])
                    setIsComplete(false)
                    setProcessedFile(null)
                    setError(null)
                  }}
                >
                  Watermark another PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Type className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom text</h3>
              <p className="text-sm text-gray-600">
                Add any text as watermark with custom styling
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customizable</h3>
              <p className="text-sm text-gray-600">
                Adjust opacity, size, and color to fit your needs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Document protection</h3>
              <p className="text-sm text-gray-600">
                Protect your documents from unauthorized use
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}