import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { FileText, Check, Star, Zap, Shield, Cloud, Users } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for occasional PDF tasks',
      features: [
        'Basic PDF tools (merge, split, compress)',
        'Up to 2 files per task',
        'File size limit: 25MB',
        'Standard processing speed',
        'Basic support'
      ],
      limitations: [
        'Watermark on processed files',
        'Limited file formats',
        'No batch processing'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Premium',
      price: '$6.61',
      period: 'per month',
      description: 'Ideal for professionals and frequent users',
      features: [
        'All PDF tools (20+ tools)',
        'Unlimited files per task',
        'File size limit: 100MB',
        'Priority processing speed',
        'No watermarks',
        'Batch processing',
        'OCR text recognition',
        'Advanced compression',
        'Priority support',
        'Desktop app access'
      ],
      buttonText: 'Start Premium Trial',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Business',
      price: '$53.11',
      period: 'per month',
      description: 'For teams and organizations',
      features: [
        'Everything in Premium',
        'Team management (up to 50 users)',
        'File size limit: 500MB',
        'API access',
        'Custom branding',
        'Advanced analytics',
        'SSO integration',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ]

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
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the perfect plan for your needs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From individual users to large teams, we have a plan that scales with your PDF processing requirements
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>100M+ users worldwide</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>4.8/5 rating</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-xs text-gray-400">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why choose iLovePDF Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process files 10x faster with our premium servers and priority queue</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Bank-level encryption with automatic file deletion after processing</p>
            </div>
            <div className="text-center">
              <Cloud className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cloud Storage</h3>
              <p className="text-gray-600">Access your files anywhere with secure cloud storage and sync</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">Yes, Premium comes with a 7-day free trial. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee for all plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}