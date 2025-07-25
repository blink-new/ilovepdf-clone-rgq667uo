import React, { useState, useRef } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, Edit3, Download, CheckCircle, Loader2, Type, MousePointer } from 'lucide-react'

interface EditPDFProps {
  user: any
}

interface Annotation {
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  pageIndex: number
}

export default function EditPDF({ user }: EditPDFProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ file: Blob; filename: string } | null>(null)
  const [error, setError] = useState<string>('')
  const [editMode, setEditMode] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [currentTool, setCurrentTool] = useState<'text' | 'select'>('text')
  const [textInput, setTextInput] = useState('')
  const [fontSize, setFontSize] = useState(12)
  const [textColor, setTextColor] = useState('#000000')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setError('')
    setResult(null)
    setEditMode(false)
    setAnnotations([])
  }

  const renderPDFPreview = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create a mock PDF page for demonstration
    canvas.width = 595
    canvas.height = 842

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add some sample content
    ctx.fillStyle = '#000000'
    ctx.font = '24px Arial'
    ctx.fillText('PDF Document - Page 1', 50, 100)
    
    ctx.font = '16px Arial'
    ctx.fillText('Click anywhere to add text annotations', 50, 140)
    ctx.fillText('Use the tools on the right to customize your text', 50, 170)
    
    // Add a border
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Render existing annotations
    annotations.forEach(annotation => {
      ctx.fillStyle = annotation.color
      ctx.font = `${annotation.fontSize}px Arial`
      ctx.fillText(annotation.text, annotation.x, annotation.y)
    })
  }, [annotations])

  const startEditing = () => {
    if (files.length > 0) {
      setEditMode(true)
      // In a real implementation, you would render the PDF on the canvas here
      setTimeout(() => renderPDFPreview(), 100)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'text' || !textInput.trim()) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newAnnotation: Annotation = {
      text: textInput,
      x,
      y,
      fontSize,
      color: textColor,
      pageIndex: 0
    }

    setAnnotations([...annotations, newAnnotation])
    setTextInput('')
    renderPDFPreview()
  }

  const handleProcess = async () => {
    if (files.length === 0 || annotations.length === 0) return

    setProcessing(true)
    setError('')
    
    try {
      const result = await PDFProcessor.editPDF(files[0], annotations)
      
      if (result.success && result.file) {
        setResult({
          file: result.file,
          filename: result.filename || `edited-${files[0].name}`
        })
      } else {
        throw new Error(result.error || 'Failed to edit PDF')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during editing')
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

  // Re-render canvas when annotations change
  React.useEffect(() => {
    if (editMode) {
      renderPDFPreview()
    }
  }, [annotations, editMode, renderPDFPreview])

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">PDF Editing Complete!</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-indigo-600">Editing Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your PDF has been edited with {annotations.length} annotation{annotations.length > 1 ? 's' : ''}. Download the file below.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 max-w-md mx-auto">
                <div className="flex items-center">
                  <Edit3 className="h-8 w-8 text-indigo-500 mr-3" />
                  <span className="font-medium">{result.filename}</span>
                </div>
                <Button
                  onClick={() => downloadFile(result.file, result.filename)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => {
                setFiles([])
                setResult(null)
                setError('')
                setEditMode(false)
                setAnnotations([])
              }}
              variant="outline"
              size="lg"
            >
              Edit Another PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (editMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit PDF</h1>
            <p className="text-gray-600">Add text annotations to your PDF document</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* PDF Canvas */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>PDF Editor - {files[0]?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="max-w-full h-auto border border-gray-300 bg-white cursor-crosshair"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on the document to add text annotations. Use the tools panel to customize your text.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tools Panel */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tool Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tool</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={currentTool === 'text' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentTool('text')}
                        className="w-full"
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Text
                      </Button>
                      <Button
                        variant={currentTool === 'select' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentTool('select')}
                        className="w-full"
                      >
                        <MousePointer className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  </div>

                  {/* Text Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Text</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text to add..."
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={8}>8px</option>
                      <option value={10}>10px</option>
                      <option value={12}>12px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                      <option value={20}>20px</option>
                      <option value={24}>24px</option>
                      <option value={28}>28px</option>
                      <option value={32}>32px</option>
                    </select>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Annotations List */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Annotations ({annotations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {annotations.length === 0 ? (
                    <p className="text-sm text-gray-500">No annotations added yet</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {annotations.map((annotation, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="font-medium truncate">{annotation.text}</div>
                          <div className="text-gray-500">
                            {annotation.fontSize}px • {annotation.color}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setAnnotations([])
                        renderPDFPreview()
                      }}
                      variant="outline"
                      className="w-full"
                      disabled={annotations.length === 0}
                    >
                      Clear All
                    </Button>
                    
                    <Button
                      onClick={handleProcess}
                      disabled={processing || annotations.length === 0}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Save PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit PDF</h1>
          <p className="text-gray-600">Add text, images, shapes or freehand annotations to a PDF document.</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Type className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Add Text</h3>
              <p className="text-sm text-gray-600">Insert text annotations anywhere on your PDF</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Edit3 className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customize Style</h3>
              <p className="text-sm text-gray-600">Choose font size, color, and positioning</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Save Changes</h3>
              <p className="text-sm text-gray-600">Download your edited PDF with all annotations</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Upload PDF to Edit</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes={['.pdf']}
              maxFiles={1}
              maxSize={50 * 1024 * 1024} // 50MB
            />
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Selected File</h3>
                <div className="p-3 bg-gray-50 rounded-lg mb-6">
                  <div className="flex items-center">
                    <Edit3 className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="font-medium">{files[0].name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={startEditing}
                    size="lg"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    <Edit3 className="mr-2 h-5 w-5" />
                    Start Editing
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">How PDF Editing Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your PDF document that you want to edit</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Use the editing tools to add text annotations, customize fonts and colors</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>Click anywhere on the document to place your text annotations</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Save and download your edited PDF with all annotations preserved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}