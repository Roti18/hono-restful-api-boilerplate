import { db } from '$lib/server/db';
import { academicItem, academicItemLink, academicItemBlock } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw redirect(303, '/dashboard/archives');

	// 1. Get Item with Links and Blocks
	const item = await db.query.academicItem.findFirst({
		where: eq(academicItem.id, id),
		with: {
			links: true,
			blocks: {
				orderBy: (blocks, { asc }) => [asc(blocks.order)]
			},
			mataKuliah: true
		}
	});

	if (!item) throw redirect(303, '/dashboard/archives');

	// 2. Get All Mata Kuliah for dropdown
	const mataKuliahs = await db.query.mataKuliah.findMany({
		with: { semester: true }
	});

	return { item, mataKuliahs };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		console.log('--- START ACADEMIC ITEM UPDATE ---');
		const id = parseInt(params.id);
		const formData = await request.formData();

		const mataKuliahId = parseInt(formData.get('mataKuliahId') as string);
		const type = formData.get('type') as string;
		const title = formData.get('title') as string;

		console.log(`Update Item ID=${id}, MK=${mataKuliahId}, Type=${type}, Title=${title}`);

		const linksJson = formData.get('links') as string;
		const blocksJson = formData.get('blocks') as string;

		if (!id || !mataKuliahId || !type || !title) {
			console.error('Missing required fields');
			return fail(400, { error: 'Required fields are missing' });
		}

		let links = [];
		let blocks = [];
		try {
			if (linksJson) links = JSON.parse(linksJson);
			if (blocksJson) blocks = JSON.parse(blocksJson);
		} catch (e) {
			console.error('JSON Parse Error', e);
			return fail(400, { error: 'Invalid JSON data' });
		}

		try {
			const { storageService } = await import('$lib/server/services/storage.service');
			const { imageService } = await import('$lib/server/services/image.service');
			const { getStoragePathInfo } = await import('$lib/server/services/archive.service');

			// Get current item state for file cleanup
			const oldItem = await db.query.academicItem.findFirst({
				where: eq(academicItem.id, id),
				with: { blocks: true }
			});

			// Get storage paths
			const { imageKitPath, drivePath } = await getStoragePathInfo(mataKuliahId, type, title);
			console.log(`Storage Paths: IK=${imageKitPath}, Drive=${drivePath.join('/')}`);

			// --- 1. Handle Hero Image ---
			const heroImageFile = formData.get('heroImage') as File;
			let heroData: any = {};

			// If new file uploaded
			if (heroImageFile && heroImageFile.size > 0) {
				console.log('Updating Hero Image...');
				const buffer = Buffer.from(await heroImageFile.arrayBuffer());
				const webpBuffer = await imageService.processImage(buffer);
				const webpUpload = await storageService.uploadToImageKit(
					webpBuffer,
					`${title}_hero_${Date.now()}.webp`,
					imageKitPath
				);
				const driveUpload = await storageService.uploadToGoogleDrive(
					buffer,
					heroImageFile.name,
					heroImageFile.type,
					drivePath
				);

				heroData = {
					heroImageWebpUrl: webpUpload.url,
					heroImageOriginalUrl: driveUpload.url,
					heroImageFileId: webpUpload.fileId,
					heroImageGoogleId: driveUpload.fileId
				};

				// CLEANUP: Delete old hero image if exists
				if (oldItem) {
					if (oldItem.heroImageFileId) {
						console.log(`Deleting Old Hero IK: ${oldItem.heroImageFileId}`);
						await storageService.deleteFromImageKit(oldItem.heroImageFileId);
					}
					if (oldItem.heroImageGoogleId) {
						console.log(`Deleting Old Hero Drive: ${oldItem.heroImageGoogleId}`);
						await storageService.deleteFromGoogleDrive(oldItem.heroImageGoogleId);
					}
				}
			}

			// --- 2. Process Blocks ---
			const processedBlocks: any[] = [];
			const keptFileIds = new Set<string>(); // Track file IDs that are preserved

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
						console.log(`Updating Block Image ${i}...`);
						const buffer = Buffer.from(await file.arrayBuffer());
						const webpBuffer = await imageService.processImage(buffer);
						const webpUpload = await storageService.uploadToImageKit(
							webpBuffer,
							`${title}_acad_${i}_${Date.now()}.webp`,
							imageKitPath
						);
						const driveUpload = await storageService.uploadToGoogleDrive(
							buffer,
							file.name,
							file.type,
							drivePath
						);

						cleanBlock.imageWebpUrl = webpUpload.url;
						cleanBlock.imageOriginalUrl = driveUpload.url;
						cleanBlock.imageFileId = webpUpload.fileId;
						cleanBlock.imageGoogleId = driveUpload.fileId;

						// Note: We don't add these new IDs to keptFileIds because they are new.
						// The old file ID for this block (if it existed) is implicitly NOT in keptFileIds, so it will be deleted.
					} else {
						// Keeping existing file
						if (cleanBlock.imageFileId) keptFileIds.add(cleanBlock.imageFileId);
						if (cleanBlock.imageGoogleId) keptFileIds.add(cleanBlock.imageGoogleId);
					}
				}
				processedBlocks.push(cleanBlock);
			}

			// CLEANUP: Delete removed/replaced block files
			if (oldItem && oldItem.blocks) {
				for (const oldBlock of oldItem.blocks) {
					if (oldBlock.type === 'image') {
						// If old file ID exists and is NOT in the kept list, delete it
						if (oldBlock.imageFileId && !keptFileIds.has(oldBlock.imageFileId)) {
							console.log(`Deleting Orphaned Block Image IK: ${oldBlock.imageFileId}`);
							await storageService.deleteFromImageKit(oldBlock.imageFileId);
						}
						if (oldBlock.imageGoogleId && !keptFileIds.has(oldBlock.imageGoogleId)) {
							console.log(`Deleting Orphaned Block Image Drive: ${oldBlock.imageGoogleId}`);
							await storageService.deleteFromGoogleDrive(oldBlock.imageGoogleId);
						}
					}
				}
			}

			// --- 3. Database Transaction ---
			console.log('Executing DB Update Transaction...');
			await db.transaction(async (tx) => {
				// Update Main Item
				await tx
					.update(academicItem)
					.set({
						mataKuliahId,
						type,
						title,
						// updatedAt: new Date(),
						...heroData
					})
					.where(eq(academicItem.id, id));

				// Replace Links
				await tx.delete(academicItemLink).where(eq(academicItemLink.itemId, id));
				if (links.length > 0) {
					await tx.insert(academicItemLink).values(
						links.map((l: any, index: number) => ({
							itemId: id,
							title: l.title,
							url: l.url,
							platform: l.platform || 'other',
							order: index // ADDED ORDER
						}))
					);
				}

				// Replace Blocks
				await tx.delete(academicItemBlock).where(eq(academicItemBlock.itemId, id));
				if (processedBlocks.length > 0) {
					await tx.insert(academicItemBlock).values(processedBlocks);
				}
			});
			console.log('Academic Item Updated Successfully');
		} catch (error) {
			console.error('Failed to update academic item:', error);
			return fail(500, { error: 'Failed to update item' });
		}

		throw redirect(303, `/dashboard/archives/mata-kuliah/${mataKuliahId}`);
	}
};
