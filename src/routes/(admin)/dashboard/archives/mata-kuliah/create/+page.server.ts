import { getArchiveAdminData, createMataKuliah } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getArchiveAdminData(); // Needed for dropdown
	return data;
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const semesterId = parseInt(formData.get('semesterId') as string);
		const name = formData.get('name') as string;
		const code = formData.get('code') as string;
		const dosen = formData.get('dosen') as string;
		const jam = formData.get('jam') as string;

		if (!semesterId || !name || !dosen || !jam) {
			return fail(400, { error: 'Required fields are missing' });
		}

		try {
			await createMataKuliah({ semesterId, name, code, dosen, jam });
		} catch (error) {
			console.error('Failed to create mata kuliah:', error);
			return fail(500, { error: 'Failed to create mata kuliah' });
		}
		throw redirect(303, '/dashboard/archives?tab=mataKuliahs');
	}
};
