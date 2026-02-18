import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(value: string) {
  if (!value || value == "-") {
    return "Not Yet Checked..."
  }
  const parsedDate = new Date(value)
  return parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatResponseTimeColor(responseTime: number | null, isActive: boolean) {
  if (!isActive || responseTime === null) {
    return "text-slate-400"
  }

  const tone = responseTime > 2000
      ? 'text-red-300'
      : responseTime > 1000
          ? 'text-orange-300'
          : 'text-green-300'

  return tone
}

export function formatResponseStatusCode(responseCode : number){
  if (responseCode < 200){
    return "text-gray-500"
  }
  if (responseCode >= 200 && responseCode < 400) {
    return "text-green-500"
  }
  if (responseCode >= 400 ) {
    return "text-red-500"
  }
}