import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                <p className="text-green-300 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    )
}