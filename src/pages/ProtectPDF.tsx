import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { FileUpload } from '../components/FileUpload'
import { Link } from 'react-router-dom'
import { PDFProcessor } from '../utils/pdfProcessor'
import { ArrowLeft, Shield, Download, CheckCircle, Loader2, Key, Eye, EyeOff } from 'lucide-react'

interface ProtectPDFProps {
  user: any
}

export default function ProtectPDF({ user }: ProtectPDFProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<Array<{ file: Blob; filename: string }>>([])
  const [error, setError] = useState<string>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setError('')
    setResults([])
  }

  const handleProcess = async () => {
    if (files.length === 0) return
    
    if (!password.trim()) {
      setError('Please enter a password to protect your PDF')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters long')
      return
    }

    setProcessing(true)
    setError('')
    
    try {
      const processedResults = []
      
      for (const file of files) {
        const result = await PDFProcessor.protectPDF(file, password)
        
        if (result.success && result.file) {
          processedResults.push({
            file: result.file,
            filename: result.filename || `protected-${file.name}`
          })
        } else {
          throw new Error(result.error || 'Failed to protect PDF')
        }
      }
      
      setResults(processedResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during protection')
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to tools
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">PDF Protection Complete!</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-600">Protection Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Your PDF files have been protected with password encryption. Download the files below.
              </p>
              
              <div className="space-y-4 mb-6">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-gray-600 mr-3" />
                      <span className="font-medium">{result.filename}</span>
                    </div>
                    <Button
                      onClick={() => downloadFile(result.file, result.filename)}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download All Files
                </Button>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Remember your password! You'll need it to open these protected PDF files.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => {
                setFiles([])
                setResults([])
                setError('')
                setPassword('')
                setConfirmPassword('')
              }}
              variant="outline"
              size="lg"
            >
              Protect Another PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Protect PDF</h1>
          <p className="text-gray-600">Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Password Protection</h3>
              <p className="text-sm text-gray-600">Add strong password encryption to your PDFs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Key className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Access</h3>
              <p className="text-sm text-gray-600">Control who can open and view your documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Privacy Protection</h3>
              <p className="text-sm text-gray-600">Keep sensitive documents safe from unauthorized access</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Upload PDF Files to Protect</CardTitle>
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
                        <Shield className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Password Setup */}
                <div className="mb-6 space-y-4">
                  <h3 className="font-semibold">Set Password Protection</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative max-w-md">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password..."
                      className="max-w-md"
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>At least 4 characters long</li>
                      <li>Use a combination of letters, numbers, and symbols for better security</li>
                      <li>Remember this password - you'll need it to open the protected PDF</li>
                    </ul>
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
                    disabled={processing || !password || !confirmPassword}
                    size="lg"
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Protecting PDFs...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Protect PDFs
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
            <h3 className="font-semibold mb-4">How PDF Protection Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <p>Upload your PDF files that you want to protect</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <p>Set a strong password that will be required to open the PDF</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <p>Your PDFs are encrypted with password protection</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                <p>Download your protected PDFs - they'll require the password to open</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}