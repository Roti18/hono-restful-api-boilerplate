<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import type { PageData } from './$types';

	import { toast } from '$lib/stores/toast';

	export let data: PageData;
	let isSubmitting = false;
	let item = data.item;
	let semesters = data.semesters || [];

	let formMataKuliah = {
		semesterId: item.semesterId,
		name: item.name,
		code: item.code || '',
		dosen: item.dosen,
		jam: item.jam
	};

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Mata Kuliah updated successfully');
					await goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/archives?tab=mataKuliahs');
	}
</script>

<CrudCard title="Edit Mata Kuliah" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()}>
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
</CrudCard>
