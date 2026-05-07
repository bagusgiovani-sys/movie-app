import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useLatestMovies } from '../../hooks/useLatestMovies'
import { getLatestMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

vi.mock('../../services', () => ({
  getLatestMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 1003, title: 'Latest Movie', poster_path: '/l.jpg', backdrop_path: null,
  overview: 'Overview', release_date: '2026-03-01', vote_average: 7.2,
  vote_count: 300, genre_ids: [18], popularity: 150, original_language: 'en',
  original_title: 'Latest Movie', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useLatestMovies', () => {
  beforeEach(() => {
    vi.mocked(getLatestMovies).mockResolvedValue([mockMovie])
  })

  it('calls getLatestMovies on mount', async () => {
    renderHook(() => useLatestMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(getLatestMovies).toHaveBeenCalledOnce())
  })

  it('returns the data from the service', async () => {
    const { result } = renderHook(() => useLatestMovies(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data![0].id).toBe(1003)
  })
})
