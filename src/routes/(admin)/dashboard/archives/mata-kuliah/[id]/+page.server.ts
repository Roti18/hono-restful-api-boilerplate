import { db } from '$lib/server/db';
import { mataKuliah, academicItem, praktikum } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	// Get Mata Kuliah
	const courseData = await db.query.mataKuliah.findFirst({
		where: eq(mataKuliah.id, id),
		with: {
			semester: true
		}
	});

	if (!courseData) throw redirect(303, '/dashboard/archives');

	// Get Academic Items
	const items = await db.query.academicItem.findMany({
		where: eq(academicItem.mataKuliahId, id),
		with: {
			links: true
		}
	});

	// Get Praktikum (Optional, later)
	const praktikums = await db.query.praktikum.findMany({
		where: eq(praktikum.mataKuliahId, id)
	});

	return {
		course: courseData,
		items,
		praktikums
	};
};
