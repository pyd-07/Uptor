import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
    return (
        <div className="text-white space-y-6">
            <div className="w-full">
                <LoadingGrid />
            </div>
            <div className="glass-card rounded-2xl">
                <SkeletonTable />
            </div>
        </div>
    )
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    )
}

function SkeletonCard(){
    return (
        <Card className="bg-accent/20 glass-card">
            <CardContent>
                <Skeleton className="aspect-video w-full" />
            </CardContent>
        </Card>
    )
}

function SkeletonTable(){
    return (
        <div className="flex w-full flex-col gap-2 p-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="flex gap-4 w-full py-3" key={index}>
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-1/8" />
                    <Skeleton className="h-10 w-1/8" />
                    <Skeleton className="h-10 w-1/8" />
                    <Skeleton className="h-10 w-2/8" />
                    <Skeleton className="h-10 w-1/8" />
                </div>
            ))}
        </div>
    ) 
}