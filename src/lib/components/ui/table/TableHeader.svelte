<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<thead class="border-b border-zinc-800 bg-zinc-900 {className}">
	<slot />
</thead>
