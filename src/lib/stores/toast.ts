import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: number;
	type: ToastType;
	message: string;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	let counter = 0;

	return {
		subscribe,
		add: (type: ToastType, message: string, duration = 3000) => {
			const id = ++counter;
			update((toasts) => [...toasts, { id, type, message, duration }]);

			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
		},
		remove: (id: number) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		success: (message: string, duration = 3000) => {
			// @ts-ignore - calling internal add
			toast.add('success', message, duration);
		},
		error: (message: string, duration = 3000) => {
			// @ts-ignore
			toast.add('error', message, duration);
		},
		info: (message: string, duration = 3000) => {
			// @ts-ignore
			toast.add('info', message, duration);
		},
		warning: (message: string, duration = 3000) => {
			// @ts-ignore
			toast.add('warning', message, duration);
		}
	};
}

export const toast = createToastStore();
