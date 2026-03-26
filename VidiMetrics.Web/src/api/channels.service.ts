import apiClient from './client'
import type { Channel, CreateChannelDto, UpdateChannelDto, SuccessResponse } from './types'

export const getChannels = async (): Promise<Channel[]> => {
  const response = await apiClient.get<SuccessResponse<Channel[]>>('/api/channels')
  return response.data.data
}

export const getChannelById = async (id: string): Promise<Channel> => {
  const response = await apiClient.get<SuccessResponse<Channel>>(`/api/channels/${id}`)
  return response.data.data
}

export const createChannel = async (dto: CreateChannelDto): Promise<Channel> => {
  const response = await apiClient.post<SuccessResponse<Channel>>('/api/channels', dto)
  return response.data.data
}

export const updateChannel = async (id: string, dto: UpdateChannelDto): Promise<Channel> => {
  const response = await apiClient.put<SuccessResponse<Channel>>(`/api/channels/${id}`, dto)
  return response.data.data
}

export const deleteChannel = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/channels/${id}`)
}
