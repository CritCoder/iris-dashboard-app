'use client'

import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

/**
 * Example component showing how to use the new toast system
 * 
 * Usage in any component:
 * 1. Import: import { useToast } from '@/hooks/use-toast'
 * 2. Use hook: const { success, error, warning, message } = useToast()
 * 3. Call toast functions: success('Message'), error('Error'), etc.
 */
export function ToastExample() {
  const { success, error, warning, message } = useToast()

  const handleSuccess = () => {
    success('Operation completed successfully!')
  }

  const handleError = () => {
    error('Something went wrong!')
  }

  const handleWarning = () => {
    warning('Please check your input!')
  }

  const handleMessage = () => {
    message({
      text: 'Do you want to save changes?',
      action: 'Save',
      onAction: () => {
        console.log('Saved!')
        success('Changes saved!')
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toast Examples</h3>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleSuccess} size="sm">
          Success
        </Button>
        <Button onClick={handleError} variant="destructive" size="sm">
          Error
        </Button>
        <Button onClick={handleWarning} size="sm">
          Warning
        </Button>
        <Button onClick={handleMessage} variant="outline" size="sm">
          Message with Action
        </Button>
      </div>
    </div>
  )
}
