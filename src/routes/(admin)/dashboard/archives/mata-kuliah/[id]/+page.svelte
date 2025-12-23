<script lang="ts">
	import {
		Plus,
		Edit2,
		Trash2,
		ArrowLeft,
		Search,
		Image as ImageIcon,
		BookOpen,
		FileQuestion,
		GraduationCap,
		Beaker,
		LayoutGrid
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';
	let activeTab: 'all' | 'materi' | 'tugas' | 'ujian' | 'praktikum' = 'all';

	$: course = data.course;
	$: items = data.items || [];
	$: praktikums = data.praktikums || [];

	// Grouping Logic
	$: materiItems = items.filter((i) => i.type === 'materi');
	$: tugasItems = items.filter((i) => i.type === 'tugas' || i.type === 'tugas_akhir');
	$: ujianItems = items.filter((i) => i.type === 'uts' || i.type === 'uas');

	// Stats
	$: stats = {
		materi: materiItems.length,
		tugas: tugasItems.length,
		ujian: ujianItems.length,
		praktikum: praktikums.length
	};

	// Filter based on Tab and Search
	$: filteredDisplayItems = (() => {
		let list: any[] = [];
		if (activeTab === 'all') list = [...items];
		else if (activeTab === 'materi') list = materiItems;
		else if (activeTab === 'tugas') list = tugasItems;
		else if (activeTab === 'ujian') list = ujianItems;

		// Search filter
		return list.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
	})();

	$: filteredPraktikums = praktikums.filter((p) =>
		p.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function handleBack() {
		goto(`/dashboard/archives/semester/${course.semesterId}`);
	}

	function handleCreateItem() {
		// Pre-select type based on active tab
		let typeParam = '';
		if (activeTab === 'materi') typeParam = '&type=materi';
		else if (activeTab === 'tugas') typeParam = '&type=tugas';
		else if (activeTab === 'ujian') typeParam = '&type=uts';

		goto(`/dashboard/archives/academic-item/create?mataKuliahId=${course.id}${typeParam}`);
	}

	function handleEditItem(id: number) {
		goto(`/dashboard/archives/academic-item/update/${id}`);
	}

	function handleDeleteItem(id: number) {
		goto(`/dashboard/archives/academic-item/delete/${id}`);
	}

	function formatType(type: string) {
		return type
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}
</script>

<svelte:head>
	<title>{course.name} - Items</title>
</svelte:head>

<div class="min-h-screen space-y-6 p-6 lg:p-8">
	<!-- Subheader Back -->
	<button
		on:click={handleBack}
		class="flex items-center text-sm text-zinc-500 transition-colors hover:text-white"
	>
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to {course.semester?.name || 'Semester'}
	</button>

	<!-- Header -->
	<div class="flex flex-col gap-4">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-3xl font-bold text-white">{course.name}</h1>
				<p class="mt-1 text-zinc-400">
					{course.dosen} • {course.jam}
				</p>
			</div>
			<!-- Add Button (Dynamic Context) -->
			{#if activeTab === 'praktikum'}
				<button
					on:click={() => goto(`/dashboard/archives/praktikum/create?mataKuliahId=${course.id}`)}
					class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
				>
					<Plus class="h-4 w-4" />
					New Group
				</button>
			{:else if activeTab !== 'all'}
				<button
					on:click={handleCreateItem}
					class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
				>
					<Plus class="h-4 w-4" />
					Add {activeTab}
				</button>
			{/if}
		</div>

		<!-- Tabs & Search Toolbar -->
		<div
			class="flex flex-col items-center justify-between gap-4 border-b border-zinc-800 pb-1 sm:flex-row"
		>
			<div class="-mb-[1px] flex w-full gap-6 overflow-x-auto sm:w-auto">
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'all'
						? 'border-indigo-500 text-white'
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
					<BookOpen class="h-4 w-4" /> Materi
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
					<FileQuestion class="h-4 w-4" /> Tugas
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
				<button
					class="flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors {activeTab ===
					'praktikum'
						? 'border-green-500 text-white'
						: 'border-transparent text-zinc-500 hover:text-zinc-300'}"
					on:click={() => (activeTab = 'praktikum')}
				>
					<Beaker class="h-4 w-4" /> Praktikum
					<span class="ml-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px]"
						>{stats.praktikum}</span
					>
				</button>
			</div>

			<div class="relative mb-2 w-full sm:mb-0 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
		</div>
	</div>

	<!-- Content Area -->
	<div class="min-h-[300px]">
		<!-- PRAKTIKUM VIEW -->
		{#if activeTab === 'praktikum'}
			{#if filteredPraktikums.length === 0}
				<div
					class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 p-12 text-center"
				>
					<Beaker class="mb-4 h-12 w-12 text-zinc-700" />
					<h3 class="text-lg font-medium text-white">No Praktikum Groups Groups</h3>
					<p class="mt-1 max-w-sm text-sm text-zinc-500">
						Create a group to start adding praktikum modules.
					</p>
					<button
						on:click={() => goto(`/dashboard/archives/praktikum/create?mataKuliahId=${course.id}`)}
						class="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
					>
						Create Group
					</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredPraktikums as praktikum (praktikum.id)}
						<div
							class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg transition-all hover:border-green-500/50 hover:bg-zinc-900"
						>
							<!-- Action Buttons -->
							<div
								class="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<button
									on:click|stopPropagation={() =>
										goto(`/dashboard/archives/praktikum/update/${praktikum.id}`)}
									class="rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
									title="Edit"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								<button
									on:click|stopPropagation={() =>
										goto(`/dashboard/archives/praktikum/delete/${praktikum.id}`)}
									class="rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:bg-red-700 hover:text-white"
									title="Delete"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>

							<!-- Card Content (clickable) -->
							<button
								class="w-full text-left"
								on:click={() => goto(`/dashboard/archives/praktikum/${praktikum.id}`)}
							>
								<div
									class="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10"
								>
									<Beaker class="h-24 w-24" />
								</div>
								<div class="relative z-10">
									<h3
										class="text-lg font-bold text-white transition-colors group-hover:text-green-400"
									>
										{praktikum.title}
									</h3>
									<p class="mt-1 text-sm font-medium text-zinc-400">
										Asprak: {praktikum.asprak || '-'}
									</p>
									<p class="mt-2 text-xs text-zinc-600">Click to manage modules</p>
								</div>
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- ACADEMIC ITEMS VIEW -->
		{:else if activeTab === 'all' && filteredDisplayItems.length === 0 && filteredPraktikums.length === 0}
			<div class="rounded-lg border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
				No items found in this course.
			</div>
		{:else}
			<!-- If ALL tab, maybe show a quick Summary of Praktikum if exists -->
			{#if activeTab === 'all' && filteredPraktikums.length > 0}
				<div class="mb-8">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-lg font-semibold text-white">
							<Beaker class="h-4 w-4 text-green-500" /> Praktikum
						</h2>
						<button
							on:click={() => (activeTab = 'praktikum')}
							class="text-xs text-green-400 hover:text-green-300">View All</button
						>
					</div>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each filteredPraktikums.slice(0, 3) as praktikum}
							<button
								class="rounded border border-zinc-800 bg-zinc-900 p-4 text-left hover:border-zinc-700"
								on:click={() => goto(`/dashboard/archives/praktikum/${praktikum.id}`)}
							>
								<h3 class="text-sm font-bold text-white">{praktikum.title}</h3>
							</button>
						{/each}
					</div>
				</div>
				<div class="my-8 border-t border-zinc-800"></div>
			{/if}

			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each filteredDisplayItems as item (item.id)}
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
							<div class="mt-2 flex items-center justify-between">
								<div class="mt-2 flex items-center justify-between">
									{#if item.links && item.links.length > 0}
										<a
											href={item.links[0].url}
											target="_blank"
											class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline"
										>
											Launch {item.links[0].platform || 'Link'}
											{#if item.links.length > 1}
												<span class="text-zinc-600">+{item.links.length - 1}</span>
											{/if}
										</a>
									{:else}
										<span class="text-xs text-zinc-600">No link</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Actions -->
						<div
							class="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<button
								on:click|stopPropagation={() => handleEditItem(item.id)}
								class="rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
							>
								<Edit2 class="h-3 w-3" />
							</button>
							<button
								on:click|stopPropagation={() => handleDeleteItem(item.id)}
								class="rounded-full bg-red-900/50 p-1.5 text-red-200 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
							>
								<Trash2 class="h-3 w-3" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
