import { getArchiveAdminData, updateMataKuliah } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const data = await getArchiveAdminData();
	const item = data.mataKuliahs.find((s: any) => s.id === id);

	if (!item) throw redirect(303, '/dashboard/archives?tab=mataKuliahs');

	return { item, semesters: data.semesters };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const id = parseInt(params.id);
		const semesterId = parseInt(formData.get('semesterId') as string);
		const name = formData.get('name') as string;
		const code = formData.get('code') as string;
		const dosen = formData.get('dosen') as string;
		const jam = formData.get('jam') as string;

		try {
			await updateMataKuliah(id, { semesterId, name, code, dosen, jam });
		} catch (error) {
			console.error('Failed to update mata kuliah:', error);
			return fail(500, { error: 'Failed to update mata kuliah' });
		}
		throw redirect(303, '/dashboard/archives?tab=mataKuliahs');
	}
};
