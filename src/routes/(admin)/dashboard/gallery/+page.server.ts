import {
	getGalleryGroupsWithItems,
	getUncategorizedGalleryItems
} from '$lib/server/services/gallery.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const groups = await getGalleryGroupsWithItems();
	const uncategorizedItems = await getUncategorizedGalleryItems();

	return {
		groups,
		uncategorizedItems
	};
};
