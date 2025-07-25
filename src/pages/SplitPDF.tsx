import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { ArrowLeft, Download, Scissors, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges'>('pages')
  const [pageNumbers, setPageNumbers] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFileSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0])
      setIsComplete(false)
    }
  }

  const handleSplit = async () => {
    if (!file) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setIsComplete(true)
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
              <h1 className="text-xl font-semibold text-gray-900">Split PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF files</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Separate one page or a whole set for easy conversion into independent PDF files.
          </p>
        </div>

        {!isComplete ? (
          <>
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                multiple={false}
                onFilesSelected={handleFileSelected}
                title="Select PDF file to split"
                description="or drop PDF file here"
              />
            </div>

            {/* Split Options */}
            {file && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Split options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="pages"
                        name="splitMode"
                        value="pages"
                        checked={splitMode === 'pages'}
                        onChange={(e) => setSplitMode(e.target.value as 'pages' | 'ranges')}
                        className="h-4 w-4 text-primary"
                      />
                      <label htmlFor="pages" className="text-sm font-medium text-gray-900">
                        Extract specific pages
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="ranges"
                        name="splitMode"
                        value="ranges"
                        checked={splitMode === 'ranges'}
                        onChange={(e) => setSplitMode(e.target.value as 'pages' | 'ranges')}
                        className="h-4 w-4 text-primary"
                      />
                      <label htmlFor="ranges" className="text-sm font-medium text-gray-900">
                        Split into ranges
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {splitMode === 'pages' ? 'Page numbers (e.g., 1,3,5-7)' : 'Page ranges (e.g., 1-3,4-6)'}
                    </label>
                    <input
                      type="text"
                      value={pageNumbers}
                      onChange={(e) => setPageNumbers(e.target.value)}
                      placeholder={splitMode === 'pages' ? '1,3,5-7' : '1-3,4-6'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {splitMode === 'pages' 
                        ? 'Enter page numbers separated by commas. Use hyphens for ranges.'
                        : 'Enter page ranges separated by commas.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Split Button */}
            {file && pageNumbers && (
              <div className="text-center">
                <Button
                  onClick={handleSplit}
                  disabled={isProcessing}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Splitting PDF...
                    </>
                  ) : (
                    <>
                      <Scissors className="mr-2 h-5 w-5" />
                      Split PDF
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
                Your PDF has been split!
              </h2>
              <p className="text-gray-600 mb-6">
                The PDF has been successfully split according to your specifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Download className="mr-2 h-5 w-5" />
                  Download split files
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setFile(null)
                    setPageNumbers('')
                    setIsComplete(false)
                  }}
                >
                  Split another PDF
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
                <Scissors className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precise splitting</h3>
              <p className="text-sm text-gray-600">
                Extract specific pages or split into custom ranges
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple outputs</h3>
              <p className="text-sm text-gray-600">
                Get separate PDF files for each page or range
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High quality</h3>
              <p className="text-sm text-gray-600">
                Maintain original quality in all split files
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}