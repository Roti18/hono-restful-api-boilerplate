// src/routes/(admin)/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Check if user has admin role
	// Uncomment this when you implement role system
	/*
  if (locals.user.role !== 'admin') {
    throw error(403, {
      message: 'Forbidden: Admin access required'
    });
  }
  */

	return {
		user: {
			id: locals.user.id,
			username: locals.user.username,
			email: locals.user.email || `${locals.user.username}@example.com`,
			role: locals.user.role || 'admin'
		}
	};
};
