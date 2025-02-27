import { getBrandConfig } from '@/app/lib/brand/service'
import fs from 'fs'
import path from 'path'

// Mock the fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}))

describe('getBrandConfig', () => {
  const mockYamlContent = `
brand:
  name: "Amanda's Party & Event Rentals"
  slogan: "Making Your Events Memorable"
  phone:
    primary: "405-314-5387"
colors:
  primary: "#235082"
  secondary: "#FF6B6B"
  accent: "#4ECDC4"
  text: "#2C363F"
  background: "#FFFFFF"
  muted: "#F3F4F6"
`

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    // Mock successful file read
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(mockYamlContent)
  })

  it('should load brand configuration successfully', async () => {
    const config = await getBrandConfig()
    
    expect(config.brand.name).toBe("Amanda's Party & Event Rentals")
    expect(config.brand.slogan).toBe("Making Your Events Memorable")
    expect(config.colors.primary).toBe("#235082")
    expect(config.colors.secondary).toBe("#FF6B6B")
  })

  it('should return default configuration when file read fails', async () => {
    // Mock file read failure
    ;(fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('File not found'))
    
    const config = await getBrandConfig()
    
    // Check default values
    expect(config.brand.name).toBe("Amanda's Party & Event Rentals")
    expect(config.colors.primary).toBe("#235082")
  })

  it('should handle missing color values', async () => {
    const incompleteYaml = `
brand:
  name: "Amanda's Party & Event Rentals"
colors:
  primary: "#235082"
`
    ;(fs.promises.readFile as jest.Mock).mockResolvedValue(incompleteYaml)
    
    const config = await getBrandConfig()
    
    // Should use default colors for missing values
    expect(config.colors.secondary).toBe("#FF6B6B")
    expect(config.colors.accent).toBe("#4ECDC4")
  })
}) 