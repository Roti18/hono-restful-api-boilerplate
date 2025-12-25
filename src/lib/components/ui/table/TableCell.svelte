<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<td class="px-6 py-4 text-sm text-zinc-400 {className}" {...$$restProps}>
	<slot />
</td>
