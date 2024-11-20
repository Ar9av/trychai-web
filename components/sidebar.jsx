'use client'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, RotateCcw, LayoutDashboard, FileText, Coins } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/clerk-react'
import { usePathname } from 'next/navigation'

const Sidebar = ({ isOpen, onClose }) => {
    const [previousReports, setPreviousReports] = useState([])
    const [credits, setCredits] = useState(0)
    const router = useRouter()
    const { session } = useClerk()
    const pathname = usePathname()

    const fetchHashes = async () => {
        if (session) {
            const user_email = session.user.emailAddresses[0].emailAddress
            try {
                // Get only private reports for the sidebar
                const response = await fetch(`/api/getUserHashes?email=${encodeURIComponent(user_email)}&private=true`)
                const data = await response.json()
                setPreviousReports(data)
                localStorage.setItem('previousReports', JSON.stringify(data))
            } catch (error) {
                console.error('Failed to fetch data:', error)
            }
        }
    }

    useEffect(() => {
        if (session) {
            fetchCredits()
        }
    }, [session])

    const fetchCredits = async () => {
        try {
            const response = await fetch(`/api/credits?userId=${session.user.id}`)
            const data = await response.json()
            if (response.ok) {
                setCredits(data.totalCredits)
            }
        } catch (error) {
            console.error('Error fetching credits:', error)
        }
    }

    useEffect(() => {
        const cachedData = localStorage.getItem('previousReports')
        if (cachedData) {
            setPreviousReports(JSON.parse(cachedData))
        } else {
            fetchHashes()
        }
    }, [session])

    const handleHistoryClick = (text) => {
        localStorage.setItem('searchParams', text)
        if (pathname === '/search') {
            window.location.reload()
        } else {
            router.push('/search')
        }
    }

    const handleRefreshClick = () => {
        localStorage.removeItem('previousReports')
        fetchHashes()
    }

    const formatTimestamp = (timestamp) => {
        const now = new Date()
        const timeDiff = now - new Date(timestamp)

        const minutes = Math.floor(timeDiff / (1000 * 60))
        if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
        }

        const hours = Math.floor(minutes / 60)
        if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`
        }

        const days = Math.floor(hours / 24)
        if (days < 7) {
            return days === 1 ? '1 day ago' : `${days} days ago`
        }

        return new Date(timestamp).toLocaleDateString()
    }

    const isActive = (path) => pathname === path

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-zinc-800">
                <SheetHeader className="p-4 border-b border-zinc-800">
                    <SheetTitle className="text-xl font-semibold text-zinc-100">TrychAI</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-2 p-4">
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                            isActive('/dashboard') 
                                ? 'bg-zinc-800 text-zinc-100' 
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    
                    <Link 
                        href="/create" 
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                            isActive('/create') 
                                ? 'bg-zinc-800 text-zinc-100' 
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                        }`}
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">New Report</span>
                    </Link>

                    <Link 
                        href="/credits" 
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                            isActive('/credits') 
                                ? 'bg-zinc-800 text-zinc-100' 
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                        }`}
                    >
                        <Coins className="h-4 w-4" />
                        <span className="text-sm font-medium">Buy Credits</span>
                    </Link>
                </div>

                <Separator className="my-2 bg-zinc-800" />
                
                <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="text-sm font-medium text-zinc-400">Private Reports</h3>
                    <button
                        onClick={handleRefreshClick}
                        className="p-1 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                </div>

                <ScrollArea className="h-[calc(100vh-16rem)] px-2">
                    <div className="space-y-1 p-2">
                        {previousReports.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleHistoryClick(item.payload)}
                                className="w-full flex items-center gap-2 text-left rounded-md px-3 py-2 transition-colors text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                            >
                                <FileText className="h-4 w-4 flex-shrink-0" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium truncate">
                                        {item.title}
                                    </div>
                                    <div className="text-xs opacity-60 mt-0.5">
                                        {formatTimestamp(item.created_at)}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-950">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm">{credits} credits remaining</span>
                        </div>
                        <Link 
                            href="/credits"
                            className="p-1 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Sidebar