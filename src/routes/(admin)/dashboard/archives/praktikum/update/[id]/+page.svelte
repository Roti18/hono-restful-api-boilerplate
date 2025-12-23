<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let group = data.group;
	let title = group.title;
	let asprak = group.asprak || '';
	let loading = false;

	function handleCancel() {
		goto(`/dashboard/archives/mata-kuliah/${group.mataKuliahId}?tab=praktikum`);
	}
</script>

<div class="mx-auto max-w-2xl p-6">
	<button
		on:click={handleCancel}
		class="mb-6 flex items-center text-sm text-zinc-500 transition-colors hover:text-white"
	>
		<ArrowLeft class="mr-2 h-4 w-4" /> Back
	</button>

	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white">Edit Praktikum Group</h1>
		<p class="text-zinc-500">Update praktikum group details.</p>
	</div>

	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}
		class="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
	>
		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-zinc-400">Title</label>
			<Input
				type="text"
				id="title"
				name="title"
				bind:value={title}
				placeholder="e.g. Praktikum Modul A"
				required
			/>
		</div>

		<div>
			<label for="asprak" class="mb-2 block text-sm font-medium text-zinc-400"
				>Nama Asprak (Optional)</label
			>
			<Input
				type="text"
				id="asprak"
				name="asprak"
				bind:value={asprak}
				placeholder="e.g. Kak Budi"
			/>
		</div>

		<div class="flex justify-end gap-3 pt-4">
			<Button variant="outline" type="button" on:click={handleCancel}>Cancel</Button>
			<Button type="submit" disabled={loading}>
				{loading ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	</form>
</div>
