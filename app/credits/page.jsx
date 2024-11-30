'use client'
import React, { useEffect, useState } from 'react'
import NavBar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { ScrollArea } from "@/components/ui/scroll-area"
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { Coins, Check, Mail, Ticket } from 'lucide-react'
import { BackgroundBeams } from "@/components/ui/background"
import { useClerk } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, useDisclosure } from "@nextui-org/react"

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
  const [couponCode, setCouponCode] = useState('')
  const [earlyAccessEmail, setEarlyAccessEmail] = useState('')
  const { isOpen: isEarlyAccessOpen, onOpen: onEarlyAccessOpen, onClose: onEarlyAccessClose } = useDisclosure()
  const { isOpen: isCouponOpen, onOpen: onCouponOpen, onClose: onCouponClose } = useDisclosure()

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

    onEarlyAccessOpen()
  }

  const handleCouponSubmit = async () => {
    if (!session) {
      toast.error('Please sign in to redeem coupon')
      return
    }

    if (couponCode.toLowerCase() === 'trych50') {
      try {
        const response = await fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            type: 'credit',
            description: 'Coupon redemption: TRYCH50',
            value: 50
          })
        })

        if (response.ok) {
          toast.success('Successfully redeemed 50 credits!')
          setCouponCode('')
          fetchCreditHistory()
          onCouponClose()
        }
      } catch (error) {
        toast.error('Failed to redeem coupon')
      }
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handleEarlyAccessRequest = async () => {
    try {
      const response = await fetch('/api/interestedUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: earlyAccessEmail
        })
      })

      if (response.ok) {
        toast.success('Thank you for your interest! We\'ll get back to you soon.')
        setEarlyAccessEmail('')
        onEarlyAccessClose()
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      toast.error('Failed to submit request. Please try again.')
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
            <div className="mt-4 flex justify-center gap-4">
              <Button
                color="primary"
                variant="flat"
                onPress={onCouponOpen}
                className="font-semibold"
              >
                Redeem Coupon
              </Button>
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

                <Button
                  onPress={() => handlePurchase(pkg)}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                  }`}
                >
                  Purchase Credits
                </Button>
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

      {/* Early Access Modal */}
      <Modal 
        isOpen={isEarlyAccessOpen} 
        onClose={onEarlyAccessClose}
        backdrop="blur"
        radius="lg"
        classNames={{
          base: "bg-zinc-900 border border-zinc-700 shadow-2xl",
          header: "border-b border-zinc-700 pb-3",
          body: "py-6",
          footer: "border-t border-zinc-700 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3 text-zinc-100">
                <Mail className="w-6 h-6 text-blue-500" />
                <span>Request Early Access</span>
              </ModalHeader>
              <ModalBody>
                <Input
                  startContent={<Mail className="text-zinc-500 w-5 h-5" />}
                  label="Email Address"
                  placeholder="you@example.com"
                  value={earlyAccessEmail}
                  onChange={(e) => setEarlyAccessEmail(e.target.value)}
                  variant="bordered"
                  color="primary"
                  classNames={{
                    label: "text-zinc-400",
                    input: "text-zinc-100",
                    inputWrapper: "border-zinc-700 bg-zinc-800 hover:border-blue-500"
                  }}
                />
                <p className="text-zinc-400 text-sm mt-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Join our early access program to be among the first to experience our platform.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={onClose}
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleEarlyAccessRequest}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Request Access
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Coupon Modal */}
      <Modal 
        isOpen={isCouponOpen} 
        onClose={onCouponClose}
        backdrop="blur"
        radius="lg"
        classNames={{
          base: "bg-zinc-900 border border-zinc-700 shadow-2xl",
          header: "border-b border-zinc-700 pb-3",
          body: "py-6",
          footer: "border-t border-zinc-700 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3 text-zinc-100">
                <Ticket className="w-6 h-6 text-green-500" />
                <span>Redeem Coupon</span>
              </ModalHeader>
              <ModalBody>
                <Input
                  startContent={<Ticket className="text-zinc-500 w-5 h-5" />}
                  label="Coupon Code"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  variant="bordered"
                  color="primary"
                  classNames={{
                    label: "text-zinc-400",
                    input: "text-zinc-100",
                    inputWrapper: "border-zinc-700 bg-zinc-800 hover:border-green-500"
                  }}
                />
                <p className="text-zinc-400 text-sm mt-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Enter your unique coupon code to receive additional credits.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={onClose}
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCouponSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Apply Coupon
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  )
}