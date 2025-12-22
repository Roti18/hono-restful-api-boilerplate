import { db } from '$lib/server/db';
import { galleryGroup, galleryItem } from '$lib/server/db/schema';
import { count, eq } from 'drizzle-orm';

export async function getGalleryGroupsWithItems() {
	const groups = await db.query.galleryGroup.findMany({
		with: {
			items: true
		}
	});
	return groups;
}

export async function getGalleryGroupsWithCount() {
	const groups = await db
		.select({
			id: galleryGroup.id,
			title: galleryGroup.title,
			description: galleryGroup.description,
			itemCount: count(galleryItem.id)
		})
		.from(galleryGroup)
		.leftJoin(galleryItem, eq(galleryGroup.id, galleryItem.groupId))
		.groupBy(galleryGroup.id);

	return groups;
}

export async function getGalleryItems() {
	return db.query.galleryItem.findMany();
}