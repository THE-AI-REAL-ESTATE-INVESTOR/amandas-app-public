import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

import { render, screen, fireEvent } from '@testing-library/react'
import { PackageSelection } from '@/components/booking/PackageSelection'
import { ThemeProvider } from '@/app/lib/brand/ThemeProvider'

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('PackageSelection', () => {
  const mockOnPackageSelect = jest.fn()

  beforeEach(() => {
    mockOnPackageSelect.mockClear()
  })

  it('renders all package options with correct prices', () => {
    renderWithProviders(<PackageSelection onPackageSelect={mockOnPackageSelect} />)

    // Check package names and prices
    expect(screen.getByText('Balloon Party')).toBeInTheDocument()
    expect(screen.getByText('Kids Tent Party')).toBeInTheDocument()
    expect(screen.getByText('$150')).toBeInTheDocument()
    expect(screen.getByText('$250')).toBeInTheDocument()
  })

  it('calls onPackageSelect with correct package ID when selected', async () => {
    renderWithProviders(<PackageSelection onPackageSelect={mockOnPackageSelect} />)

    // Click the Balloon Party package
    const balloonPartyCard = screen.getByText('Balloon Party').closest('.cursor-pointer')
    fireEvent.click(balloonPartyCard!)
    
    // Verify continue button appears
    const continueButton = screen.getByText('Continue with Balloon Party')
    expect(continueButton).toBeInTheDocument()
    
    // Click continue button
    fireEvent.click(continueButton)
    
    // Verify callback was called with correct ID
    expect(mockOnPackageSelect).toHaveBeenCalledWith('balloon-party')
  })

  it('shows selected state styling when package is chosen', () => {
    renderWithProviders(<PackageSelection onPackageSelect={mockOnPackageSelect} />)

    // Click the Kids Tent Party package
    const kidsTentCard = screen.getByText('Kids Tent Party').closest('.cursor-pointer')!
    fireEvent.click(kidsTentCard)

    // Verify selected state classes are applied
    expect(kidsTentCard).toHaveClass('border-[#235082]')
    expect(kidsTentCard).toHaveClass('border-2')
  })

  it('displays package descriptions correctly', () => {
    renderWithProviders(<PackageSelection onPackageSelect={mockOnPackageSelect} />)

    expect(screen.getByText('Setting up balloon directions')).toBeInTheDocument()
    expect(screen.getByText('Set up tents for your slumber party / birthday party')).toBeInTheDocument()
  })

  it('does not show continue button before selection', () => {
    renderWithProviders(<PackageSelection onPackageSelect={mockOnPackageSelect} />)

    expect(screen.queryByText(/Continue with/)).not.toBeInTheDocument()
  })
})
