<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 {className}">
	<table class="w-full">
		<slot />
	</table>
</div>
