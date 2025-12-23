export interface ArchiveItem {
	id: string;
	title?: string;
	semesterTitle?: string;
	semesterStartYear?: number;
	semesterEndYear?: number;
	children?: ArchiveItem[];
	description?: string;
	documentation?: DocumentationItem[];
	links?: { title: string; url: string; platform?: string }[];
	dosen?: string;
	jam?: string;
	aspraks?: { name: string }[];
}

export interface DocumentationItem {
	image: string;
	caption: string;
	subtitle: string;
}
