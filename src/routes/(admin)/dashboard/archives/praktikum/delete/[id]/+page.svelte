<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { AlertTriangle } from '@lucide/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = false;

	function handleCancel() {
		goto(`/dashboard/archives/mata-kuliah/${data.group.mataKuliahId}?tab=praktikum`);
	}
</script>

<div class="mx-auto max-w-md p-6">
	<div class="rounded-lg border border-red-900/50 bg-red-950/30 p-6">
		<div class="flex items-start gap-4">
			<div class="rounded-full bg-red-900/50 p-3">
				<AlertTriangle class="h-6 w-6 text-red-400" />
			</div>
			<div class="flex-1">
				<h2 class="text-lg font-bold text-white">Delete Praktikum Group</h2>
				<p class="mt-2 text-sm text-zinc-400">
					Are you sure you want to delete "<span class="font-medium text-white"
						>{data.group.title}</span
					>"?
				</p>
				<p class="mt-2 text-sm font-medium text-red-400">
					Warning: This will also delete all praktikum items inside this group!
				</p>
			</div>
		</div>

		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					update();
				};
			}}
			class="mt-6 flex justify-end gap-3"
		>
			<Button variant="outline" type="button" on:click={handleCancel}>Cancel</Button>
			<Button type="submit" disabled={loading} class="bg-red-600 hover:bg-red-700">
				{loading ? 'Deleting...' : 'Delete Group'}
			</Button>
		</form>
	</div>
</div>
