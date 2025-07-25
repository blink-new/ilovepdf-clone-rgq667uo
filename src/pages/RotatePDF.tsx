import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, RotateCw, Download, CheckCircle, Loader2 } from 'lucide-react'

interface RotatePDFProps {
  user: any
}

export default function RotatePDF({ user }: RotatePDFProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<Array<{ file: Blob; filename: string }>>([])
  const [error, setError] = useState<string>('')
  const [rotation, setRotation] = useState<90 | 180 | 270>(90)

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
        const result = await PDFProcessor.rotatePDF(file, rotation)
        
        if (result.success && result.file) {
          processedResults.push({
            file: result.file,
            filename: result.filename || `rotated-${file.name}`
          })
        } else {
          throw new Error(result.error || 'Failed to rotate PDF')
        }
      }
      
      setResults(processedResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during rotation')
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">PDF Rotation Complete!</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-yellow-600">Rotation Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your PDF files have been rotated {rotation}°. Download the files below.
              </p>
              
              <div className="space-y-4 mb-6">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <RotateCw className="h-8 w-8 text-yellow-500 mr-3" />
                      <span className="font-medium">{result.filename}</span>
                    </div>
                    <Button
                      onClick={() => downloadFile(result.file, result.filename)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
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
              Rotate Another PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rotate PDF</h1>
          <p className="text-gray-600">Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCw className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Angles</h3>
              <p className="text-sm text-gray-600">Rotate by 90°, 180°, or 270° clockwise</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Batch Processing</h3>
              <p className="text-sm text-gray-600">Rotate multiple PDF files at once</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Preserve Quality</h3>
              <p className="text-sm text-gray-600">No quality loss during rotation process</p>
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
                        <RotateCw className="h-5 w-5 text-yellow-500 mr-3" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rotation Options */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Rotation Angle</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={rotation === 90 ? 'default' : 'outline'}
                      onClick={() => setRotation(90)}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <RotateCw className="h-6 w-6 mb-2" />
                      90° Clockwise
                    </Button>
                    <Button
                      variant={rotation === 180 ? 'default' : 'outline'}
                      onClick={() => setRotation(180)}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <RotateCw className="h-6 w-6 mb-2" />
                      180°
                    </Button>
                    <Button
                      variant={rotation === 270 ? 'default' : 'outline'}
                      onClick={() => setRotation(270)}
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <RotateCw className="h-6 w-6 mb-2" />
                      270° Clockwise
                    </Button>
                  </div>
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Rotating PDFs...
                      </>
                    ) : (
                      <>
                        <RotateCw className="mr-2 h-5 w-5" />
                        Rotate PDFs ({rotation}°)
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
            <h3 className="font-semibold mb-4">How PDF Rotation Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your PDF files that need to be rotated</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Choose the rotation angle: 90°, 180°, or 270° clockwise</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>All pages in each PDF are rotated by the selected angle</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Download your rotated PDF files with preserved quality and formatting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}