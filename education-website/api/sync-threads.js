// Vercel Serverless Function to sync Threads data to Firestore
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let adminApp;
try {
    adminApp = initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
} catch (error) {
    // App already initialized
    adminApp = initializeApp();
}

const db = getFirestore(adminApp);

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    try {
        console.log('Starting Threads sync...');

        // Fetch RSS feed with timeout
        const RSS_URL = 'https://rsshub.app/threads/@daechi_spectre';
        const PROXIES = [
            (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
            (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        ];

        let xmlText = null;
        let lastError = null;

        // Try each proxy
        for (const proxy of PROXIES) {
            const proxyUrl = proxy(RSS_URL);
            console.log(`Trying proxy: ${proxyUrl}`);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout

                const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                xmlText = await response.text();
                console.log('Successfully fetched RSS feed');
                break;
            } catch (error) {
                console.warn(`Proxy failed:`, error.message);
                lastError = error;
            }
        }

        if (!xmlText) {
            throw lastError || new Error('All proxies failed');
        }

        // Parse XML
        const { DOMParser } = await import('@xmldom/xmldom');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');

        if (items.length === 0) {
            throw new Error('No items found in RSS feed');
        }

        console.log(`Found ${items.length} items`);

        // Parse all posts
        const allPosts = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const title = item.getElementsByTagName('title')[0]?.textContent || '';
            const description = item.getElementsByTagName('description')[0]?.textContent || '';
            const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';
            const pubDateText = item.getElementsByTagName('pubDate')[0]?.textContent || '';
            const link = item.getElementsByTagName('link')[0]?.textContent || '';

            let rawContent = contentEncoded || description;

            // HTML decode
            rawContent = rawContent
                .replace(/<[^>]*>/gm, '')
                .replace(/&nbsp;/gi, ' ')
                .replace(/&amp;/gi, '&')
                .replace(/&lt;/gi, '<')
                .replace(/&gt;/gi, '>')
                .replace(/&quot;/gi, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/\s+/g, ' ')
                .trim();

            allPosts.push({
                title,
                content: rawContent,
                pubDate: pubDateText,
                date: new Date(pubDateText),
                link,
            });
        }

        // Sort by date (newest first)
        allPosts.sort((a, b) => b.date - a.date);

        const latestPost = allPosts[0];

        // Calculate relative time
        const now = new Date();
        const diffTime = now - latestPost.date;
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let timeString;
        if (diffMinutes < 60) {
            timeString = diffMinutes <= 1 ? '방금 전' : `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            timeString = `${diffHours}시간 전`;
        } else if (diffDays < 7) {
            timeString = `${diffDays}일 전`;
        } else {
            timeString = latestPost.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }

        const threadData = {
            author: '신원장',
            handle: 'daechi_spectre',
            avatar: 'https://ui-avatars.com/api/?name=Shin&background=000&color=fff',
            content: latestPost.content,
            timestamp: timeString,
            pubDate: latestPost.pubDate,
            link: latestPost.link,
            updatedAt: now.toISOString(),
            likes: null,
            replies: null,
        };

        // Save to Firestore
        const docRef = db.collection('threads').doc('latest');
        await docRef.set(threadData);

        console.log('Successfully saved to Firestore');
        console.log('Content length:', latestPost.content.length);

        return res.status(200).json({
            success: true,
            message: 'Threads data synced successfully',
            data: threadData,
        });

    } catch (error) {
        console.error('Error syncing threads:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
