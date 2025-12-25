<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Form Components
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';

	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	let isSubmitting = false;

	// Type of item we are editing
	let type = data.targetType || 'semester'; // Default, though usually passed
	let id = data.targetId;

	// Find the item to edit
	let item: any;

	// Form Data States
	let formSemester = { name: '', startYear: 0, endYear: 0 };
	let formMataKuliah = { semesterId: 0, name: '', code: '', dosen: '', jam: '' };
	let formAcademicItem = {
		mataKuliahId: 0,
		type: 'tugas',
		title: '',
		links: [{ url: '', platform: '' }]
	};

	$: semesters = data.semesters || [];
	$: mataKuliahs = data.mataKuliahs || [];
	$: academicItems = data.academicItems || [];

	// Populate form data on mount or when data changes
	$: if (type === 'semester') {
		item = semesters.find((s: any) => s.id === id);
		if (item) {
			formSemester = {
				name: item.name,
				startYear: item.startYear,
				endYear: item.endYear
			};
		}
	} else if (type === 'mataKuliah') {
		item = mataKuliahs.find((m: any) => m.id === id);
		if (item) {
			formMataKuliah = {
				semesterId: item.semesterId,
				name: item.name,
				code: item.code || '',
				dosen: item.dosen,
				jam: item.jam
			};
		}
	} else if (type === 'academicItem') {
		item = academicItems.find((a: any) => a.id === id);
		if (item) {
			formAcademicItem = {
				mataKuliahId: item.mataKuliahId,
				type: item.type,
				title: item.title,
				links:
					item.links && item.links.length > 0
						? [{ url: item.links[0].url, platform: item.links[0].platform || '' }]
						: [{ url: '', platform: '' }]
			};
		}
	}

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
		const itemTypeLabel =
			type === 'semester' ? 'Semester' : type === 'mataKuliah' ? 'Mata Kuliah' : 'Academic Item';
		return `Edit ${itemTypeLabel}`;
	}
</script>

<div class="space-y-6">
	<CrudCard title={getCardTitle()} on:click={handleCancel}>
		{#if !item}
			<div class="py-8 text-center text-zinc-500">Item not found or loading...</div>
		{:else if type === 'semester'}
			<!-- SEMESTER FORM -->
			<FormWrapper action="?/updateSemester" submitHandler={getSubmitHandler()}>
				<input type="hidden" name="id" value={id} />
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
		{:else if type === 'mataKuliah'}
			<!-- MATA KULIAH FORM -->
			<FormWrapper action="?/updateMataKuliah" submitHandler={getSubmitHandler()}>
				<input type="hidden" name="id" value={id} />
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
		{:else if type === 'academicItem'}
			<!-- ACADEMIC ITEM FORM -->
			<FormWrapper action="?/updateAcademicItem" submitHandler={getSubmitHandler()}>
				<input type="hidden" name="id" value={id} />
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

				<FormInput
					id="link"
					name="link"
					label="Link"
					type="url"
					bind:value={formAcademicItem.links[0].url}
					placeholder="https://..."
				/>

				<FormSelect
					id="linkPlatform"
					name="linkPlatform"
					label="Link Platform"
					bind:value={formAcademicItem.links[0].platform}
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
