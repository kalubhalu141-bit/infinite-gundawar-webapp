// Shared in-memory job store for video generation
export const jobStore = new Map<string, {
  status: string
  progress: number
  video_url?: string
  error?: string
}>()
