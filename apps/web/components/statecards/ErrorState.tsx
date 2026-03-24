import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function ErrorState({message}:{message:string}) {
  return (
    <div>
        <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
                {message} 
                <br />
                Please reload the page.
            </AlertDescription>
        </Alert>

    </div>  
  )
}
