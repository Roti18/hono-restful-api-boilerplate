<script lang="ts">
	import { Plus, Edit2, Trash2, BookOpen, ArrowLeft, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';

	$: semester = data.semester;
	$: courses = data.courses || [];

	// Filter
	$: filteredCourses = courses.filter(
		(c: any) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.dosen.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function handleBack() {
		goto('/dashboard/archives');
	}

	function handleCreateCourse() {
		// Pass semesterId via query param to pre-fill the form
		goto(`/dashboard/archives/mata-kuliah/create?semesterId=${semester.id}`);
	}

	function handleEditCourse(id: number) {
		goto(`/dashboard/archives/mata-kuliah/update/${id}`);
	}

	function handleDeleteCourse(id: number) {
		goto(`/dashboard/archives/mata-kuliah/delete/${id}`);
	}

	function handleViewCourse(id: number) {
		goto(`/dashboard/archives/mata-kuliah/${id}`);
	}
</script>

<svelte:head>
	<title>{semester.name} - Courses</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Actions & Breadcrumb -->
	<button
		on:click={handleBack}
		class="flex items-center text-sm text-zinc-500 transition-colors hover:text-white"
	>
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to Semesters
	</button>

	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">{semester.name}</h1>
			<p class="mt-1 text-sm text-zinc-500">
				Period: {semester.startYear} - {semester.endYear}
			</p>
		</div>

		<div class="flex gap-3">
			<div class="relative flex-1 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search courses..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
			<button
				on:click={handleCreateCourse}
				class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				<Plus class="h-4 w-4" />
				New Course
			</button>
		</div>
	</div>

	<!-- Courses Grid -->
	<div>
		<h2 class="mb-4 text-lg font-semibold text-white">Mata Kuliah (Courses)</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCourses as course (course.id)}
				<div
					class="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700"
				>
					<!-- Clickable Area -->
					<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
					<div class="cursor-pointer p-6" on:click={() => handleViewCourse(course.id)}>
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900">
							<BookOpen class="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
						</div>
						<h3 class="mb-1 text-lg font-semibold text-white">{course.name}</h3>
						{#if course.code}
							<p class="mb-2 font-mono text-xs text-zinc-600">{course.code}</p>
						{/if}

						<div class="space-y-1">
							<p class="flex items-center gap-2 text-sm text-zinc-500">
								<span class="rounded bg-zinc-900 px-2 py-0.5 text-xs">Lecturer</span>
								{course.dosen}
							</p>
							<p class="flex items-center gap-2 text-sm text-zinc-500">
								<span class="rounded bg-zinc-900 px-2 py-0.5 text-xs">Schedule</span>
								{course.jam}
							</p>
						</div>
					</div>

					<!-- Actions -->
					<div
						class="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<button
							on:click|stopPropagation={() => handleEditCourse(course.id)}
							class="rounded-md bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
							aria-label="Edit"
						>
							<Edit2 class="h-4 w-4" />
						</button>
						<button
							on:click|stopPropagation={() => handleDeleteCourse(course.id)}
							class="rounded-md bg-zinc-900 p-2 text-zinc-400 hover:bg-red-900/30 hover:text-red-500"
							aria-label="Delete"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredCourses.length === 0}
				<div
					class="col-span-full rounded-lg border border-dashed border-zinc-800 p-8 text-center text-zinc-500"
				>
					No courses found in this semester.
				</div>
			{/if}
		</div>
	</div>
</div>
