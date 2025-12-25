// src/lib/types/common.ts

// Navigation types
export interface NavItem {
	href: string;
	label: string;
	icon: any;
}

// Activity feed types
export interface Activity {
	id?: string;
	user: string;
	action: string;
	target: string;
	time: string;
}

// Stats types
export interface StatCard {
	icon: any;
	title: string;
	value: string;
	change: string;
}

export interface QuickStat {
	label: string;
	value: string;
	percentage?: number;
}

// Search types
export interface SearchResult {
	id: string;
	type: 'user' | 'gallery' | 'archive';
	title: string;
	description?: string;
	url: string;
}

export interface SearchResponse {
	results: SearchResult[];
	total: number;
}

// Pagination types
export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginationResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

// Modal types
export type ModalMode = 'create' | 'edit' | 'delete' | 'view';

// Sort types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
	field: string;
	direction: SortDirection;
}

// Filter types
export interface FilterConfig {
	field: string;
	value: string | number | boolean;
	operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'contains';
}
