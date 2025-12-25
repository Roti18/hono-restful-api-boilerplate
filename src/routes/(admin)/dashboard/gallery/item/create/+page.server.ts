import { createGalleryItem, getGalleryGroupsWithCount } from '$lib/server/services/gallery.service';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const groups = await getGalleryGroupsWithCount();
	return { groups };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const groupId = formData.get('groupId') ? parseInt(formData.get('groupId') as string) : null;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const date = formData.get('date') as string;
		const imageFile = formData.get('image') as File;

		if (!title || !date || !imageFile || imageFile.size === 0) {
			return fail(400, { error: 'Required fields are missing or image is invalid' });
		}

		try {
			// Lazy import
			const { imageService } = await import('$lib/server/services/image.service');
			const { storageService } = await import('$lib/server/services/storage.service');
			const { db } = await import('$lib/server/db');
			const { galleryGroup } = await import('$lib/server/db/schema');
			const { eq } = await import('drizzle-orm');

			// Determine Folder Path
			let folderName = 'Uncategorized';
			if (groupId) {
				const group = await db.query.galleryGroup.findFirst({
					where: eq(galleryGroup.id, groupId)
				});
				if (group) folderName = group.title;
			}

			// Sanitize names
			const safeFolder = folderName.replace(/[^a-zA-Z0-9]/g, '_');
			const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');

			const imageKitPath = `/gallery/${safeFolder}/${safeTitle}/`;
			const drivePath = ['gallery', safeFolder, safeTitle];

			const buffer = Buffer.from(await imageFile.arrayBuffer());

			// 1. Process Image
			const webpBuffer = await imageService.processImage(buffer);

			// 2. Upload WebP to ImageKit
			const webpUpload = await storageService.uploadToImageKit(
				webpBuffer,
				`${safeTitle}_${Date.now()}.webp`,
				imageKitPath
			);

			// 3. Upload Original to Google Drive
			const originalUpload = await storageService.uploadToGoogleDrive(
				buffer,
				imageFile.name,
				imageFile.type,
				drivePath
			);

			// 4. Save to DB
			await createGalleryItem({
				groupId,
				title,
				description,
				imageWebpUrl: webpUpload.url,
				imageOriginalUrl: originalUpload.url || '',
				imagekitFileId: webpUpload.fileId,
				googleDriveFileId: originalUpload.fileId || '',
				date
			});
		} catch (error) {
			console.error('Failed to create gallery item:', error);
			return fail(500, { error: 'Failed to create gallery item processing' });
		}
		throw redirect(303, '/dashboard/gallery');
	}
};
