'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check } from 'lucide-react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, useDisclosure } from "@nextui-org/react"
import { toast } from 'react-toastify'

export default function EarlyAccess() {
  const [email, setEmail] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const handleSubmit = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('/api/interestedUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email
        })
      })
      
      if (response.ok) {
        toast.success('Thank you for your interest! We\'ll get back to you soon.')
        setEmail('')
        onClose()
      } else {
        throw new Error('Failed to submit request')
      }
    } catch (error) {
      toast.error('Failed to submit request. Please try again.')
    }
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center relative z-10"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <h2 className="text-3xl font-bold sm:text-4xl text-zinc-100 relative">
          Get Early Access
          <span className="absolute -top-2 -right-10 text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
            Beta
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 text-lg">
          Be among the first to experience our cutting-edge market research platform.
          Exclusive early access with premium features.
        </p>
        <Button
          color="primary"
          size="lg"
          className="mt-8 group"
          onPress={onOpen}
          endContent={<Mail className="ml-2 group-hover:translate-x-1 transition-transform" />}
        >
          Request Early Access
        </Button>
      </motion.div>

      {/* Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
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
                  type="email"
                  startContent={<Mail className="text-zinc-500 w-5 h-5" />}
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  color="primary"
                  classNames={{
                    label: "text-zinc-400",
                    input: "text-zinc-100",
                    inputWrapper: "border-zinc-700 bg-zinc-800 hover:border-blue-500"
                  }}
                />
                <div className="mt-2 space-y-2">
                  <p className="text-zinc-400 text-sm flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Exclusive early access to our platform
                  </p>
                  <p className="text-zinc-400 text-sm flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Priority feature updates
                  </p>
                  <p className="text-zinc-400 text-sm flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    No commitment, unsubscribe anytime
                  </p>
                </div>
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
                  onPress={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Request Access
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  )
}