import { db } from '$lib/server/db';
import {
	praktikumItem,
	praktikumItemLink,
	praktikumItemBlock,
	praktikum
} from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	// 1. Get Item with Links and Blocks
	const item = await db.query.praktikumItem.findFirst({
		where: eq(praktikumItem.id, id),
		with: {
			links: true,
			blocks: {
				orderBy: (blocks, { asc }) => [asc(blocks.order)]
			},
			praktikum: {
				with: { mataKuliah: true }
			}
		}
	});

	if (!item) throw redirect(303, '/dashboard/archives');

	// 2. Get All Praktikum Groups for dropdown
	const praktikums = await db.query.praktikum.findMany({
		with: { mataKuliah: true }
	});

	return { item, praktikums };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();

		const praktikumId = parseInt(formData.get('praktikumId') as string);
		const type = formData.get('type') as string;
		const title = formData.get('title') as string;

		const linksJson = formData.get('links') as string;
		const blocksJson = formData.get('blocks') as string;

		// Existing Images handling could be improved, but for now we rely on updates
		const oldHeroWebp = formData.get('oldHeroWebp') as string;

		if (!id || !praktikumId || !type || !title) {
			return fail(400, { error: 'Required fields are missing' });
		}

		let links = [];
		let blocks = [];
		try {
			if (linksJson) links = JSON.parse(linksJson);
			if (blocksJson) blocks = JSON.parse(blocksJson);
		} catch (e) {
			return fail(400, { error: 'Invalid JSON data' });
		}

		try {
			const { storageService } = await import('$lib/server/services/storage.service');
			const { imageService } = await import('$lib/server/services/image.service');

			// --- 1. Handle Hero Image ---
			const heroImageFile = formData.get('heroImage') as File;
			let heroData: any = {};

			// If new file uploaded
			if (heroImageFile && heroImageFile.size > 0) {
				const buffer = Buffer.from(await heroImageFile.arrayBuffer());
				const webpBuffer = await imageService.processImage(buffer);
				const webpUpload = await storageService.uploadToImageKit(
					webpBuffer,
					`${title}_hero_${Date.now()}.webp`
				);
				const driveUpload = await storageService.uploadToGoogleDrive(
					buffer,
					heroImageFile.name,
					heroImageFile.type
				);

				heroData = {
					heroImageWebpUrl: webpUpload.url,
					heroImageOriginalUrl: driveUpload.url,
					heroImageFileId: webpUpload.fileId,
					heroImageGoogleId: driveUpload.fileId
				};
			}

			// --- 2. Process Blocks ---
			const processedBlocks: any[] = [];
			for (let i = 0; i < blocks.length; i++) {
				const block = blocks[i];
				const cleanBlock: any = {
					itemId: id,
					type: block.type,
					content: block.content,
					caption: block.caption,
					width: block.width || 'full',
					order: i
				};

				// Existing image data (pass through)
				if (block.type === 'image') {
					cleanBlock.imageWebpUrl = block.imageWebpUrl || null;
					cleanBlock.imageOriginalUrl = block.imageOriginalUrl || null;
					cleanBlock.imageFileId = block.imageFileId || null;
					cleanBlock.imageGoogleId = block.imageGoogleId || null;

					// CHECK IF NEW FILE UPLOADED FOR THIS BLOCK
					const fileKey = `block_image_${block.tempId}`;
					const file = formData.get(fileKey) as File;

					if (file && file.size > 0) {
						const buffer = Buffer.from(await file.arrayBuffer());
						const webpBuffer = await imageService.processImage(buffer);
						const webpUpload = await storageService.uploadToImageKit(
							webpBuffer,
							`${title}_prak_${i}_${Date.now()}.webp`
						);
						const driveUpload = await storageService.uploadToGoogleDrive(
							buffer,
							file.name,
							file.type
						);

						cleanBlock.imageWebpUrl = webpUpload.url;
						cleanBlock.imageOriginalUrl = driveUpload.url;
						cleanBlock.imageFileId = webpUpload.fileId;
						cleanBlock.imageGoogleId = driveUpload.fileId;
					}
				}
				processedBlocks.push(cleanBlock);
			}

			// --- 3. Database Transaction ---
			await db.transaction(async (tx) => {
				// Update Main Item
				await tx
					.update(praktikumItem)
					.set({
						praktikumId,
						type,
						title,
						updatedAt: new Date(),
						...heroData
					})
					.where(eq(praktikumItem.id, id));

				// Replace Links
				await tx.delete(praktikumItemLink).where(eq(praktikumItemLink.itemId, id));
				if (links.length > 0) {
					await tx.insert(praktikumItemLink).values(
						links.map((l: any, index: number) => ({
							itemId: id,
							title: l.title,
							url: l.url,
							platform: l.platform || 'other',
							order: index // ADDED ORDER HERE
						}))
					);
				}

				// Replace Blocks
				await tx.delete(praktikumItemBlock).where(eq(praktikumItemBlock.itemId, id));
				if (processedBlocks.length > 0) {
					await tx.insert(praktikumItemBlock).values(processedBlocks);
				}
			});
		} catch (error) {
			console.error('Failed to update praktikum item:', error);
			return fail(500, { error: 'Failed to update item' });
		}

		throw redirect(303, `/dashboard/archives/praktikum/${praktikumId}`);
	}
};
