<script lang="ts">
	import { page } from '$app/stores';
	import { Layers, Users, Clock, Image, BookOpen, LogOut } from '@lucide/svelte';
	import type { User } from '$lib/types/user';
	import type { NavItem } from '$lib/types/common';

	export let user: User;

	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: Layers, label: 'Overview' },
		{ href: '/dashboard/users', icon: Users, label: 'Users' },
		{ href: '/dashboard/sessions', icon: Clock, label: 'Sessions' },
		{ href: '/dashboard/gallery', icon: Image, label: 'Gallery' },
		{ href: '/dashboard/archives', icon: BookOpen, label: 'Archives' }
	];

	function isActive(href: string, currentPath: string): boolean {
		const normalizedPath =
			currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;
		const normalizedHref = href.endsWith('/') && href.length > 1 ? href.slice(0, -1) : href;

		if (normalizedHref === '/dashboard') {
			return normalizedPath === '/dashboard';
		}
		return normalizedPath.startsWith(normalizedHref);
	}

	function handleLogout(): void {
		// TODO: Implement proper logout with API call
		window.location.href = '/login';
	}
</script>

<aside class="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
	<!-- Logo -->
	<div class="border-b border-zinc-800 p-5">
		<a href="/" class="block">
			<h1 class="text-xl font-bold text-white">CAMPUS LIFE</h1>
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 space-y-1 p-4">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {isActive(
					item.href,
					$page.url.pathname
				)
					? 'bg-white text-black'
					: 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}"
			>
				<svelte:component this={item.icon} class="h-4 w-4" />
				{item.label}
			</a>
		{/each}
	</nav>

	<!-- User Profile -->
	<div class="border-t border-zinc-800 p-4">
		<div class="mb-3 flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white"
			>
				{user.username.charAt(0).toUpperCase()}
			</div>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-white">{user.username}</p>
				<p class="truncate text-xs text-zinc-500">{user.email}</p>
			</div>
		</div>

		<button
			on:click={handleLogout}
			class="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
		>
			<LogOut class="h-4 w-4" />
			Logout
		</button>
	</div>
</aside>
