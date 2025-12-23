import { updatePraktikum } from '$lib/server/services/archive.service';
import { db } from '$lib/server/db';
import { praktikum } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	const group = await db.query.praktikum.findFirst({
		where: eq(praktikum.id, id),
		with: { mataKuliah: true }
	});

	if (!group) throw redirect(303, '/dashboard/archives');

	const mataKuliahs = await db.query.mataKuliah.findMany({
		with: { semester: true }
	});

	return { group, mataKuliahs };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const asprak = formData.get('asprak') as string | undefined;

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		let mataKuliahId: number | undefined;

		try {
			await updatePraktikum(id, { title, asprak });

			// Get mataKuliahId for redirect
			const group = await db.query.praktikum.findFirst({
				where: eq(praktikum.id, id)
			});
			mataKuliahId = group?.mataKuliahId;
		} catch (error) {
			console.error('Failed to update praktikum:', error);
			return fail(500, { error: 'Failed to update group' });
		}

		if (mataKuliahId) {
			throw redirect(303, `/dashboard/archives/mata-kuliah/${mataKuliahId}?tab=praktikum`);
		}
		throw redirect(303, '/dashboard/archives');
	}
};
