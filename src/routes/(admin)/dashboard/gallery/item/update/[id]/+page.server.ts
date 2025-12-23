import {
	getGalleryItems,
	updateGalleryItem,
	getGalleryGroupsWithCount
} from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const items = await getGalleryItems();
	const item = items.find((i: any) => i.id === id);
	const groups = await getGalleryGroupsWithCount();

	if (!item) throw redirect(303, '/dashboard/gallery');

	return { item, groups };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const id = parseInt(params.id);
		const groupId = formData.get('groupId') ? parseInt(formData.get('groupId') as string) : null;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const date = formData.get('date') as string;
		const imageFile = formData.get('image') as File;

		if (!title || !date) {
			return fail(400, { error: 'Required fields are missing' });
		}

		try {
			const { updateGalleryItem, getGalleryItemById } =
				await import('$lib/server/services/gallery.service');
			const { imageService } = await import('$lib/server/services/image.service');
			const { storageService } = await import('$lib/server/services/storage.service');
			const { db } = await import('$lib/server/db');
			const { galleryGroup } = await import('$lib/server/db/schema');
			const { eq } = await import('drizzle-orm');

			const updates: any = {
				groupId,
				title,
				description,
				date
			};

			// Process image ONLY if a new one is uploaded
			if (imageFile && imageFile.size > 0) {
				// Determine Folder Path
				let folderName = 'Uncategorized';
				if (groupId) {
					const group = await db.query.galleryGroup.findFirst({
						where: eq(galleryGroup.id, groupId)
					});
					if (group) folderName = group.title;
				}

				// Sanitize
				const safeFolder = folderName.replace(/[^a-zA-Z0-9]/g, '_');
				const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');

				const imageKitPath = `/gallery/${safeFolder}/${safeTitle}/`;
				const drivePath = ['gallery', safeFolder, safeTitle];

				const buffer = Buffer.from(await imageFile.arrayBuffer());

				// 1. Process New Image
				const webpBuffer = await imageService.processImage(buffer);
				const webpUpload = await storageService.uploadToImageKit(
					webpBuffer,
					`${safeTitle}_${Date.now()}.webp`,
					imageKitPath
				);
				const originalUpload = await storageService.uploadToGoogleDrive(
					buffer,
					imageFile.name,
					imageFile.type,
					drivePath
				);

				updates.imageWebpUrl = webpUpload.url;
				updates.imageOriginalUrl = originalUpload.url || '';
				updates.imagekitFileId = webpUpload.fileId;
				updates.googleDriveFileId = originalUpload.fileId || '';

				// 2. Cleanup Old Image
				const existingItem = await getGalleryItemById(id);
				if (existingItem) {
					if (existingItem.imagekitFileId) {
						await storageService.deleteFromImageKit(existingItem.imagekitFileId);
					}
					if (existingItem.googleDriveFileId) {
						await storageService.deleteFromGoogleDrive(existingItem.googleDriveFileId);
					}
				}
			}

			// 3. Update DB
			await updateGalleryItem(id, updates);
		} catch (error) {
			console.error('Failed to update gallery item:', error);
			return fail(500, { error: 'Failed to update gallery item' });
		}
		throw redirect(303, '/dashboard/gallery');
	}
};
