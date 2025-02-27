import { render, screen, fireEvent } from '@testing-library/react'
import { AgeVerificationDialog } from '@/components/booking/AgeVerificationDialog'
import { ThemeProvider } from '@/app/lib/brand/ThemeProvider'

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('AgeVerificationDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockOnConfirm.mockClear()
    mockOnCancel.mockClear()
  })

  it('renders dialog when open', () => {
    renderWithProviders(
      <AgeVerificationDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Age Verification Required')).toBeInTheDocument()
    expect(
      screen.getByText(/You must be 21 or older to book an adult party/)
    ).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    renderWithProviders(
      <AgeVerificationDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText('I am 21 or older'))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', () => {
    renderWithProviders(
      <AgeVerificationDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('does not render when not open', () => {
    renderWithProviders(
      <AgeVerificationDialog
        open={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByText('Age Verification Required')).not.toBeInTheDocument()
  })
}) 