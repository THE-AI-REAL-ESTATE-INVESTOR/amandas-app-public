'use client'

import { ContactSection } from '../ContactSection'

export function ContactWrapper({ phoneNumber }: { phoneNumber: string }) {
  return <ContactSection phoneNumber={phoneNumber} />
}
