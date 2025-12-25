<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<tr class="transition-colors hover:bg-zinc-900 {className}">
	<slot />
</tr>
