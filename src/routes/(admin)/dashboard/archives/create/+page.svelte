<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Form Components
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';

	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	let isSubmitting = false;

	// Determine active tab from query param or default to semesters
	let activeTab = $page.url.searchParams.get('tab') || 'semesters';

	// Form Data States
	let formSemester = {
		name: '',
		startYear: new Date().getFullYear(),
		endYear: new Date().getFullYear() + 1
	};
	let formMataKuliah = { semesterId: 0, name: '', code: '', dosen: '', jam: '' };
	let formAcademicItem = { mataKuliahId: 0, type: 'tugas', title: '', link: '', linkPlatform: '' };

	$: semesters = data?.semesters || [];
	$: mataKuliahs = data?.mataKuliahs || [];

	const academicTypes = ['tugas', 'uts', 'uas', 'materi', 'tugas_akhir'];
	const linkPlatforms = ['gdrive', 'figma', 'pdf', 'github', 'notion', 'other'];

	function formatTypeName(str: string): string {
		if (!str) return 'Unknown';
		return str
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/archives');
	}

	function getCardTitle(): string {
		const item =
			activeTab === 'semesters'
				? 'Semester'
				: activeTab === 'mataKuliahs'
					? 'Mata Kuliah'
					: 'Academic Item';
		return `Create New ${item}`;
	}
</script>

<div class="space-y-6">
	<!-- Tab Selector for Creation Type -->
	<div class="flex gap-2 border-b border-zinc-800 pb-4">
		<button
			type="button"
			class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'semesters'
				? 'border-b-2 border-white text-white'
				: 'text-zinc-500 hover:text-white'}"
			on:click={() => (activeTab = 'semesters')}
		>
			Semester
		</button>
		<button
			type="button"
			class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'mataKuliahs'
				? 'border-b-2 border-white text-white'
				: 'text-zinc-500 hover:text-white'}"
			on:click={() => (activeTab = 'mataKuliahs')}
		>
			Mata Kuliah
		</button>
		<button
			type="button"
			class="px-4 py-2 text-sm font-medium transition-colors {activeTab === 'academicItems'
				? 'border-b-2 border-white text-white'
				: 'text-zinc-500 hover:text-white'}"
			on:click={() => (activeTab = 'academicItems')}
		>
			Academic Item
		</button>
	</div>

	<CrudCard title={getCardTitle()} on:click={handleCancel}>
		<!-- SEMESTER FORM -->
		{#if activeTab === 'semesters'}
			<FormWrapper action="?/createSemester" submitHandler={getSubmitHandler()}>
				<FormInput
					id="name"
					name="name"
					label="Name"
					bind:value={formSemester.name}
					placeholder="e.g., Semester 3"
					required
				/>

				<div class="grid grid-cols-2 gap-6">
					<FormInput
						id="startYear"
						name="startYear"
						label="Start Year"
						type="number"
						bind:value={formSemester.startYear}
						required
					/>
					<FormInput
						id="endYear"
						name="endYear"
						label="End Year"
						type="number"
						bind:value={formSemester.endYear}
						required
					/>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
					<FormButton type="submit" disabled={isSubmitting}>
						<Save class="mr-2 h-4 w-4" />
						{isSubmitting ? 'Saving...' : 'Save Changes'}
					</FormButton>
				</div>
			</FormWrapper>

			<!-- MATA KULIAH FORM -->
		{:else if activeTab === 'mataKuliahs'}
			<FormWrapper action="?/createMataKuliah" submitHandler={getSubmitHandler()}>
				<FormSelect
					id="semesterId"
					name="semesterId"
					label="Semester"
					bind:value={formMataKuliah.semesterId}
					required
				>
					{#each semesters as semester}
						<option value={semester.id}>{semester.name}</option>
					{/each}
				</FormSelect>

				<FormInput
					id="mkName"
					name="name"
					label="Name"
					bind:value={formMataKuliah.name}
					placeholder="e.g., Basis Data"
					required
				/>

				<FormInput
					id="code"
					name="code"
					label="Code"
					bind:value={formMataKuliah.code}
					placeholder="e.g., IF1234"
				/>

				<FormInput
					id="dosen"
					name="dosen"
					label="Dosen"
					bind:value={formMataKuliah.dosen}
					placeholder="e.g., Dr. John Doe"
					required
				/>

				<FormInput
					id="jam"
					name="jam"
					label="Jam"
					bind:value={formMataKuliah.jam}
					placeholder="e.g., Senin 13:00–15:30"
					required
				/>

				<div class="flex justify-end gap-3 pt-4">
					<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
					<FormButton type="submit" disabled={isSubmitting}>
						<Save class="mr-2 h-4 w-4" />
						{isSubmitting ? 'Saving...' : 'Save Changes'}
					</FormButton>
				</div>
			</FormWrapper>

			<!-- ACADEMIC ITEM FORM -->
		{:else}
			<FormWrapper
				action="?/createAcademicItem"
				submitHandler={getSubmitHandler()}
				enctype="multipart/form-data"
			>
				<FormSelect
					id="mataKuliahId"
					name="mataKuliahId"
					label="Mata Kuliah"
					bind:value={formAcademicItem.mataKuliahId}
					required
				>
					{#each mataKuliahs as mk}
						<option value={mk.id}>{mk.name}</option>
					{/each}
				</FormSelect>

				<FormSelect id="type" name="type" label="Type" bind:value={formAcademicItem.type} required>
					{#each academicTypes as type}
						<option value={type}>{formatTypeName(type)}</option>
					{/each}
				</FormSelect>

				<FormInput
					id="title"
					name="title"
					label="Title"
					bind:value={formAcademicItem.title}
					placeholder="e.g., Tugas 1 - ERD Design"
					required
				/>

				<!-- Hero Image Upload -->
				<div class="mb-4">
					<label for="heroImage" class="mb-2 block text-sm font-medium text-zinc-300"
						>Hero Image (Optional)</label
					>
					<input
						type="file"
						id="heroImage"
						name="heroImage"
						accept="image/png, image/jpeg, image/jpg, image/heic"
						class="w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
					/>
				</div>

				<FormInput
					id="link"
					name="link"
					label="Link"
					type="url"
					bind:value={formAcademicItem.link}
					placeholder="https://..."
				/>

				<FormSelect
					id="linkPlatform"
					name="linkPlatform"
					label="Link Platform"
					bind:value={formAcademicItem.linkPlatform}
				>
					<option value="">Select platform...</option>
					{#each linkPlatforms as platform}
						<option value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
					{/each}
				</FormSelect>

				<div class="flex justify-end gap-3 pt-4">
					<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
					<FormButton type="submit" disabled={isSubmitting}>
						<Save class="mr-2 h-4 w-4" />
						{isSubmitting ? 'Saving...' : 'Save Changes'}
					</FormButton>
				</div>
			</FormWrapper>
		{/if}
	</CrudCard>
</div>
