import { db } from '$lib/server/db';

export async function getUsers() {
	const users = await db.query.user.findMany();
	return users.map((user) => ({
		...user,
		lastLogin: new Date().toLocaleString()
	}));
}
