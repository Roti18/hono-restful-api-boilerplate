import { getArchiveAdminData, deleteSemester } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const data = await getArchiveAdminData();
	const item = data.semesters.find((s: any) => s.id === id);

	if (!item) throw redirect(303, '/dashboard/archives');

	return { item };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = parseInt(params.id);

		try {
			await deleteSemester(id);
		} catch (error) {
			console.error('Failed to delete semester:', error);
			return fail(500, { error: 'Failed to delete semester' });
		}
		throw redirect(303, '/dashboard/archives');
	}
};
