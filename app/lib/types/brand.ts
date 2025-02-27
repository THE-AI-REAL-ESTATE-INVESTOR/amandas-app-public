export interface BrandConfig {
  brand: {
    name: string
    slogan: string
    phone: {
      primary: string
      secondary: string
    }
    email: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
    hours: {
      weekday: string
      saturday: string
      sunday: string
    }
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
    muted: string
  }
  social: {
    facebook: string
    instagram: string
    twitter: string
  }
}
