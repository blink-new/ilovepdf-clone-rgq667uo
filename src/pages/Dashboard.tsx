import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowLeft, Download, FileText, Clock, Trash2, Plus, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FileHistoryItem {
  id: string
  filename: string
  tool: string
  status: 'completed' | 'processing' | 'failed'
  createdAt: Date
  fileSize: number
  downloadUrl?: string
}

interface DashboardProps {
  user: any
}

export function Dashboard({ user }: DashboardProps) {
  const [fileHistory, setFileHistory] = useState<FileHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading file history
    const loadFileHistory = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockHistory: FileHistoryItem[] = [
        {
          id: '1',
          filename: 'contract-merged.pdf',
          tool: 'Merge PDF',
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          fileSize: 2456789,
          downloadUrl: '#'
        },
        {
          id: '2',
          filename: 'presentation-compressed.pdf',
          tool: 'Compress PDF',
          status: 'completed',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          fileSize: 1234567,
          downloadUrl: '#'
        },
        {
          id: '3',
          filename: 'document-watermarked.pdf',
          tool: 'Add Watermark',
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          fileSize: 3456789,
          downloadUrl: '#'
        },
        {
          id: '4',
          filename: 'report-split.pdf',
          tool: 'Split PDF',
          status: 'failed',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          fileSize: 5678901
        }
      ]
      
      setFileHistory(mockHistory)
      setIsLoading(false)
    }

    if (user) {
      loadFileHistory()
    }
  }, [user])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const deleteFile = (id: string) => {
    setFileHistory(prev => prev.filter(item => item.id !== id))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your dashboard and file history.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to tools
              </Link>
              <div className="ml-6">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName || user.email}!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your PDF files and view your processing history.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Files Processed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fileHistory.filter(f => f.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Storage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(fileHistory.reduce((acc, f) => acc + f.fileSize, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fileHistory.filter(f => {
                      const thisMonth = new Date()
                      thisMonth.setDate(1)
                      return f.createdAt >= thisMonth
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/merge-pdf">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Merge PDF</span>
                </Button>
              </Link>
              <Link to="/split-pdf">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Split PDF</span>
                </Button>
              </Link>
              <Link to="/compress-pdf">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Compress PDF</span>
                </Button>
              </Link>
              <Link to="/watermark-pdf">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Add Watermark</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* File History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                      <div className="w-10 h-10 bg-gray-300 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : fileHistory.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-600 mb-6">
                  Start processing your first PDF file to see it here.
                </p>
                <Link to="/">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Process your first file
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {fileHistory.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">{file.filename}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{file.tool}</span>
                          <span>•</span>
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(file.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(file.status)}
                      {file.status === 'completed' && file.downloadUrl && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}