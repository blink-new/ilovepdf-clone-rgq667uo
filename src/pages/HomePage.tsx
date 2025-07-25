import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { 
  FileText, 
  Scissors, 
  Archive, 
  FileImage, 
  FileSpreadsheet, 
  Presentation,
  Edit3,
  Shield,
  RotateCw,
  Unlock,
  Image,
  Download,
  Menu,
  X
} from 'lucide-react'

const pdfTools = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: FileText,
    color: 'bg-red-500',
    popular: true,
    path: '/merge'
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: Scissors,
    color: 'bg-blue-500',
    path: '/split'
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: Archive,
    color: 'bg-green-500',
    path: '/compress'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
    icon: FileText,
    color: 'bg-blue-600',
    path: '/pdf-to-word'
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    icon: FileSpreadsheet,
    color: 'bg-green-600',
    path: '/pdf-to-excel'
  },
  {
    id: 'pdf-to-powerpoint',
    title: 'PDF to PowerPoint',
    description: 'Turn your PDF files into PowerPoint presentations - free and easy to use.',
    icon: Presentation,
    color: 'bg-orange-500',
    path: '/pdf-to-powerpoint'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    icon: FileText,
    color: 'bg-blue-700',
    path: '/word-to-pdf'
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF',
    description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    icon: FileSpreadsheet,
    color: 'bg-green-700',
    path: '/excel-to-pdf'
  },
  {
    id: 'powerpoint-to-pdf',
    title: 'PowerPoint to PDF',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    icon: Presentation,
    color: 'bg-orange-600',
    path: '/powerpoint-to-pdf'
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: Image,
    color: 'bg-purple-500',
    path: '/pdf-to-jpg'
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPG, PNG, BMP, GIF and TIFF images to PDF in seconds.',
    icon: FileImage,
    color: 'bg-purple-600',
    path: '/jpg-to-pdf'
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    description: 'Add text, images, shapes or freehand annotations to a PDF document.',
    icon: Edit3,
    color: 'bg-indigo-500',
    path: '/edit-pdf'
  },
  {
    id: 'watermark',
    title: 'Watermark PDF',
    description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    icon: FileText,
    color: 'bg-cyan-500',
    path: '/watermark'
  },
  {
    id: 'rotate',
    title: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    icon: RotateCw,
    color: 'bg-yellow-500',
    path: '/rotate'
  },
  {
    id: 'unlock',
    title: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    icon: Unlock,
    color: 'bg-red-600',
    path: '/unlock'
  },
  {
    id: 'protect',
    title: 'Protect PDF',
    description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
    icon: Shield,
    color: 'bg-gray-600',
    path: '/protect'
  }
]

interface HomePageProps {
  user: any
}

export function HomePage({ user }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-primary">iLovePDF</Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">All PDF tools</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Desktop</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Mobile</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Developers</a>
              <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors">Pricing</Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-gray-700 hover:text-primary">
                      Dashboard
                    </Button>
                  </Link>
                  <span className="text-gray-600">Welcome, {user.email}</span>
                  <Link to="/pricing">
                    <Button variant="ghost" className="text-primary hover:text-primary/80">
                      Upgrade
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost"
                    onClick={() => blink.auth.logout()}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-700 hover:text-primary">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">All PDF tools</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Desktop</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Mobile</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-primary">Developers</a>
              <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:text-primary">Pricing</Link>
              <div className="border-t border-gray-200 pt-4 pb-3">
                {user ? (
                  <div className="px-3 space-y-3">
                    <p className="text-sm text-gray-600">Welcome, {user.email}</p>
                    <div className="flex space-x-3">
                      <Link to="/dashboard" className="flex-1">
                        <Button variant="ghost" className="w-full">Dashboard</Button>
                      </Link>
                      <Link to="/pricing" className="flex-1">
                        <Button variant="ghost" className="w-full">Upgrade</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="flex-1"
                        onClick={() => blink.auth.logout()}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center px-3 space-x-3">
                    <Link to="/login" className="flex-1">
                      <Button variant="ghost" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! 
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
              <Download className="mr-2 h-5 w-5" />
              Choose PDF file
            </Button>
            <p className="text-sm text-gray-500">or drop PDF here</p>
          </div>
        </div>
      </section>

      {/* PDF Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All the tools you'll need
            </h2>
            <p className="text-lg text-gray-600">
              Work with PDF files online. 100% free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pdfTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Link key={tool.id} to={tool.path}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 relative h-full">
                    {tool.popular && (
                      <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                        Popular
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Trusted by millions of users
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100M+</div>
                <div className="text-gray-600">Files processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-gray-600">SSL encryption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">GDPR</div>
                <div className="text-gray-600">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">iLovePDF</h3>
              <p className="text-gray-400 text-sm">
                The best PDF tools online. Work with PDF files easily and for free.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Desktop</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WordPress Plugin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 iLovePDF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}