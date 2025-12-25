<script lang="ts">
	import { onMount } from 'svelte';

	let time = '';

	onMount(() => {
		const update = () => {
			const d = new Date();
			time =
				String(d.getHours()).padStart(2, '0') +
				':' +
				String(d.getMinutes()).padStart(2, '0') +
				':' +
				String(d.getSeconds()).padStart(2, '0');
		};
		update();
		const i = setInterval(update, 1000);
		return () => clearInterval(i);
	});
</script>

<div class="fixed top-8 right-8 text-[0.7rem] tracking-[0.25em] text-neutral-500">
	{time}
</div>
