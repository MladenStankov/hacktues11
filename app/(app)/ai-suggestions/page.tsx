import { Suspense} from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import SuggestionsBoard from '@/components/ai-suggestions/suggestions-board'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

export default async function Page() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Medical AI Opinion Dashboard</h1>
        <Suspense fallback={<DashboardSkeleton />}>
          <SuggestionsBoard userId={session?.user.id ?? ""}/>
        </Suspense>
      </div>
    </main>
  )
}

function DashboardSkeleton() {
    return (
      <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
        <div className="w-full md:w-1/3 lg:w-1/4 h-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 h-full">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }
