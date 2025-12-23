import { getGalleryItems, deleteGalleryItem } from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const items = await getGalleryItems();
	const item = items.find((i: any) => i.id === id);

	if (!item) throw redirect(303, '/dashboard/gallery');

	return { item };
};

export const actions: Actions = {
	default: async ({ params }) => {
		const id = parseInt(params.id);

		try {
			await deleteGalleryItem(id);
		} catch (error) {
			console.error('Failed to delete gallery item:', error);
			return fail(500, { error: 'Failed to delete gallery item' });
		}
		throw redirect(303, '/dashboard/gallery');
	}
};
