import type { InferSelectModel } from 'drizzle-orm';
import { galleryGroup, galleryItem } from '$lib/server/db/schema';

export type GalleryItem = InferSelectModel<typeof galleryItem>;

export type GalleryGroup = InferSelectModel<typeof galleryGroup>;

export type GalleryGroupWithCount = GalleryGroup & {
	itemCount: number;
};

export type GalleryGroupWithItems = GalleryGroup & {
	items: GalleryItem[];
};