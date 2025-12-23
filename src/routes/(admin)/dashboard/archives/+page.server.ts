import { getArchiveAdminData } from '$lib/server/services/archive.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getArchiveAdminData();
	return data;
};
