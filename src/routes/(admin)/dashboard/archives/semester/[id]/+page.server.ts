import { db } from '$lib/server/db';
import { semester, mataKuliah } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	// Get Semester
	const semesterData = await db.query.semester.findFirst({
		where: eq(semester.id, id)
	});

	if (!semesterData) throw redirect(303, '/dashboard/archives');

	// Get Mata Kuliah in this semester
	const courses = await db.query.mataKuliah.findMany({
		where: eq(mataKuliah.semesterId, id)
	});

	return {
		semester: semesterData,
		courses
	};
};
