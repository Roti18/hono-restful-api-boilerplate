import { getArchiveAdminData, updateSemester } from '$lib/server/services/archive.service';
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
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const id = parseInt(params.id);
		const name = formData.get('name') as string;
		const startYear = parseInt(formData.get('startYear') as string);
		const endYear = parseInt(formData.get('endYear') as string);

		try {
			await updateSemester(id, { name, startYear, endYear });
		} catch (error) {
			console.error('Failed to update semester:', error);
			return fail(500, { error: 'Failed to update semester' });
		}
		throw redirect(303, '/dashboard/archives');
	}
};
