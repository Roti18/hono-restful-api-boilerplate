<script lang="ts">
	import { enhance } from '$app/forms';

	export let action: string;
	export let method: 'POST' | 'GET' | 'post' | 'get' = 'POST';
	export let useEnhance: boolean = true;
	// Explicit any to bypass SvelteKit type strictness issues across versions
	export let submitHandler: any;

	let className: string = '';
	export { className as class };

	function handleEnhance() {
		if (useEnhance && submitHandler) {
			return submitHandler;
		}
		return () => {};
	}
</script>

<form
	{method}
	{action}
	class="mx-auto max-w-2xl space-y-6 {className}"
	use:enhance={submitHandler}
	{...$$restProps}
>
	<slot />
</form>
