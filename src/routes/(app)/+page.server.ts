import {
	getGalleryGroupsWithItems,
	getUncategorizedGalleryItems
} from '$lib/server/services/gallery.service';
import { getArchiveTree } from '$lib/server/services/archive.service';

export async function load() {
	const gallery = await getGalleryGroupsWithItems();
	const uncategorizedItems = await getUncategorizedGalleryItems();
	const archive = await getArchiveTree();
	return { gallery, uncategorizedItems, archive };
}
