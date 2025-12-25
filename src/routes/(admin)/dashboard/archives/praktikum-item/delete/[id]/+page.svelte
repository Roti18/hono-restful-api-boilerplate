<script lang="ts">
	import DeleteConfirmation from '$lib/components/ui/crud/DeleteConfirmation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<DeleteConfirmation
	itemName={data.item?.title || 'Unknown Item'}
	cancelPath={`/dashboard/archives/praktikum/${data.item?.praktikumId}`}
/>
