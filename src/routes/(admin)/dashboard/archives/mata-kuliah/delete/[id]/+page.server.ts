import { getArchiveAdminData, deleteMataKuliah } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const data = await getArchiveAdminData();
	const item = data.mataKuliahs.find((s: any) => s.id === id);

	if (!item) throw redirect(303, '/dashboard/archives?tab=mataKuliahs');

	return { item };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = parseInt(params.id);

		try {
			await deleteMataKuliah(id);
		} catch (error) {
			console.error('Failed to delete mata kuliah:', error);
			return fail(500, { error: 'Failed to delete mata kuliah' });
		}
		throw redirect(303, '/dashboard/archives?tab=mataKuliahs');
	}
};
