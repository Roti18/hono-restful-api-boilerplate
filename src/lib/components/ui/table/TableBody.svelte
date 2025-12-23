<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<tbody class="divide-y divide-zinc-800 {className}">
	<slot />
</tbody>
