<!-- src/lib/components/layout/admin/Header.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, Menu, X } from '@lucide/svelte';
	import type { User } from '$lib/types/user';

	export let user: User;
	export let mobileMenuOpen: boolean = false;

	let searchQuery: string = '';
	let searchFocused: boolean = false;

	async function handleSearch(e: Event): Promise<void> {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		// Global search - redirect to search results
		await goto(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
	}

	function toggleMenu(): void {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="border-b border-zinc-800 bg-zinc-950">
	<div class="flex items-center justify-between px-6 py-4">
		<!-- Mobile menu button -->
		<button
			class="text-zinc-400 hover:text-white lg:hidden"
			on:click={toggleMenu}
			aria-label="Toggle menu"
			type="button"
		>
			{#if mobileMenuOpen}
				<X class="h-5 w-5" />
			{:else}
				<Menu class="h-5 w-5" />
			{/if}
		</button>

		<!-- Global Search -->
		<form on:submit={handleSearch} class="mx-auto max-w-2xl flex-1">
			<div class="relative">
				<Search
					class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform {searchFocused
						? 'text-white'
						: 'text-zinc-500'} pointer-events-none"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					on:focus={() => (searchFocused = true)}
					on:blur={() => (searchFocused = false)}
					placeholder="Search users, gallery, archives..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
		</form>

		<!-- Desktop User Profile (compact) -->
		<div class="hidden items-center gap-3 lg:flex">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-white"
			>
				{user.username.charAt(0).toUpperCase()}
			</div>
		</div>
	</div>
</header>
