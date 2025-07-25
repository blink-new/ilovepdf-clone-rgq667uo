import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { ArrowLeft, Download, FileText, ArrowUpDown, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MergePDF() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setIsComplete(false)
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setIsComplete(true)
  }

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files]
    const [movedFile] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, movedFile)
    setFiles(newFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
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
              <h1 className="text-xl font-semibold text-gray-900">Merge PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Merge PDF files</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>
        </div>

        {!isComplete ? (
          <>
            {/* File Upload */}
            <div className="mb-8">
              <FileUpload
                multiple={true}
                onFilesSelected={handleFilesSelected}
                title="Select PDF files to merge"
                description="or drop PDF files here"
              />
            </div>

            {/* File List with Reordering */}
            {files.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Files to merge ({files.length})</span>
                    <span className="text-sm font-normal text-gray-500">
                      Drag to reorder
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => index > 0 && moveFile(index, index - 1)}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <FileText className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                          #{index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Merge Button */}
            {files.length >= 2 && (
              <div className="text-center">
                <Button
                  onClick={handleMerge}
                  disabled={isProcessing}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Merge {files.length} PDFs
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Your files will be merged in the order shown above
                </p>
              </div>
            )}

            {files.length === 1 && (
              <div className="text-center">
                <p className="text-gray-500">Add at least one more PDF file to merge</p>
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
                Your PDF has been merged!
              </h2>
              <p className="text-gray-600 mb-6">
                {files.length} files have been successfully combined into one PDF.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <Download className="mr-2 h-5 w-5" />
                  Download merged PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setFiles([])
                    setIsComplete(false)
                  }}
                >
                  Merge more PDFs
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
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy to use</h3>
              <p className="text-sm text-gray-600">
                Simply drag and drop your PDF files and click merge
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowUpDown className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom order</h3>
              <p className="text-sm text-gray-600">
                Arrange your files in any order before merging
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
                Merge multiple PDFs in seconds with high quality
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}