<script lang="ts">
	import Select from '$lib/components/ui/Select.svelte';

	export let label: string;
	export let id: string;
	export let name: string;
	export let value: any;
	export let options: { value: any; label: string }[] = [];
	export let required: boolean = false;
	export let placeholder: string = 'Select an option';

	let className: string = '';
	export { className as class };
</script>

<div>
	<label for={id} class="mb-2 block text-sm font-medium text-zinc-300">
		{label}
	</label>
	<Select
		{id}
		{name}
		bind:value
		{options}
		{required}
		{placeholder}
		class={className}
		{...$$restProps}
	>
		<slot />
	</Select>
</div>
