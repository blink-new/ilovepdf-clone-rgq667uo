import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { blink } from '../blink/client'
import { FileText, Shield, Zap } from 'lucide-react'

export default function Login() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    blink.auth.login('/') // Redirect to homepage after login
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    window.location.href = '/'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">iLovePDF</span>
            </Link>
            <Link to="/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to access your PDF tools and saved files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handleLogin} className="w-full">
                Sign In with Blink
              </Button>

              <div className="text-center">
                <Link to="/register" className="text-sm text-primary hover:underline">
                  Don't have an account? Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure file processing with end-to-end encryption</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Lightning-fast PDF processing and conversion</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <FileText className="h-5 w-5 text-purple-500" />
              <span>Access to all premium PDF tools and features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}