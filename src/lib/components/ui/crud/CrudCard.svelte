<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	export let title: string;
	export let description: string = 'Fill in the details below';
	export let className: string = '';

	export { className as class }; // Allow custom classes
</script>

<Card class={className}>
	<div class="mb-6 flex items-center gap-4 border-b border-zinc-800 pb-6">
		<Button variant="ghost" size="icon" on:click>
			<ArrowLeft class="h-6 w-6" />
		</Button>
		<div>
			<h2 class="text-xl font-bold text-white">
				{title}
			</h2>
			<p class="text-sm text-zinc-500">{description}</p>
		</div>
	</div>
	<slot />
</Card>
