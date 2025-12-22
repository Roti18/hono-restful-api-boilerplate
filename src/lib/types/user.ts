// src/lib/types/user.ts

export type UserRole = 'user' | 'admin';

export interface User {
	id: string;
	username: string;
	email: string;
	role?: string;
	passwordHash?: string;
}

export interface UserWithLastLogin extends User {
	lastLogin: string;
}

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface SessionWithDetails extends Session {
	username: string;
	device: string;
}

// Form types
export interface UserUpdateInput {
	id: string;
	role: UserRole;
}

// Response types
export interface UserListResponse {
	users: UserWithLastLogin[];
	total: number;
}

export interface SessionListResponse {
	sessions: SessionWithDetails[];
	total: number;
}
