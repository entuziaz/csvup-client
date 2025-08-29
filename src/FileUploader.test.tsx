import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUploader from './FileUploader'
import log from 'loglevel'

// Mock loglevel to suppress console output during tests
vi.mock('loglevel', () => ({
  default: {
    setLevel: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('FileUploader', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    vi.clearAllMocks()
  })

  test('renders upload form', () => {
    render(<FileUploader />)
    
    expect(screen.getByText('Upload CSV')).toBeInTheDocument()
    expect(screen.getByLabelText(/upload csv file/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
  })

  test('shows error message when no file is selected', async () => {
    const user = userEvent.setup()
    render(<FileUploader />)
    
    const uploadButton = screen.getByRole('button', { name: /upload/i })
    await user.click(uploadButton)
    
    expect(screen.getByText('Please select a file first.')).toBeInTheDocument()
  })

  test('handles file selection', async () => {
    const user = userEvent.setup()
    render(<FileUploader />)
    
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByLabelText(/upload csv file/i) as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    expect(fileInput.files?.[0]).toBe(file)
    expect(fileInput.files).toHaveLength(1)
  })

  test('successfully uploads file and shows success message', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      message: 'File processed successfully',
      data: {
        filename: 'test.csv',
        rows: 50
      }
    }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockResponse,
    })
    
    render(<FileUploader />)
    
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByLabelText(/upload csv file/i)
    const uploadButton = screen.getByRole('button', { name: /upload/i })
    
    await user.upload(fileInput, file)
    await user.click(uploadButton)
    
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/uploads/csv/',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    )
    
    await waitFor(() => {
      expect(screen.getByText('Upload: test.csv, Rows: 50')).toBeInTheDocument()
    })
    
    expect(log.info).toHaveBeenCalledWith('Uploading file:', 'test.csv')
    expect(log.debug).toHaveBeenCalledWith('---Response status:', 201)
  })

  test('handles upload failure', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Invalid file format',
    })
    
    render(<FileUploader />)
    
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByLabelText(/upload csv file/i)
    const uploadButton = screen.getByRole('button', { name: /upload/i })
    
    await user.upload(fileInput, file)
    await user.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error uploading file')).toBeInTheDocument()
    })
    
    expect(log.error).toHaveBeenCalled()
  })

  test('handles network errors', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<FileUploader />)
    
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' })
    const fileInput = screen.getByLabelText(/upload csv file/i)
    const uploadButton = screen.getByRole('button', { name: /upload/i })
    
    await user.upload(fileInput, file)
    await user.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error uploading file')).toBeInTheDocument()
    })
    
    expect(log.error).toHaveBeenCalledWith('---Error uploading file:', expect.any(Error))
  })
})