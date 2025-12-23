<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from '@lucide/svelte';

	// Map types to icons and colors
	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info,
		warning: AlertTriangle
	};

	const colors = {
		success: 'bg-zinc-900 border-green-500/50 text-green-500',
		error: 'bg-zinc-900 border-red-500/50 text-red-500',
		info: 'bg-zinc-900 border-blue-500/50 text-blue-500',
		warning: 'bg-zinc-900 border-orange-500/50 text-orange-500'
	};
</script>

<div class="fixed right-4 bottom-4 z-[9999] flex flex-col gap-2">
	{#each $toast as t (t.id)}
		<div
			in:fly={{ x: 20, duration: 300 }}
			out:fly={{ opacity: 0, duration: 200 }}
			class="flex min-w-[300px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm {colors[
				t.type
			]}"
		>
			<svelte:component this={icons[t.type]} class="h-5 w-5 shrink-0" />
			<p class="text-sm font-medium text-white">{t.message}</p>
			<button
				on:click={() => toast.remove(t.id)}
				class="ml-auto rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
			>
				<X class="h-4 w-4" />
			</button>
		</div>
	{/each}
</div>
