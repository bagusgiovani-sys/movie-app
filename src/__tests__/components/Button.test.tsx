import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../../components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders a <button> element', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Locked</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Locked</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('fires onClick when not disabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Active</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders secondary variant without primary background', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
    expect(btn.className).not.toContain('bg-(--color-primary-300)')
  })

  it('renders favorite variant as a button with an svg', () => {
    render(<Button variant="favorite" />)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('svg')).toBeTruthy()
  })
})
