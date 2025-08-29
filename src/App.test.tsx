import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders FileUploader component', () => {
    render(<App />)
    
    expect(screen.getByText('Upload CSV')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
  })

  test('has correct layout styling', () => {
    const { container } = render(<App />)
    
    // The main app container should be the first div
    const appContainer = container.firstChild as HTMLElement
    expect(appContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen', 'bg-gray-50')
  })
})