import { getArchiveAdminData, createPraktikum } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return await getArchiveAdminData();
};

export const actions: Actions = {
	create: async ({ request }) => {
		console.log('--- Action triggered: Praktikum Create (Named) ---');
		const formData = await request.formData();
		const mataKuliahId = parseInt(formData.get('mataKuliahId') as string);
		const title = formData.get('title') as string;
		const asprak = formData.get('asprak') as string | undefined;

		if (!mataKuliahId || !title) {
			return fail(400, { error: 'Required fields are missing' });
		}

		try {
			await createPraktikum({ mataKuliahId, title, asprak });
		} catch (error) {
			console.error('Failed to create praktikum:', error);
			return fail(500, { error: 'Failed to create praktikum' });
		}
		throw redirect(303, `/dashboard/archives/mata-kuliah/${mataKuliahId}?tab=praktikum`);
	}
};
