<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' = 'primary';
	export let disabled: boolean = false;

	let className: string = '';
	export { className as class };
</script>

<Button {type} {variant} {disabled} class={className} on:click {...$$restProps}>
	<slot />
</Button>
