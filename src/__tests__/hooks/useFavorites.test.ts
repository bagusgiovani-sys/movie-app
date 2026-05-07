import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { toast } from 'sonner'
import { useFavorites } from '../../hooks/useFavorites'
import type { Movie } from '../../types/movie.types'

// sonner uses browser APIs not available in jsdom — mock it here where we assert on it
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

const mockMovie: Movie = {
  id: 1001,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  backdrop_path: '/backdrop.jpg',
  overview: 'Test overview',
  release_date: '2026-01-01',
  vote_average: 8.0,
  vote_count: 1000,
  genre_ids: [28],
  popularity: 100,
  original_language: 'en',
  original_title: 'Test Movie',
  adult: false,
}

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initialises with empty favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('loads persisted favorites from localStorage on mount', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    expect(result.current.favorites[0].id).toBe(1001)
  })

  it('adds a movie when it is not already in the list', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe(1001)
  })

  it('removes a movie when it is already in the list', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(result.current.favorites).toHaveLength(0)
  })

  it('persists the updated list to localStorage after each toggle', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    const stored = JSON.parse(localStorage.getItem('favorites')!)
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(1001)
  })

  it('isFavorite returns true for a favorited id', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.isFavorite(1001)).toBe(true))
  })

  it('isFavorite returns false for a non-favorited id', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite(999)).toBe(false)
  })

  it('fires toast.success when adding a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(toast.success).toHaveBeenCalledWith('Successfully added to favorites!')
  })

  it('fires toast when removing a favorite', async () => {
    localStorage.setItem('favorites', JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toHaveLength(1))
    act(() => { result.current.toggleFavorite(mockMovie) })
    expect(toast).toHaveBeenCalledWith('Removed from favorites')
  })

  it('handles corrupted localStorage without throwing', () => {
    localStorage.setItem('favorites', 'not-valid-json{{')
    expect(() => renderHook(() => useFavorites())).not.toThrow()
  })
})
