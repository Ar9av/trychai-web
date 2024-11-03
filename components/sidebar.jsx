'use client'
import React, { useEffect, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { Button, IconButton, Drawer, List, ListItem, ListItemText, Divider, Box, Typography } from '@mui/material';
import { BiChat } from "react-icons/bi";
import { Refresh as RefreshIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/clerk-react';
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from '../theme'; 

const Sidebar = ({ isOpen, onClose }) => {
    const [previousReports, setPreviousReports] = useState([]);
    const router = useRouter();
    const { session } = useClerk();
    const pathname = usePathname();

    const fetchHashes = async () => {
        if (session) {
            const user_email = session.user.emailAddresses[0].emailAddress;
            try {
                const response = await fetch(`/api/getUserHashes?email=${encodeURIComponent(user_email)}`);
                const data = await response.json();
                setPreviousReports(data);
                localStorage.setItem('previousReports', JSON.stringify(data));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
    };

    useEffect(() => {
        const cachedData = localStorage.getItem('previousReports');
        if (cachedData) {
            setPreviousReports(JSON.parse(cachedData));
        } else {
            fetchHashes();
        }
    }, [session]);

    const handleHistoryClick = (text) => {
        localStorage.setItem('searchParams', text);
        if (pathname === '/search') {
            window.location.reload();
        } else {
            router.push('/search');
        }
    };

    const handleRefreshClick = () => {
        localStorage.removeItem('previousReports');
        fetchHashes();
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const timeDiff = now - new Date(timestamp);

        const minutes = Math.floor(timeDiff / (1000 * 60));
        if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        }

        const days = Math.floor(hours / 24);
        if (days < 7) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        }

        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
                PaperProps={{ style: { width: 250, backgroundColor: '#000', color: '#fff' } }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <HiOutlineClipboardDocumentList size={30} />
                        <Typography variant="h6">Reports</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                        <IoIosClose size={24} />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, gap: 1 }}>
                    <Link href='/create' passHref>
                        <Button variant="outlined" startIcon={<BiChat size={20} />} fullWidth>
                            New Report
                        </Button>
                    </Link>
                    <IconButton onClick={handleRefreshClick} sx={{ color: '#fff' }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    <List>
                        {previousReports.map((item, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => handleHistoryClick(item.payload)}
                                sx={{ bgcolor: '#27282A', my: 1, borderRadius: 2, '&:hover': { bgcolor: '#323335' } }}
                            >
                                <ListItemText
                                    primary={<Typography variant="body2" noWrap>{item.title}</Typography>}
                                    secondary={<Typography variant="caption" color="textSecondary">{formatTimestamp(item.created_at)}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </ThemeProvider >
    );
};

export default Sidebar;