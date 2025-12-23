<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import { toast } from '$lib/stores/toast';

	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	import { page } from '$app/stores'; // Added import

	// ... exports

	let isSubmitting = false;
	// Pre-select group ID
	let initialGroupId = $page.url.searchParams.get('groupId') || '';

	let formItem = {
		groupId: initialGroupId,
		title: '',
		description: '',
		date: new Date().toISOString().split('T')[0]
	};

	// ... submit handler ...
	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Gallery Item created successfully');
					goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		if (formItem.groupId) {
			goto(`/dashboard/gallery/group/${formItem.groupId}`);
		} else {
			goto('/dashboard/gallery');
		}
	}
</script>

<CrudCard title="Create Gallery Item" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()} enctype="multipart/form-data">
		<FormSelect
			id="groupId"
			name="groupId"
			label="Gallery Group (Optional)"
			bind:value={formItem.groupId}
		>
			<option value="">-- No Group (Uncategorized) --</option>
			{#each data.groups as group}
				<option value={group.id}>{group.title}</option>
			{/each}
		</FormSelect>

		<FormInput
			id="title"
			name="title"
			label="Title"
			bind:value={formItem.title}
			placeholder="e.g., Class Photo"
			required
		/>

		<FormInput
			id="description"
			name="description"
			label="Description"
			bind:value={formItem.description}
			placeholder="Describe this item..."
		/>

		<!-- File Input for Image -->
		<div class="mb-4">
			<label for="image" class="mb-2 block text-sm font-medium text-zinc-300">Upload Image</label>
			<input
				type="file"
				id="image"
				name="image"
				accept="image/png, image/jpeg, image/jpg, image/heic"
				required
				class="w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
			/>
		</div>

		<FormInput id="date" name="date" label="Date" type="date" bind:value={formItem.date} required />

		<div class="flex justify-end gap-3 pt-4">
			<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
			<FormButton type="submit" disabled={isSubmitting}>
				<Save class="mr-2 h-4 w-4" />
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</FormButton>
		</div>
	</FormWrapper>
</CrudCard>
