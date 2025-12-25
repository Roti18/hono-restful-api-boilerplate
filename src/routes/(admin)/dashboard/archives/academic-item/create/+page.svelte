<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button, Input, Select, Textarea } from '$lib/components/ui';
	import {
		Plus,
		Trash2,
		GripVertical,
		Image as ImageIcon,
		Type,
		Link as LinkIcon,
		ArrowUp,
		ArrowDown
	} from '@lucide/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function handleCancel() {
		if (selectedMataKuliahId) {
			goto(`/dashboard/archives/mata-kuliah/${selectedMataKuliahId}`);
		} else {
			goto('/dashboard/archives');
		}
	}

	// Pre-fill mataKuliahId from URL
	let selectedMataKuliahId = $page.url.searchParams.get('mataKuliahId')
		? parseInt($page.url.searchParams.get('mataKuliahId')!)
		: data.mataKuliahs?.[0]?.id || 0;

	let types = [
		{ value: 'tugas', label: 'Tugas' },
		{ value: 'materi', label: 'Materi' },
		{ value: 'uas', label: 'UAS' },
		{ value: 'uts', label: 'UTS' },
		{ value: 'tugas_akhir', label: 'Tugas Akhir' }
	];
	let selectedType = $page.url.searchParams.get('type') || 'tugas';

	// State
	let title = '';
	let heroImageFiles: FileList;
	let loading = false;

	// Links Builder
	let links: { title: string; url: string; platform: string }[] = [];
	function addLink() {
		links = [...links, { title: '', url: '', platform: 'other' }];
	}
	function removeLink(index: number) {
		links = links.filter((_, i) => i !== index);
	}

	// Content Block Builder
	type Block = {
		tempId: string; // Unique ID for keying & image mapping
		type: 'text' | 'image';
		content: string; // text content
		caption: string; // image caption
		width: 'full' | 'half' | 'third';
		file?: File; // for preview
		previewUrl?: string;
	};

	let blocks: Block[] = [];

	function addTextBlock() {
		blocks = [
			...blocks,
			{
				tempId: crypto.randomUUID(),
				type: 'text',
				content: '',
				caption: '',
				width: 'full'
			}
		];
	}

	function addImageBlock() {
		blocks = [
			...blocks,
			{
				tempId: crypto.randomUUID(),
				type: 'image',
				content: '',
				caption: '',
				width: 'full'
			}
		];
	}

	function removeBlock(index: number) {
		blocks = blocks.filter((_, i) => i !== index);
	}

	function moveBlock(index: number, direction: 'up' | 'down') {
		if (direction === 'up' && index > 0) {
			const newBlocks = [...blocks];
			[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
			blocks = newBlocks;
		} else if (direction === 'down' && index < blocks.length - 1) {
			const newBlocks = [...blocks];
			[newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
			blocks = newBlocks;
		}
	}

	function handleBlockImageSelect(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				blocks[index].previewUrl = e.target?.result as string;
				blocks[index].file = file;
				blocks = blocks; // trigger update
			};
			reader.readAsDataURL(file);
		}
	}

	// Form Submission Preparation
	// We need to inject JSON strings into hidden inputs
	// And also ensure file inputs for blocks are associated (Svelte Kit actions handle form data, but dynamically added file inputs need care)
	// Actually, simply putting <input type="file" name="block_image_{tempId}" /> inside the block loop works perfectly with standard FormData submission!
	// We just need to ensure the JSON 'blocks' array contains the 'tempId' so the server can match.
</script>

