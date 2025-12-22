// src/routes/(admin)/dashboard/gallery/+page.server.ts
import { getGalleryGroupsWithItems } from '$lib/server/services/gallery.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const groups = await getGalleryGroupsWithItems();

	return {
		groups
	};
};

