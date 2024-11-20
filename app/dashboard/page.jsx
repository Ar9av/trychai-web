'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/clerk-react'
import NavBar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { FileText, PlusCircle, Search, Lock, Globe } from 'lucide-react'
import { BackgroundBeams } from "@/components/ui/background"
import { Tabs, Tab } from '@nextui-org/react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [reports, setReports] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTab, setSelectedTab] = useState('public')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { session } = useClerk()

    useEffect(() => {
        const fetchReports = async () => {
            if (session) {
                setLoading(true)
                try {
                    const email = session.user.emailAddresses[0].emailAddress
                    const isPrivate = selectedTab === 'private'
                    const response = await fetch(`/api/getUserHashes?email=${encodeURIComponent(email)}&private=${isPrivate}`)
                    const data = await response.json()
                    setReports(data)
                } catch (error) {
                    console.error('Failed to fetch reports:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchReports()
    }, [session, selectedTab])

    const filteredReports = reports.filter(report => 
        report.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-black">
            <NavBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {typeof window !== 'undefined' && window.innerWidth > 768 && (
                <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-16 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${
                    isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'
                }`}
                >
                {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
                </button>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl font-semibold text-zinc-100">Your Reports</h1>
                        <button
                            onClick={() => router.push('/create')}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors"
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span>New Report</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <Tabs 
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab}
                        variant="underlined"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-zinc-800",
                            cursor: "w-full bg-blue-500",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-blue-500"
                        }}
                    >
                        <Tab
                            key="public"
                            title={
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span>Public Reports</span>
                                </div>
                            }
                        />
                        <Tab
                            key="private"
                            title={
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    <span>Private Reports</span>
                                </div>
                            }
                        />
                    </Tabs>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-900 text-zinc-100 rounded-md border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 animate-pulse">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-zinc-800 rounded-md">
                                            <FileText className="h-5 w-5 text-zinc-100" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Reports Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredReports.map((report, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            localStorage.setItem('searchParams', report.payload)
                                            router.push('/search')
                                        }}
                                        className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-zinc-800 rounded-md group-hover:bg-zinc-700 transition-colors">
                                                <FileText className="h-5 w-5 text-zinc-100" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-zinc-100 font-medium truncate">{report.title}</h3>
                                                <p className="text-zinc-400 text-sm mt-1">
                                                    {formatDate(report.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredReports.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-zinc-300">No reports found</h3>
                                    <p className="text-zinc-400 mt-1">
                                        {searchQuery ? "Try adjusting your search" : "Create your first report to get started"}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        </div>
    )
}