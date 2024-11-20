import React from "react";

export default function MockDataIndicator() {
    const isMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    
    if (!isMockData) {
        return (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span> LIVE</span>
            </div>
        );
    }
    
    return (
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-x-1">
            <span>🔧 Using mock data for development</span>
            <span className="text-xs opacity-75">(API calls disabled)</span>
        </div>
    );
}