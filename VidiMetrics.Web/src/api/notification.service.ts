import * as signalR from '@microsoft/signalr';
import type { Notification } from '@/types';

class NotificationService {
    private hubConnection: signalR.HubConnection | null = null;
    private hubUrl = import.meta.env.VITE_API_URL + '/hubs/notifications';
    private isInitializing = false;
    private listeners: Array<(notification: Notification) => void> = [];

    constructor() { }

    public async connect(token: string): Promise<void> {
        if (this.isInitializing) return;
        if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) return;

        this.isInitializing = true;

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.hubConnection.on('ReceiveNotification', (data: Notification) => {
            this.listeners.forEach(callback => callback(data));
        });

        try {
            await this.hubConnection.start();
            console.log('📡 Connected to shared global SignalR socket connection layer.');
        } catch (err) {
            console.error('Error establishing SignalR link:', err);
        } finally {
            this.isInitializing = false;
        }
    }

    public listenForNotifications(callback: (notification: Notification) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    public disconnect(): void {
        if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
            this.hubConnection.stop();
            this.hubConnection = null;
        }
    }
}

export const notificationService = new NotificationService();