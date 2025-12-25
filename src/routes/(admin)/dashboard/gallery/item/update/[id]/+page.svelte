<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import type { PageData } from './$types';

	import { toast } from '$lib/stores/toast';

	export let data: PageData;
	let isSubmitting = false;
	let item = data.item;
	let formItem = {
		groupId: item.groupId,
		title: item.title,
		description: item.description ?? '', // Fallback to empty string
		imageWebpUrl: item.imageWebpUrl,
		imageOriginalUrl: item.imageOriginalUrl ?? '',
		date: item.date || new Date().toISOString().split('T')[0]
	};

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Gallery Item updated successfully');
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

<CrudCard title="Edit Gallery Item" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()} enctype="multipart/form-data">
		<FormSelect
			id="groupId"
			name="groupId"
			label="Gallery Group (Optional)"
			value={formItem.groupId ?? ''}
			on:change={(e) => {
				const target = e.currentTarget as HTMLSelectElement;
				formItem.groupId = target.value ? parseInt(target.value) : null;
			}}
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

		<!-- Current Image Preview -->
		<div class="mb-4">
			<span class="mb-2 block text-sm font-medium text-zinc-300">Current Image</span>
			{#if formItem.imageWebpUrl}
				<div
					class="relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
				>
					<img
						src={formItem.imageWebpUrl}
						alt={formItem.title}
						class="h-full w-full object-cover"
					/>
				</div>
			{/if}
			<div class="mb-2 flex items-center gap-2">
				<span class="text-xs text-zinc-500">Original:</span>
				<a
					href={formItem.imageOriginalUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs text-blue-400 underline hover:text-blue-300"
				>
					View in Google Drive
				</a>
			</div>
		</div>

		<!-- File Input for Image Replacement -->
		<div class="mb-4">
			<label for="image" class="mb-2 block text-sm font-medium text-zinc-300"
				>Replace Image (Optional)</label
			>
			<input
				type="file"
				id="image"
				name="image"
				accept="image/png, image/jpeg, image/jpg, image/heic"
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
