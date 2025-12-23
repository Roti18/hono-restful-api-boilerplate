import { getSessions, deleteSession } from '$lib/server/services/session.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Only need session details if verifying which one, but ID is enough for delete confirmation.
	// However, showing name/user helps.
	const sessions = await getSessions();
	const session = sessions.find((s: any) => s.id === params.id);

	if (!session) throw redirect(303, '/dashboard/sessions');

	return { session };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = params.id as string;

		try {
			await deleteSession(id);
		} catch (error) {
			console.error('Failed to delete session:', error);
			return fail(500, { error: 'Failed to delete session' });
		}
		throw redirect(303, '/dashboard/sessions');
	}
};
