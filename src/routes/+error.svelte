<script>
	import { page } from '$app/stores';
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center bg-black text-center text-white"
>
	<div class="max-w-md space-y-4">
		<div class="mb-4 inline-flex items-center justify-center rounded-full bg-red-500/10 p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-red-500"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" x2="12" y1="8" y2="12" />
				<line x1="12" x2="12.01" y1="16" y2="16" />
			</svg>
		</div>
		<h1 class="text-4xl font-bold tracking-tight">{$page.status}</h1>
		<p class="text-zinc-400">{$page.error?.message || 'Something went wrong.'}</p>
		<div class="pt-4">
			<a
				href="/dashboard"
				class="inline-flex items-center rounded-lg bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-zinc-200"
			>
				Return to Dashboard
			</a>
		</div>
	</div>
</div>
