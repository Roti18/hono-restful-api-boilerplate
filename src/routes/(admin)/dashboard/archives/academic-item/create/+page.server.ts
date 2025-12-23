import { getArchiveAdminData, createAcademicItem } from '$lib/server/services/archive.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getArchiveAdminData(); // Needed for dropdown
	return data;
};

export const actions: Actions = {
	create: async ({ request }) => {
		console.log('--- START ACADEMIC ITEM CREATE (Named Action) ---');
		const formData = await request.formData();
		const mataKuliahId = parseInt(formData.get('mataKuliahId') as string);
		const type = formData.get('type') as string;
		const title = formData.get('title') as string;

		console.log(`Payload: MK=${mataKuliahId}, Type=${type}, Title=${title}`);

		const linksJson = formData.get('links') as string;
		const blocksJson = formData.get('blocks') as string;

		if (!mataKuliahId || !type || !title) {
			console.error('Missing required fields');
			return fail(400, { error: 'Required fields are missing' });
		}

		let links = [];
		let blocks = [];
		try {
			if (linksJson) links = JSON.parse(linksJson);
			if (blocksJson) blocks = JSON.parse(blocksJson);
			console.log(`Parsed ${links.length} links and ${blocks.length} blocks`);
		} catch (e) {
			console.error('JSON Parse Error', e);
			return fail(400, { error: 'Invalid JSON data for links or blocks' });
		}

		try {
			const { storageService } = await import('$lib/server/services/storage.service');
			const { imageService } = await import('$lib/server/services/image.service');
			const { getStoragePathInfo } = await import('$lib/server/services/archive.service');

			// Get storage paths
			const { imageKitPath, drivePath } = await getStoragePathInfo(mataKuliahId, type, title);

			// 1. Handle Hero Image
			const heroImageFile = formData.get('heroImage') as File;
			let heroData = {};
			if (heroImageFile && heroImageFile.size > 0) {
				console.log('Processing Hero Image...');
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
				console.log('Hero Image Processed');
			}

			// 2. Handle Block Images
			const processedBlocks = [];
			for (let i = 0; i < blocks.length; i++) {
				const block = blocks[i];
				const cleanBlock: any = {
					type: block.type,
					content: block.content,
					caption: block.caption,
					width: block.width || 'full',
					order: i
				};

				if (block.type === 'image' && block.tempId) {
					const file = formData.get(`block_image_${block.tempId}`) as File;
					if (file && file.size > 0) {
						console.log(`Processing Block Image ${i}...`);
						const buffer = Buffer.from(await file.arrayBuffer());
						const webpBuffer = await imageService.processImage(buffer);

						const webpUpload = await storageService.uploadToImageKit(
							webpBuffer,
							`${title}_block_${i}_${Date.now()}.webp`,
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
					}
				}
				processedBlocks.push(cleanBlock);
			}

			// 3. Add order to links (KEY FIX)
			console.log('Processing Links with Order...');
			const linksWithOrder = links.map((l: any, index: number) => ({
				title: l.title,
				url: l.url,
				platform: l.platform || 'other',
				order: index
			}));

			console.log('Calling createAcademicItem service...');
			await createAcademicItem({
				mataKuliahId,
				type,
				title,
				...heroData,
				links: linksWithOrder,
				blocks: processedBlocks
			});
			console.log('Service returned success');
		} catch (error) {
			console.error('Failed to create academic item:', error);
			return fail(500, { error: 'Failed to create academic item processing' });
		}

		// Redirect back to the course page
		throw redirect(303, `/dashboard/archives/mata-kuliah/${mataKuliahId}`);
	}
};
