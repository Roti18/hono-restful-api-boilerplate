import {
	getArchiveAdminData,
	createSemester,
	createMataKuliah,
	createAcademicItem
} from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	// We need data for dropdowns (semesters, mataKuliahs)
	const data = await getArchiveAdminData();
	return data;
};

export const actions: Actions = {
	createSemester: async ({ request }) => {
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
	},

	createMataKuliah: async ({ request }) => {
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
	},

	createAcademicItem: async ({ request }) => {
		const formData = await request.formData();
		const mataKuliahId = parseInt(formData.get('mataKuliahId') as string);
		const type = formData.get('type') as string;
		const title = formData.get('title') as string;
		const link = formData.get('link') as string;
		const linkPlatform = formData.get('linkPlatform') as string;
		const heroImageFile = formData.get('heroImage') as File;

		if (!mataKuliahId || !type || !title) {
			return fail(400, { error: 'Required fields are missing' });
		}

		try {
			const { createAcademicItem } = await import('$lib/server/services/archive.service');
			const { imageService } = await import('$lib/server/services/image.service');
			const { storageService } = await import('$lib/server/services/storage.service');

			let imageWebpUrl: string | undefined;
			let imageOriginalUrl: string | undefined;
			let imageFileId: string | undefined;

			if (heroImageFile && heroImageFile.size > 0) {
				const buffer = Buffer.from(await heroImageFile.arrayBuffer());

				const webpBuffer = await imageService.processImage(buffer);
				const webpUpload = await storageService.uploadToImageKit(
					webpBuffer,
					`academic_${title.replace(/\s+/g, '_')}_${Date.now()}.webp`
				);
				const originalUpload = await storageService.uploadToGoogleDrive(
					buffer,
					heroImageFile.name,
					heroImageFile.type
				);

				imageWebpUrl = webpUpload.url;
				imageOriginalUrl = originalUpload.url || '';
				imageFileId = webpUpload.fileId;
			}

			const links = link ? [{ title: 'Link', url: link, platform: linkPlatform, order: 0 }] : [];

			await createAcademicItem({
				mataKuliahId,
				type,
				title,
				links,
				heroImageWebpUrl: imageWebpUrl,
				heroImageOriginalUrl: imageOriginalUrl,
				heroImageFileId: imageFileId
			});
		} catch (error) {
			console.error('Failed to create academic item:', error);
			return fail(500, { error: 'Failed to create academic item' });
		}
		throw redirect(303, '/dashboard/archives?tab=academicItems');
	}
};
