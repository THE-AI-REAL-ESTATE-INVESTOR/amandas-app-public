'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AgeVerificationDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AgeVerificationDialog({ open, onConfirm, onCancel }: AgeVerificationDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-[#235082] text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Age Verification Required</DialogTitle>
          <DialogDescription className="text-white/90">
            You must be 21 or older to book an adult party.
            By proceeding, you confirm that you are of legal drinking age.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            I am 21 or older
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 