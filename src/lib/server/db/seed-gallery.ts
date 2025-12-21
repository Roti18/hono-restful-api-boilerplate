import 'dotenv/config';
import { db } from './index';
import { galleryGroup, galleryItem } from './schema';

async function seedGalleryExtra() {
	console.log('🖼️ Seeding extra gallery data...');

	/* =========================
	   CREATE 2 NEW GROUPS
	========================= */
	const [groupA] = await db
		.insert(galleryGroup)
		.values({
			title: 'Studio & Process',
			description: 'Design process, studio session, and iterations'
		})
		.returning();

	const [groupB] = await db
		.insert(galleryGroup)
		.values({
			title: 'Campus & Daily',
			description: 'Daily campus life documentation'
		})
		.returning();

	/* =========================
	   19 GALLERY ITEMS
	========================= */

	const items = [
		// === GROUP A (10 items)
		{ groupId: groupA.id, title: 'Wireframe Wall', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Early Layout Study', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Spacing Exploration', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Component Breakdown', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Prototype Review', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Interaction Mapping', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Dark UI Test', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Iteration Notes', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Visual Rhythm', yearTaken: 2024 },
		{ groupId: groupA.id, title: 'Final Polish', yearTaken: 2024 },

		// === GROUP B (9 items)
		{ groupId: groupB.id, title: 'Morning Class', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Hallway Light', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Study Corner', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Late Afternoon', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Discussion Break', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Empty Classroom', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Library Silence', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Sunset Corridor', yearTaken: 2023 },
		{ groupId: groupB.id, title: 'Last Lecture', yearTaken: 2023 }
	];

	await db.insert(galleryItem).values(
		items.map((item, i) => ({
			...item,
			description: `Documentation — ${item.title}`,
			imageUrl: `https://picsum.photos/seed/gallery-${i + 20}/800/800`
		}))
	);

	console.log('✅ Extra gallery seed complete');
	process.exit(0);
}

seedGalleryExtra().catch((err) => {
	console.error('❌ Gallery seed failed', err);
	process.exit(1);
});
