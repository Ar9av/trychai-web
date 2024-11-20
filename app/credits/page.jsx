'use client'
import React, { useEffect, useState } from 'react'
import NavBar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Coins, Check } from 'lucide-react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { BackgroundBeams } from "@/components/ui/background"
import { useClerk } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

const creditPackages = [
  {
    name: 'Starter',
    credits: 1,
    price: 5,
    description: 'Perfect for trying out our service',
    features: [
      'Generate 1 detailed report',
      'Full market analysis',
      'Export to PDF'
    ]
  },
  {
    name: 'Popular',
    credits: 15,
    price: 50,
    description: 'Best value for regular users',
    popular: true,
    features: [
      'Generate 15 detailed reports',
      'Full market analysis',
      'Export to PDF',
      'Priority support'
    ]
  },
  {
    name: 'Professional',
    credits: 50,
    price: 150,
    description: 'For professional researchers',
    features: [
      'Generate 50 detailed reports',
      'Full market analysis',
      'Export to PDF',
      'Priority support',
      'API access'
    ]
  }
]

export default function CreditsPage() {
  const { session } = useClerk()
  const [creditHistory, setCreditHistory] = useState([])
  const [totalCredits, setTotalCredits] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (session) {
      fetchCreditHistory()
    }
  }, [session])

  const fetchCreditHistory = async () => {
    try {
      const userId = session.user.id
      const response = await fetch(`/api/credits?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setCreditHistory(data.history)
        setTotalCredits(data.totalCredits)
      }
    } catch (error) {
      console.error('Error fetching credit history:', error)
    }
  }

  const handlePurchase = async (pkg) => {
    if (!session) {
      toast.error('Please sign in to purchase credits')
      return
    }

    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          type: 'credit',
          description: `Credit package: ${pkg.name}`,
          value: pkg.credits
        })
      })

      if (response.ok) {
        toast.success(`Successfully purchased ${pkg.credits} credits`)
        fetchCreditHistory()
      } else {
        toast.error('Failed to purchase credits')
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
      toast.error('Failed to process purchase')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {!isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-16 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${
            isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'
          }`}
        >
          {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
        </button>
      )}

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 py-6 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 sm:mb-4">Purchase Credits</h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto px-4">
              Credits are used to generate market research reports. One credit equals one report generation.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-zinc-800 px-3 sm:px-4 py-2 rounded-full">
              <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-300" />
              <span className="text-sm sm:text-base text-zinc-100 font-semibold">{totalCredits} credits available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
            {creditPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative p-4 sm:p-6 rounded-lg border ${
                  pkg.popular
                    ? 'border-blue-500 bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-2">{pkg.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400" />
                    <span className="text-xl sm:text-2xl font-bold text-zinc-100">{pkg.credits}</span>
                    <span className="text-sm sm:text-base text-zinc-400">credits</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-100">${pkg.price}</div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2">{pkg.description}</p>
                </div>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
                      <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-2 rounded-md transition-colors text-sm sm:text-base ${
                    pkg.popular
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                  }`}
                >
                  Purchase Credits
                </button>
              </div>
            ))}
          </div>

          {creditHistory.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4">Credit History</h2>
              <div className="overflow-x-auto bg-zinc-800 rounded-lg">
                <div className="min-w-full">
                  <table className="min-w-full divide-y divide-zinc-700">
                    <thead>
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Description</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700">
                      {creditHistory.map((history) => (
                        <tr key={history.id}>
                          <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-zinc-300">{formatDate(history.created_at)}</td>
                          <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-zinc-300">{history.description}</td>
                          <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-zinc-300">{history.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </ScrollArea>
      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  )
}