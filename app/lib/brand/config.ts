// Client-side config
export type BrandConfig = {
  brand: {
    name: string;
    slogan: string;
    phone: {
      primary: string;
      secondary: string;
    };
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    hours: {
      weekday: string;
      saturday: string;
      sunday: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    muted: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
};

export let brandConfig: BrandConfig = {
  brand: {
    name: "Amanda's Party & Event Rentals",
    slogan: "Making Your Events Memorable",
    phone: { 
      primary: "405-314-5387",
      secondary: ""
    },
    email: "info@amandasrentals.com",
    address: {
      street: "212 N Trade Center Terrace",
      city: "Mustang",
      state: "ok",
      zip: "73064"
    },
    hours: {
      weekday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  },
  colors: {
    primary: '#235082',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    text: '#2C363F',
    background: '#FFFFFF',
    muted: '#F3F4F6'
  },
  social: {
    facebook: "amandasrentals",
    instagram: "amandasrentals",
    twitter: "amandasrentals"
  }
};

export function getBrandConfig() {
  return brandConfig;
}

export function updateConfig(newConfig: BrandConfig) {
  Object.assign(brandConfig, newConfig);
}
