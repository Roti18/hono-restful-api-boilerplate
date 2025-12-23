<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<th
	class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-400 uppercase {className}"
>
	<slot />
</th>
