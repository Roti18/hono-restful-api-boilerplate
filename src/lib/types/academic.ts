import type { InferSelectModel } from 'drizzle-orm';
import {
	semester,
	mataKuliah,
	academicItem,
	academicItemBlock,
	academicItemLink,
	praktikum,
	praktikumItem,
	praktikumItemBlock,
	praktikumItemLink,
	asprak
} from '$lib/server/db/schema';

/* =========================
   BLOCK & LINK
========================= */

export type AcademicItemBlock = InferSelectModel<typeof academicItemBlock>;
export type AcademicItemLink = InferSelectModel<typeof academicItemLink>;

export type PraktikumItemBlock = InferSelectModel<typeof praktikumItemBlock>;
export type PraktikumItemLink = InferSelectModel<typeof praktikumItemLink>;

/* =========================
   ITEM
========================= */

export type AcademicItem = InferSelectModel<typeof academicItem> & {
	blocks: AcademicItemBlock[];
	links: AcademicItemLink[];
};

export type PraktikumItem = InferSelectModel<typeof praktikumItem> & {
	blocks: PraktikumItemBlock[];
	links: PraktikumItemLink[];
};

/* =========================
   PRAKTIKUM
========================= */

export type Praktikum = InferSelectModel<typeof praktikum> & {
	praktikumItems: PraktikumItem[];
};

/* =========================
   ASPRAK
========================= */

export type Asprak = InferSelectModel<typeof asprak>;

/* =========================
   MATA KULIAH
========================= */

// This type reflects the exact structure returned by the deep query in getArchiveOverview
export type MataKuliahForArchive = InferSelectModel<typeof mataKuliah> & {
	academicItems: AcademicItem[];
	praktikums: Praktikum[];
	aspraks: Asprak[];
};

/* =========================
   SEMESTER
========================= */

// This type reflects the exact structure returned by the deep query in getArchiveOverview
export type SemesterForArchive = InferSelectModel<typeof semester> & {
	mataKuliahs: MataKuliahForArchive[];
};
