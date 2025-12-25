import { deletePraktikum } from '$lib/server/services/archive.service';
import { db } from '$lib/server/db';
import { praktikum } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	const group = await db.query.praktikum.findFirst({
		where: eq(praktikum.id, id),
		with: { mataKuliah: true }
	});

	if (!group) throw redirect(303, '/dashboard/archives');

	return { group };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) return;

		const group = await db.query.praktikum.findFirst({
			where: eq(praktikum.id, id)
		});

		if (group) {
			await deletePraktikum(id);
			throw redirect(303, `/dashboard/archives/mata-kuliah/${group.mataKuliahId}?tab=praktikum`);
		}
		throw redirect(303, '/dashboard/archives');
	}
};
