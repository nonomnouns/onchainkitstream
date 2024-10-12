'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <Card className={`w-full max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
            <p className="mt-1 text-sm text-gray-600">
              You need to Sign
            </p>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            onClick={() => window.location.href = '/'}
          >
            back
          </Button>
        </div>
      </div>
    </Card>
  )
}