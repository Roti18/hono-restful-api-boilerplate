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

export async function getGalleryItemById(id: number) {
	return db.query.galleryItem.findFirst({
		where: eq(galleryItem.id, id)
	});
}

export async function getUncategorizedGalleryItems() {
	return db.query.galleryItem.findMany({
		where: (items, { isNull }) => isNull(items.groupId)
	});
}

// CRUD for Gallery Group
export async function createGalleryGroup(data: { title: string; description: string }) {
	await db.insert(galleryGroup).values({
		title: data.title,
		description: data.description
	});
}

export async function updateGalleryGroup(id: number, data: { title: string; description: string }) {
	await db
		.update(galleryGroup)
		.set({
			title: data.title,
			description: data.description
		})
		.where(eq(galleryGroup.id, id));
}

export async function deleteGalleryGroup(id: number) {
	await db.delete(galleryGroup).where(eq(galleryGroup.id, id));
}

// CRUD for Gallery Item
export async function createGalleryItem(data: {
	groupId: number | null;
	title: string;
	description: string;
	imageWebpUrl: string;
	imageOriginalUrl: string;
	imagekitFileId: string;
	googleDriveFileId: string;
	date: string;
}) {
	await db.insert(galleryItem).values({
		groupId: data.groupId,
		title: data.title,
		description: data.description,
		imageWebpUrl: data.imageWebpUrl,
		imageOriginalUrl: data.imageOriginalUrl,
		imagekitFileId: data.imagekitFileId,
		googleDriveFileId: data.googleDriveFileId,
		date: data.date
	});
}

export async function updateGalleryItem(
	id: number,
	data: {
		groupId: number | null;
		title: string;
		description: string;
		// Optional, purely if we are updating the image
		imageWebpUrl?: string;
		imageOriginalUrl?: string;
		imagekitFileId?: string;
		googleDriveFileId?: string;

		date: string;
	}
) {
	// Construct update object dynamically to handle optional image updates
	const updateData: any = {
		groupId: data.groupId,
		title: data.title,
		description: data.description,
		date: data.date
	};

	if (data.imageWebpUrl) updateData.imageWebpUrl = data.imageWebpUrl;
	if (data.imageOriginalUrl) updateData.imageOriginalUrl = data.imageOriginalUrl;
	if (data.imagekitFileId) updateData.imagekitFileId = data.imagekitFileId;
	if (data.googleDriveFileId) updateData.googleDriveFileId = data.googleDriveFileId;

	await db.update(galleryItem).set(updateData).where(eq(galleryItem.id, id));
}

export async function deleteGalleryItem(id: number) {
	const item = await getGalleryItemById(id);
	if (!item) return;

	// Delete from ImageKit
	if (item.imagekitFileId) {
		const { storageService } = await import('./storage.service');
		await storageService.deleteFromImageKit(item.imagekitFileId);
	}

	// Delete from Google Drive
	if (item.googleDriveFileId) {
		const { storageService } = await import('./storage.service');
		await storageService.deleteFromGoogleDrive(item.googleDriveFileId);
	}

	await db.delete(galleryItem).where(eq(galleryItem.id, id));
}
