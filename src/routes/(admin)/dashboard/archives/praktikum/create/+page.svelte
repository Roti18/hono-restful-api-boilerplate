<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function handleCancel() {
		if (selectedMataKuliahId) {
			goto(`/dashboard/archives/mata-kuliah/${selectedMataKuliahId}?tab=praktikum`);
		} else {
			goto('/dashboard/archives');
		}
	}

	let selectedMataKuliahId = $page.url.searchParams.get('mataKuliahId')
		? parseInt($page.url.searchParams.get('mataKuliahId')!)
		: data.mataKuliahs?.[0]?.id || 0;

	let title = '';
	let asprak = '';
	let loading = false;
</script>

<div class="mx-auto max-w-2xl p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white">Create Praktikum Group</h1>
		<p class="text-zinc-500">
			Create a new group for praktikum modules (e.g. "Modul 1", "Praktikum Jaringan").
		</p>
	</div>

	<form
		method="POST"
		action="?/create"
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

		<div>
			<label for="mataKuliahId" class="mb-2 block text-sm font-medium text-zinc-400"
				>Mata Kuliah</label
			>
			<select
				id="mataKuliahId"
				name="mataKuliahId"
				bind:value={selectedMataKuliahId}
				class="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
			>
				{#if data.mataKuliahs}
					{#each data.mataKuliahs as mk}
						<option value={mk.id}>{mk.name} ({mk.semester?.name || '-'})</option>
					{/each}
				{/if}
			</select>
		</div>

		<div class="flex justify-end gap-3 pt-4">
			<Button variant="outline" type="button" on:click={handleCancel}>Cancel</Button>
			<Button type="submit" disabled={loading}>
				{loading ? 'Creating...' : 'Create Group'}
			</Button>
		</div>
	</form>
</div>
