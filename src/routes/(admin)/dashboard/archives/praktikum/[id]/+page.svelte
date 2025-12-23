<script lang="ts">
	import {
		Plus,
		Edit2,
		Trash2,
		ArrowLeft,
		Search,
		Image as ImageIcon,
		FileText,
		CheckSquare,
		GraduationCap,
		LayoutGrid
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';
	let activeTab: 'all' | 'materi' | 'tugas' | 'ujian' = 'all';

	$: group = data.praktikum;
	$: items = data.items || [];

	// Grouping Logic
	$: taskItems = items.filter((i: any) =>
		['tugas_praktikum', 'tugas_pra_praktikum', 'tugas_akhir_praktikum'].includes(i.type)
	);
	$: materialItems = items.filter((i: any) => i.type === 'materi');
	$: examItems = items.filter((i: any) => ['uts_praktikum', 'uas_praktikum'].includes(i.type));

	// Stats
	$: stats = {
		materi: materialItems.length,
		tugas: taskItems.length,
		ujian: examItems.length
	};

	// Filter List logic
	$: filteredItems = (() => {
		let list: any[] = [];
		if (activeTab === 'all') list = [...items];
		else if (activeTab === 'materi') list = materialItems;
		else if (activeTab === 'tugas') list = taskItems;
		else if (activeTab === 'ujian') list = examItems;

		return list.filter(
			(item) =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.type.toLowerCase().includes(searchQuery.toLowerCase())
		);
	})();

	function handleBack() {
		goto(`/dashboard/archives/mata-kuliah/${group.mataKuliahId}?tab=praktikum`);
	}

	function handleCreateItem() {
		// Smart Add: Pre-select type based on tab
		let typeParam = '';
		if (activeTab === 'materi') typeParam = '&type=materi';
		else if (activeTab === 'tugas')
			typeParam = '&type=tugas_praktikum'; // Default to standard tugas
		else if (activeTab === 'ujian') typeParam = '&type=uas_praktikum';

		goto(`/dashboard/archives/praktikum-item/create?praktikumId=${group.id}${typeParam}`);
	}

	function handleEditItem(id: number) {
		goto(`/dashboard/archives/praktikum-item/update/${id}`);
	}

	function handleDeleteItem(id: number) {
		goto(`/dashboard/archives/praktikum-item/delete/${id}`);
	}

	function formatType(type: string) {
		return type
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}
</script>

<svelte:head>
	<title>{group.title} - Praktikum</title>
</svelte:head>

<div class="min-h-screen space-y-6 p-6 lg:p-8">
	<!-- Subheader Back -->
	<button
		on:click={handleBack}
		class="flex items-center text-sm text-zinc-500 transition-colors hover:text-white"
	>
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to {group.mataKuliah?.name || 'Course'}
	</button>

	<!-- Header -->
	<div class="flex flex-col gap-4">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-3xl font-bold text-white">{group.title}</h1>
				<p class="mt-1 text-zinc-400">Asprak: {group.asprak || '-'}</p>
			</div>

			<button
				on:click={handleCreateItem}
				class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
			>
				<Plus class="h-4 w-4" />
				Add Entry
			</button>
		</div>

		<!-- Toolbar (Tabs & Search) -->
		<div
			class="flex flex-col items-center justify-between gap-4 border-b border-zinc-800 pb-1 sm:flex-row"
		>
			<div class="-mb-[1px] flex w-full gap-6 overflow-x-auto sm:w-auto">
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'all'
						? 'border-green-500 text-white'
						: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
					on:click={() => (activeTab = 'all')}
				>
					<LayoutGrid class="h-4 w-4" /> All
				</button>
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'materi'
						? 'border-blue-500 text-white'
						: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
					on:click={() => (activeTab = 'materi')}
				>
					<FileText class="h-4 w-4" /> Materi
					<span class="ml-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px]">{stats.materi}</span
					>
				</button>
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'tugas'
						? 'border-orange-500 text-white'
						: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
					on:click={() => (activeTab = 'tugas')}
				>
					<CheckSquare class="h-4 w-4" /> Tugas
					<span class="ml-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px]">{stats.tugas}</span>
				</button>
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'ujian'
						? 'border-red-500 text-white'
						: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
					on:click={() => (activeTab = 'ujian')}
				>
					<GraduationCap class="h-4 w-4" /> Ujian
					<span class="ml-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px]">{stats.ujian}</span>
				</button>
			</div>

			<div class="relative mb-2 w-full sm:mb-0 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search entries..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
		</div>
	</div>

	<!-- Content Grid -->
	<div class="min-h-[300px]">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredItems as item (item.id)}
				<div
					class="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700"
				>
					<!-- Visual / Preview -->
					<div class="relative aspect-video overflow-hidden bg-zinc-900">
						{#if item.heroImageWebpUrl}
							<img
								src={item.heroImageWebpUrl}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center text-zinc-700">
								<ImageIcon class="h-8 w-8" />
							</div>
						{/if}

						<!-- Badge -->
						<span
							class="absolute bottom-2 left-2 rounded border border-white/10 bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm"
						>
							{formatType(item.type)}
						</span>
					</div>

					<!-- Content -->
					<div class="p-3">
						<h3 class="mb-1 truncate text-sm font-medium text-white" title={item.title}>
							{item.title}
						</h3>
					</div>

					<!-- Actions -->
					<div
						class="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<button
							on:click|stopPropagation={() => handleEditItem(item.id)}
							class="rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
							aria-label="Edit"
						>
							<Edit2 class="h-3 w-3" />
						</button>
						<button
							on:click|stopPropagation={() => handleDeleteItem(item.id)}
							class="rounded-full bg-red-900/50 p-1.5 text-red-200 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
							aria-label="Delete"
						>
							<Trash2 class="h-3 w-3" />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredItems.length === 0}
				<div
					class="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-12 text-center text-zinc-500"
				>
					<p>No items found in {activeTab === 'all' ? 'this group' : activeTab + ' section'}.</p>
					{#if activeTab !== 'all'}
						<button on:click={handleCreateItem} class="mt-2 text-green-400 hover:text-green-300">
							Create new {activeTab}
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
