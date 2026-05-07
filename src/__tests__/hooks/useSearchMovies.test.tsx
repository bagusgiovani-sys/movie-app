import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useSearchMovies } from '../../hooks/useSearchMovies'
import { searchMovies } from '../../services'
import type { Movie } from '../../types/movie.types'

vi.mock('../../services', () => ({
  searchMovies: vi.fn(),
}))

const mockMovie: Movie = {
  id: 2001, title: 'Mocked Search Result', poster_path: null, backdrop_path: null,
  overview: 'Overview', release_date: '2024-01-01', vote_average: 7.0,
  vote_count: 100, genre_ids: [], popularity: 50, original_language: 'en',
  original_title: 'Mocked Search Result', adult: false,
}

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useSearchMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(searchMovies).mockResolvedValue([mockMovie])
  })

  it('does not call searchMovies when query is empty', async () => {
    renderHook(() => useSearchMovies(''), { wrapper: makeWrapper() })
    await new Promise((r) => setTimeout(r, 50))
    expect(searchMovies).not.toHaveBeenCalled()
  })

  it('calls searchMovies with the query when query is non-empty', async () => {
    const { result } = renderHook(() => useSearchMovies('inception'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(searchMovies).toHaveBeenCalledWith('inception')
  })

  it('returns data from the service', async () => {
    const { result } = renderHook(() => useSearchMovies('inception'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data![0].id).toBe(2001)
  })
})
