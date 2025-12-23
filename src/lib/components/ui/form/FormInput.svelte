<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	export let label: string;
	export let id: string;
	export let name: string;
	export let value: string | number;
	export let placeholder: string = '';
	export let required: boolean = false;
	export let type: string = 'text';

	let className: string = '';
	export { className as class };
</script>

<div>
	<label for={id} class="mb-2 block text-sm font-medium text-zinc-300">
		{label}
	</label>
	<Input
		{type}
		{id}
		{name}
		bind:value
		{placeholder}
		{required}
		class={className}
		{...$$restProps}
	/>
</div>
