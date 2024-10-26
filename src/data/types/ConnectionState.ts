export enum ConnectionState {
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTING_SUCCESS',
    DISCONNECTED = 'DISCONNECTED',
    FAILED = 'CONNECTING_FAILED',
}

export enum DialogState {
    NONE = "NONE",
    CREATE = "CREATE",
    JOIN = "JOIN"
}