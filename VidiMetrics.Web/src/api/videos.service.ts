import apiClient from './client'
import type { Video, CreateVideoDto, UpdateVideoDto, SuccessResponse } from './types'

export const getVideos = async (): Promise<Video[]> => {
  const response = await apiClient.get<SuccessResponse<Video[]>>('/api/videos')
  return response.data.data
}

export const getVideoById = async (id: string): Promise<Video> => {
  const response = await apiClient.get<SuccessResponse<Video>>(`/api/videos/${id}`)
  return response.data.data
}

export const createVideo = async (dto: CreateVideoDto): Promise<Video> => {
  const response = await apiClient.post<SuccessResponse<Video>>('/api/videos', dto)
  return response.data.data
}

export const updateVideo = async (id: string, dto: UpdateVideoDto): Promise<Video> => {
  const response = await apiClient.put<SuccessResponse<Video>>(`/api/videos/${id}`, dto)
  return response.data.data
}

export const deleteVideo = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/videos/${id}`)
}
