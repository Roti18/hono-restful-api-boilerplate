import {
	getArchiveAdminData,
	updateSemester,
	updateMataKuliah,
	updateAcademicItem
} from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const id = parseInt(params.id);
	const type = url.searchParams.get('type'); // 'semester', 'mataKuliah', 'academicItem'

	// In a real app we'd fetch specific item data by ID here.
	// Since our service returns all data, we'll just filter it in the page component or here.
	const data = await getArchiveAdminData();

	// We could technically filter here to return only specific item,
	// but the shared data is needed for dropdowns anyway.
	return {
		...data,
		targetId: id,
		targetType: type
	};
};

export const actions: Actions = {
	updateSemester: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
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
	},

	updateMataKuliah: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
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
	},

	updateAcademicItem: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);
		const mataKuliahId = parseInt(formData.get('mataKuliahId') as string);
		const type = formData.get('type') as string;
		const title = formData.get('title') as string;
		const link = formData.get('link') as string;
		const linkPlatform = formData.get('linkPlatform') as string;

		try {
			await updateAcademicItem(id, {
				mataKuliahId,
				type,
				title,
				links: link ? [{ title: 'Link', url: link, platform: linkPlatform, order: 0 }] : []
			});
		} catch (error) {
			console.error('Failed to update academic item:', error);
			return fail(500, { error: 'Failed to update academic item' });
		}
		throw redirect(303, '/dashboard/archives?tab=academicItems');
	}
};
