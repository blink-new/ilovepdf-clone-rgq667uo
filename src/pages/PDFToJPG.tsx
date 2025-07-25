import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, Image, Download, CheckCircle, Loader2 } from 'lucide-react'

interface PDFToJPGProps {
  user: any
}

export default function PDFToJPG({ user }: PDFToJPGProps) {
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
      const allResults = []
      
      for (const file of files) {
        const fileResults = await PDFProcessor.pdfToJPG(file)
        
        for (const result of fileResults) {
          if (result.success && result.file) {
            allResults.push({
              file: result.file,
              filename: result.filename || `${file.name}-page.jpg`
            })
          } else {
            throw new Error(result.error || 'Failed to convert PDF')
          }
        }
      }
      
      setResults(allResults)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">PDF to JPG Conversion Complete!</h1>
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
                Your PDF pages have been converted to JPG images. Download the files below.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Image className="h-8 w-8 text-purple-500 mr-3" />
                      <span className="font-medium">{result.filename}</span>
                    </div>
                    <Button
                      onClick={() => downloadFile(result.file, result.filename)}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={downloadAll}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Download className="mr-2 h-5 w-5" />
                Download All Images ({results.length})
              </Button>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to JPG</h1>
          <p className="text-gray-600">Convert each PDF page into a JPG or extract all images contained in a PDF.</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Image className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">High Quality</h3>
              <p className="text-sm text-gray-600">Convert PDF pages to high-resolution JPG images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">All Pages</h3>
              <p className="text-sm text-gray-600">Each PDF page becomes a separate JPG image</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Batch Download</h3>
              <p className="text-sm text-gray-600">Download all images at once or individually</p>
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
                        Converting to JPG...
                      </>
                    ) : (
                      <>
                        <Image className="mr-2 h-5 w-5" />
                        Convert to JPG
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
            <h3 className="font-semibold mb-4">How PDF to JPG Conversion Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your PDF files that you want to convert to JPG images</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Each page of your PDF is rendered as a high-quality JPG image</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>Images are optimized for quality while maintaining reasonable file sizes</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Download individual images or all images at once in a convenient package</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}