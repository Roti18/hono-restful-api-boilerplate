<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import { AlertTriangle } from '@lucide/svelte';

	import { toast } from '$lib/stores/toast';

	export let itemName: string;
	export let cancelPath: string;
	export let title: string = 'Confirm Delete';
	export let descriptionPrefix: string = 'Are you sure you want to delete';
	export let buttonText: string = 'Delete';
	export let processingText: string = 'Deleting...';

	let isSubmitting = false;

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Deleted successfully');
					await goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto(cancelPath);
	}
</script>

<div
	class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
>
	<Card class="relative w-full max-w-md border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
		<!-- Decoration Gradient -->
		<div
			class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-80"
		></div>

		<div class="flex flex-col items-center text-center">
			<!-- Icon Wrapper -->
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20"
			>
				<AlertTriangle class="h-8 w-8 text-red-500" />
			</div>

			<h2 class="mb-2 text-xl font-bold text-white">{title}</h2>

			<p class="mb-8 text-sm leading-relaxed text-zinc-400">
				{descriptionPrefix} <span class="font-semibold text-white">"{itemName}"</span>?
				<br />
				This action cannot be undone.
			</p>

			<div class="grid w-full grid-cols-2 gap-3">
				<Button variant="outline" class="w-full" on:click={handleCancel} disabled={isSubmitting}>
					Cancel
				</Button>
				<FormWrapper action="?" submitHandler={getSubmitHandler()} class="w-full">
					<FormButton variant="destructive" type="submit" disabled={isSubmitting} class="w-full">
						{isSubmitting ? processingText : buttonText}
					</FormButton>
				</FormWrapper>
			</div>
		</div>
	</Card>
</div>
