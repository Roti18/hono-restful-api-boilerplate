<script lang="ts">
	import { Search, Edit2 } from '@lucide/svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { UserWithLastLogin, UserRole } from '$lib/types/user';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';
	let showModal: boolean = false;
	let selectedUser: UserWithLastLogin | null = null;
	let selectedRole: string = 'user';

	const users: UserWithLastLogin[] = data?.users || [
		{
			id: '1',
			username: 'johndoe',
			email: 'john@example.com',
			role: 'admin',
			lastLogin: '2024-12-22 10:30'
		},
		{
			id: '2',
			username: 'janedoe',
			email: 'jane@example.com',
			role: 'user',
			lastLogin: '2024-12-21 15:45'
		}
	];

	function openEditModal(user: UserWithLastLogin): void {
		selectedUser = user;
		selectedRole = user.role || 'user';
		showModal = true;
	}

	async function handleSaveUser(): Promise<void> {
		if (!selectedUser) return;

		console.log('Updating user:', selectedUser.id, 'to role:', selectedRole);

		showModal = false;
		selectedUser = null;
	}

	$: filteredUsers = users.filter(
		(u: UserWithLastLogin) =>
			u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>User Management - Campus Life</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">User Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Manage user accounts and roles</p>
		</div>

		<div class="relative w-full sm:w-80">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
			/>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search users..."
				class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
			/>
		</div>
	</div>

	<div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
		<table class="w-full">
			<thead class="border-b border-zinc-800 bg-zinc-900">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>User</th
					>
					<th
						class="hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-400 uppercase sm:table-cell"
						>Email</th
					>
					<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>Role</th
					>
					<th
						class="hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-400 uppercase md:table-cell"
						>Last Login</th
					>
					<th
						class="px-6 py-3 text-right text-xs font-medium tracking-wider text-zinc-400 uppercase"
						>Actions</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-800">
				{#each filteredUsers as user (user.id)}
					<tr class="transition-colors hover:bg-zinc-900">
						<td class="px-6 py-4">
							<div class="flex items-center">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white"
								>
									{user.username.charAt(0).toUpperCase()}
								</div>
								<div class="ml-3 min-w-0">
									<p class="truncate text-sm font-medium text-white">{user.username}</p>
									<p class="truncate text-xs text-zinc-500 sm:hidden">{user.email}</p>
								</div>
							</div>
						</td>
						<td class="hidden px-6 py-4 text-sm text-zinc-400 sm:table-cell">{user.email}</td>
						<td class="px-6 py-4">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium {user.role === 'admin'
									? 'bg-white text-black'
									: 'bg-zinc-800 text-zinc-300'}"
							>
								{user.role || 'user'}
							</span>
						</td>
						<td class="hidden px-6 py-4 text-sm text-zinc-400 md:table-cell">{user.lastLogin}</td>
						<td class="px-6 py-4 text-right">
							<button
								on:click={() => openEditModal(user)}
								class="p-1 text-zinc-400 transition-colors hover:text-white"
								aria-label="Edit user {user.username}"
								type="button"
							>
								<Edit2 class="h-4 w-4" />
							</button>
						</td>
					</tr>
				{/each}

				{#if filteredUsers.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-sm text-zinc-500">
							No users found matching "{searchQuery}"
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<!-- Edit User Modal -->
<Modal bind:show={showModal} title="Edit User Role">
	{#if selectedUser}
		<div class="space-y-4">
			<div>
				<label for="username" class="mb-2 block text-sm font-medium text-zinc-300">Username</label>
				<input
					value={selectedUser.username}
					disabled
					id="username"
					class="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500"
				/>
			</div>
			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-zinc-300">Email</label>
				<input
					type="email"
					value={selectedUser.email}
					disabled
					id="email"
					class="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500"
				/>
			</div>
			<div>
				<label for="role" class="mb-2 block text-sm font-medium text-zinc-300">Role</label>
				<select
					bind:value={selectedRole}
					id="role"
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white transition-colors focus:border-white focus:outline-none"
				>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</select>
			</div>
		</div>
	{/if}
	<div slot="footer" class="flex justify-end gap-3">
		<button
			on:click={() => (showModal = false)}
			class="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
			type="button"
		>
			Cancel
		</button>
		<button
			on:click={handleSaveUser}
			class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
			type="button"
		>
			Save Changes
		</button>
	</div>
</Modal>
