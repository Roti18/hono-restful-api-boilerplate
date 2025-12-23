import { getSessions, deleteSession } from '$lib/server/services/session.service';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const sessions = await getSessions();
	return {
		sessions
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Session ID is required' });
		}

		try {
			await deleteSession(id);
			return { success: true };
		} catch (error) {
			console.error('Failed to delete session:', error);
			return fail(500, { error: 'Failed to delete session' });
		}
	}
};
