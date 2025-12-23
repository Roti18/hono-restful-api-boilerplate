<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import { toast } from '$lib/stores/toast';

	let isSubmitting = false;
	let formSemester = {
		name: '',
		startYear: new Date().getFullYear(),
		endYear: new Date().getFullYear() + 1
	};

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Semester created successfully');
					await goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/archives');
	}
</script>

<CrudCard title="Create New Semester" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()}>
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
</CrudCard>
