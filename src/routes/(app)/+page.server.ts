import { getGalleryGroupsWithItems } from '$lib/server/services/gallery.service';
import { getArchiveTree } from '$lib/server/services/archive.service';

export async function load() {
	const gallery = await getGalleryGroupsWithItems();
	const archive = await getArchiveTree();
	return { gallery, archive };
}

