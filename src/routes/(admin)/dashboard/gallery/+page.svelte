<!-- src/routes/(admin)/dashboard/gallery/+page.svelte -->
<script lang="ts">
	import { Plus, Edit2, Trash2, Image as ImageIcon, Search } from '@lucide/svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { GalleryGroupWithItems, GalleryItem } from '$lib/types/gallery';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';
	let showGroupModal: boolean = false;
	let showItemModal: boolean = false;
	let selectedGroup: GalleryGroupWithItems | null = null;
	let selectedItem: GalleryItem | null = null;

	$: galleryGroups = data?.groups || [];

	function openGroupModal(group: GalleryGroupWithItems | null = null): void {
		selectedGroup = group ? { ...group } : { id: 0, title: '', description: '', items: [] };
		showGroupModal = true;
	}

	function openItemModal(item: GalleryItem | null = null): void {
		selectedItem = item
			? { ...item }
			: { id: 0, title: '', description: '', imageUrl: '', date: '', groupId: null };
		showItemModal = true;
	}

	function handleDeleteGroup(groupId: number): void {
		// TODO: Implement delete logic
		console.log('Delete group:', groupId);
	}

	function handleDeleteItem(itemId: number): void {
		// TODO: Implement delete logic
		console.log('Delete item:', itemId);
	}

	$: filteredGroups = galleryGroups.filter((g: GalleryGroupWithItems) =>
		g.title.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>Gallery Management - Campus Life</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Page Title & Actions -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Gallery Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Manage gallery groups and items</p>
		</div>

		<div class="flex gap-3">
			<div class="relative flex-1 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search gallery..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
			<button
				on:click={() => openGroupModal()}
				class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				<Plus class="h-4 w-4" />
				New Group
			</button>
		</div>
	</div>

	<!-- Gallery Groups -->
	<div>
		<h2 class="mb-4 text-lg font-semibold text-white">Gallery Groups</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredGroups as group (group.id)}
				<div
					class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700"
				>
					<div class="flex h-32 items-center justify-center bg-zinc-900">
						<ImageIcon class="h-12 w-12 text-zinc-700" />
					</div>
					<div class="p-4">
						<h3 class="mb-1 text-sm font-semibold text-white">{group.title}</h3>
						<p class="mb-3 text-xs text-zinc-500">{group.description || 'No description'}</p>
						<div class="flex items-center justify-between">
							<span class="text-xs text-zinc-600">{group.items.length} items</span>
							<div class="flex gap-2">
								<button
									on:click={() => openGroupModal(group)}
									class="p-1 text-zinc-400 transition-colors hover:text-white"
									type="button"
									aria-label="Edit group {group.title}"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								<button
									on:click={() => handleDeleteGroup(group.id)}
									class="p-1 text-zinc-400 transition-colors hover:text-red-500"
									type="button"
									aria-label="Delete group {group.title}"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Gallery Items -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-white">Gallery Items</h2>
			<button
				on:click={() => openItemModal()}
				class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
				type="button"
			>
				<Plus class="h-4 w-4" />
				Add Item
			</button>
		</div>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each galleryGroups.flatMap((g) => g.items) as item (item.id)}
				<div
					class="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700"
				>
					<div class="aspect-square bg-zinc-900">
						<img src={item.imageUrl} alt={item.title} class="h-full w-full object-cover" />
					</div>
					<div
						class="bg-opacity-0 group-hover:bg-opacity-75 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all group-hover:opacity-100"
					>
						<div class="flex gap-2">
							<button
								on:click={() => openItemModal(item)}
								class="rounded-full bg-white p-2 text-black transition-colors hover:bg-zinc-200"
								type="button"
								aria-label="Edit item {item.title}"
							>
								<Edit2 class="h-4 w-4" />
							</button>
							<button
								on:click={() => handleDeleteItem(item.id)}
								class="rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
								type="button"
								aria-label="Delete item {item.title}"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
					<div class="p-3">
						<h4 class="truncate text-xs font-medium text-white">{item.title}</h4>
						<p class="mt-1 text-xs text-zinc-500">{item.date}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Group Modal -->
{#if selectedGroup}
	<Modal
		bind:show={showGroupModal}
		title={selectedGroup ? 'Edit Gallery Group' : 'Create Gallery Group'}
	>
		<div class="space-y-4">
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Title</label>
				<input
					type="text"
					placeholder="e.g., Semester 3 Moments"
					bind:value={selectedGroup.title}
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Description</label>
				<textarea
					rows={3}
					placeholder="Describe this gallery group..."
					bind:value={selectedGroup.description}
					class="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				></textarea>
			</div>
		</div>

		<div slot="footer" class="flex justify-end gap-3">
			<button
				on:click={() => (showGroupModal = false)}
				class="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
				type="button"
			>
				Cancel
			</button>
			<button
				on:click={() => (showGroupModal = false)}
				class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				{selectedGroup ? 'Save Changes' : 'Create Group'}
			</button>
		</div>
	</Modal>
{/if}

<!-- Item Modal -->
{#if selectedItem}
	<Modal bind:show={showItemModal} title={selectedItem ? 'Edit Item' : 'Add Item'}>
		<div class="space-y-4">
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Title</label>
				<input
					type="text"
					placeholder="e.g., Class Photo"
					bind:value={selectedItem.title}
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Description</label>
				<textarea
					rows={3}
					placeholder="Describe this item..."
					bind:value={selectedItem.description}
					class="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				></textarea>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Image URL</label>
				<input
					type="text"
					placeholder="e.g., https://example.com/image.jpg"
					bind:value={selectedItem.imageUrl}
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-medium text-zinc-300">Date</label>
				<input
					type="date"
					bind:value={selectedItem.date}
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none"
				/>
			</div>
		</div>

		<div slot="footer" class="flex justify-end gap-3">
			<button
				on:click={() => (showItemModal = false)}
				class="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
				type="button"
			>
				Cancel
			</button>
			<button
				on:click={() => (showItemModal = false)}
				class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				{selectedItem ? 'Save Changes' : 'Create Item'}
			</button>
		</div>
	</Modal>
{/if}
