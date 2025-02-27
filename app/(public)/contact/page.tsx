'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin } from 'lucide-react'
import { getBrandConfig } from '@/app/lib/brand/config'
import { useEffect } from 'react'

export default function ContactPage() {
  const [config, setConfig] = useState<any>(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    async function loadConfig() {
      const brandConfig = await getBrandConfig()
      setConfig(brandConfig)
    }
    loadConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your server
    console.log('Form submitted:', formData)
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    })

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  if (!config) return null

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C363F] mb-4">Contact Us</h1>
          <p className="text-lg text-[#2C363F]/60">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Phone className="h-6 w-6 text-[#FF6B6B]" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-[#2C363F]/60">{config.brand.phone.primary}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Mail className="h-6 w-6 text-[#FF6B6B]" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-[#2C363F]/60">contact@amandasrentals.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <MapPin className="h-6 w-6 text-[#FF6B6B]" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-[#2C363F]/60">
                    Oklahoma City, OK
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="font-semibold mb-2">Business Hours</p>
                <div className="space-y-1 text-[#2C363F]/60">
                  <p>Monday - Friday: 9am - 6pm</p>
                  <p>Saturday: 10am - 4pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="How can we help you?"
                    className="min-h-[150px]"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
