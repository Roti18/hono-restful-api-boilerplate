<!-- src/lib/components/dashboard/StatsCard.svelte -->
<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let title: string;
	export let value: string;
	export let change: string;
</script>

<div
	class="rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-zinc-700"
>
	<div class="mb-4 flex items-center justify-between">
		<div class="rounded-lg bg-zinc-900 p-2 text-zinc-400">
			<svelte:component this={icon} class="h-5 w-5" />
		</div>
	</div>
	<div>
		<p class="mb-1 text-sm text-zinc-500">{title}</p>
		<p class="text-2xl font-bold text-white">{value}</p>
		<p class="mt-1 text-xs text-zinc-600">{change}</p>
	</div>
</div>
