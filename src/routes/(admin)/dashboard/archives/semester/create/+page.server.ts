import { createSemester } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const startYear = parseInt(formData.get('startYear') as string);
		const endYear = parseInt(formData.get('endYear') as string);

		if (!name || !startYear || !endYear) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			await createSemester({ name, startYear, endYear });
		} catch (error) {
			console.error('Failed to create semester:', error);
			return fail(500, { error: 'Failed to create semester' });
		}
		throw redirect(303, '/dashboard/archives');
	}
};