<div class="mx-auto max-w-4xl p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-white">Create Academic Item</h1>
		<p class="text-zinc-500">Add a new task, material, or exam archive.</p>
	</div>

	<form
		method="POST"
		action="?/create"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}
		class="space-y-8"
	>
		<!-- JSON Data Injection -->
		<input type="hidden" name="links" value={JSON.stringify(links)} />
		<input
			type="hidden"
			name="blocks"
			value={JSON.stringify(
				blocks.map((b) => ({
					type: b.type,
					content: b.content,
					caption: b.caption,
					width: b.width,
					tempId: b.tempId
				}))
			)}
		/>

		<!-- 1. Basic Info -->
		<div class="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
			<h2 class="text-lg font-semibold text-white">Basic Info</h2>

			<div>
				<label for="title" class="mb-2 block text-sm font-medium text-zinc-400">Title</label>
				<Input
					id="title"
					type="text"
					name="title"
					bind:value={title}
					placeholder="e.g. Pertemuan 1: Kontrak Kuliah"
					required
				/>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="mataKuliahId" class="mb-2 block text-sm font-medium text-zinc-400"
						>Mata Kuliah</label
					>
					<Select id="mataKuliahId" name="mataKuliahId" bind:value={selectedMataKuliahId}>
						{#if data.mataKuliahs}
							{#each data.mataKuliahs as mk}
								<option value={mk.id}>{mk.name} ({mk.semester?.name || '-'})</option>
							{/each}
						{/if}
					</Select>
				</div>
				<div>
					<label for="type" class="mb-2 block text-sm font-medium text-zinc-400">Type</label>
					<Select id="type" name="type" bind:value={selectedType}>
						{#each types as t}
							<option value={t.value}>{t.label}</option>
						{/each}
					</Select>
				</div>
			</div>

			<div>
				<label for="heroImage" class="mb-2 block text-sm font-medium text-zinc-400"
					>Hero Image (Cover)</label
				>
				<input
					id="heroImage"
					type="file"
					name="heroImage"
					accept="image/*"
					bind:files={heroImageFiles}
					class="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
				/>
			</div>
		</div>

		<!-- 2. Links -->
		<div class="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">Attachments / Links</h2>
				<Button type="button" variant="outline" size="sm" on:click={addLink}>
					<Plus class="mr-2 h-3 w-3" /> Add Link
				</Button>
			</div>

			{#if links.length === 0}
				<p class="text-sm text-zinc-600 italic">No links added.</p>
			{:else}
				<div class="space-y-3">
					{#each links as link, i}
						<div class="flex items-start gap-2">
							<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
								<Input
									type="text"
									placeholder="Link Title (e.g. Google Drive)"
									bind:value={link.title}
								/>
								<Input type="text" placeholder="URL (https://...)" bind:value={link.url} />
							</div>
							<button
								type="button"
								class="p-2 text-zinc-500 hover:text-red-500"
								on:click={() => removeLink(i)}
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 3. Content Builder -->
		<div class="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">Content Builder</h2>
				<div class="flex gap-2">
					<Button type="button" variant="outline" size="sm" on:click={addTextBlock}>
						<Type class="mr-2 h-3 w-3" /> Text
					</Button>
					<Button type="button" variant="outline" size="sm" on:click={addImageBlock}>
						<ImageIcon class="mr-2 h-3 w-3" /> Image
					</Button>
				</div>
			</div>

			{#if blocks.length === 0}
				<div
					class="rounded-lg border-2 border-dashed border-zinc-800 p-8 text-center text-zinc-600"
				>
					Add content blocks to build your page.
				</div>
			{:else}
				<div class="space-y-4">
					{#each blocks as block, i (block.tempId)}
						<div
							class="group relative rounded-lg border border-zinc-700 bg-zinc-950 p-4 transition-all hover:border-zinc-500"
						>
							<!-- Block Header (Sort/Delete) -->
							<div
								class="absolute top-2 right-2 flex gap-1 opacity-50 transition-opacity group-hover:opacity-100"
							>
								<button
									type="button"
									class="p-1 hover:text-white"
									on:click={() => moveBlock(i, 'up')}
									disabled={i === 0}
								>
									<ArrowUp class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="p-1 hover:text-white"
									on:click={() => moveBlock(i, 'down')}
									disabled={i === blocks.length - 1}
								>
									<ArrowDown class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="ml-2 p-1 text-red-500 hover:text-red-400"
									on:click={() => removeBlock(i)}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>

							<p class="mb-2 font-mono text-xs tracking-wide text-zinc-500 uppercase">
								Block {i + 1}: {block.type}
							</p>

							<!-- TEXT BLOCK -->
							{#if block.type === 'text'}
								<Textarea
									placeholder="Write your content here..."
									bind:value={block.content}
									rows={4}
									aria-label="Content"
								/>

								<!-- IMAGE BLOCK -->
							{:else if block.type === 'image'}
								<div class="flex flex-col gap-4 md:flex-row">
									<div class="flex-1 space-y-3">
										<!-- File Input (Hidden Name is key!) -->
										<input
											type="file"
											name={`block_image_${block.tempId}`}
											accept="image/*"
											on:change={(e) => handleBlockImageSelect(e, i)}
											class="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
										/>
										<Input
											type="text"
											placeholder="Caption (optional)"
											bind:value={block.caption}
										/>

										<!-- Width Selector -->
										<div class="flex items-center gap-2 text-sm text-zinc-400">
											<span>Width:</span>
											<button
												type="button"
												class:text-white={block.width === 'full'}
												class="rounded px-2 py-1 hover:bg-zinc-800"
												on:click={() => (blocks[i].width = 'full')}>Full</button
											>
											<button
												type="button"
												class:text-white={block.width === 'half'}
												class="rounded px-2 py-1 hover:bg-zinc-800"
												on:click={() => (blocks[i].width = 'half')}>1/2</button
											>
											<button
												type="button"
												class:text-white={block.width === 'third'}
												class="rounded px-2 py-1 hover:bg-zinc-800"
												on:click={() => (blocks[i].width = 'third')}>1/3</button
											>
										</div>
									</div>

									<!-- Preview -->
									<div
										class="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 md:w-48"
									>
										{#if block.previewUrl}
											<img
												src={block.previewUrl}
												alt="Preview"
												class="h-full w-full object-cover"
											/>
										{:else}
											<ImageIcon class="h-8 w-8 text-zinc-700" />
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex justify-end gap-3 pt-4">
			<Button variant="outline" type="button" on:click={handleCancel}>Cancel</Button>
			<Button type="submit" disabled={loading}>
				{loading ? 'Creating...' : 'Create Item'}
			</Button>
		</div>
	</form>
</div>
