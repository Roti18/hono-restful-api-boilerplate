import { deletePraktikumItem } from '$lib/server/services/archive.service';
import { db } from '$lib/server/db';
import { praktikumItem } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	const item = await db.query.praktikumItem.findFirst({
		where: eq(praktikumItem.id, id)
	});

	if (!item) throw redirect(303, '/dashboard/archives');

	// Perform Delete immediately (GET request triggers delete for simplicity in this admin panel,
	// ideally should be POST/DELETE form but typical for simple admin links)
	// Wait, this is reckless. Let's make it an action or confirmation page.
	// The academic item delete uses a confirmation page pattern?
	// Let's check academic-item/delete structure.

	return { item };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) return;

		// Fetch item first to know where to redirect
		const item = await db.query.praktikumItem.findFirst({
			where: eq(praktikumItem.id, id)
		});

		if (item) {
			await deletePraktikumItem(id);
			throw redirect(303, `/dashboard/archives/praktikum/${item.praktikumId}`);
		}
		throw redirect(303, '/dashboard/archives');
	}
};
