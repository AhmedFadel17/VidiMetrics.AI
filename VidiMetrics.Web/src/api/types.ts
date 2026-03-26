// ── Common wrapper shapes ──────────────────────────────────────────────────

export interface SuccessResponse<T> {
  data: T
  message: string
  statusCode: number
}

export interface ApiResponse {
  message: string
  statusCode: number
}

// ── Channel ───────────────────────────────────────────────────────────────

export interface Channel {
  id: string
  name: string
  description: string
  youTubeChannelId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateChannelDto {
  name: string
  description: string
  youTubeChannelId?: string
}

export interface UpdateChannelDto {
  name?: string
  description?: string
  youTubeChannelId?: string
}

// ── Video ─────────────────────────────────────────────────────────────────

export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string | null
  duration: number | null
  channelId: string
  createdAt: string
  updatedAt: string
}

export interface CreateVideoDto {
  title: string
  description: string
  channelId: string
  thumbnailUrl?: string
  duration?: number
}

export interface UpdateVideoDto {
  title?: string
  description?: string
  thumbnailUrl?: string
  duration?: number
}

// ── Playlist ──────────────────────────────────────────────────────────────

export interface Playlist {
  id: string
  title: string
  description: string
  channelId: string
  createdAt: string
  updatedAt: string
}
