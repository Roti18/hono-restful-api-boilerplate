import { db } from '$lib/server/db';
import { praktikum, praktikumItem } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	// Get Praktikum
	const praktikumData = await db.query.praktikum.findFirst({
		where: eq(praktikum.id, id),
		with: {
			mataKuliah: true
		}
	});

	if (!praktikumData) throw redirect(303, '/dashboard/archives');

	// Get Items
	const items = await db.query.praktikumItem.findMany({
		where: eq(praktikumItem.praktikumId, id)
	});

	return {
		praktikum: praktikumData,
		items
	};
};
