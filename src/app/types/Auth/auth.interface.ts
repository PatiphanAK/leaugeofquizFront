export interface User {
    id: number;
    email: string;
    displayName: string;
    pictureUrl: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    message?: string;
    error?: string;
}