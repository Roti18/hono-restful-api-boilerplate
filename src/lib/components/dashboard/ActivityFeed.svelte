<!-- src/lib/components/dashboard/ActivityFeed.svelte -->
<script lang="ts">
	import type { Activity } from '$lib/types/common';

	export let activities: Activity[] = [];
</script>

<div class="space-y-3">
	{#each activities as activity (activity.id || `${activity.user}-${activity.time}`)}
		<div class="flex items-start gap-3">
			<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900">
				<span class="text-xs font-medium text-zinc-400"
					>{activity.user.charAt(0).toUpperCase()}</span
				>
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-sm text-zinc-300">
					<span class="font-medium text-white">{activity.user}</span>
					{activity.action} <span class="font-medium text-white">{activity.target}</span>
				</p>
				<p class="mt-0.5 text-xs text-zinc-600">{activity.time}</p>
			</div>
		</div>
	{/each}

	{#if activities.length === 0}
		<p class="py-4 text-center text-sm text-zinc-500">No recent activity</p>
	{/if}
</div>
