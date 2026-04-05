"use client";

import dynamic from 'next/dynamic';

// 1. Remove the .js extension in the path (Next.js resolves this automatically)
// 2. Use a typed loader to satisfy TypeScript
const SafetyMap = dynamic(() => import('../../components/SafetyMap.js').then((mod) => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 flex items-center justify-center rounded-xl">
       <p>Map is loading...</p>
    </div>
  )
});

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">SafeHer AI: Live Safety Map</h1>
      <div className="border rounded-xl overflow-hidden shadow-lg">
        <SafetyMap />
      </div>
      
      <div className="mt-4 flex gap-6 text-sm font-medium">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div> 
          <span>High Danger Zone</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div> 
          <span>Safe Area</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div> 
          <span>Police/Post Office</span>
        </div>
      </div>
    </main>
  );
}