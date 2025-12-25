import { Context } from 'hono'

export const landingPage = (c: Context) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Secure, High-Performance Hono API Boilerplate">
    <meta name="author" content="Roti18">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <title>Hono Security API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
              gray: {
                850: '#171717',
                900: '#111111',
                950: '#050505', 
              }
            }
          }
        }
      }
    </script>
    <style>
        body { background: #000000; color: #ededed; }
        .grid-bg { 
            background-image: linear-gradient(to right, #111 1px, transparent 1px),
                              linear-gradient(to bottom, #111 1px, transparent 1px);
            background-size: 24px 24px;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-white/20 relative">

    <!-- Subtle Grid Background -->
    <div class="fixed inset-0 grid-bg opacity-20 pointer-events-none z-[-1]"></div>

    <!-- Header -->
    <header class="h-16 border-b border-neutral-900 flex items-center justify-between px-6 md:px-12 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div class="flex items-center gap-4">
            <h1 class="font-semibold text-white tracking-tight">Hono API</h1>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">v1.0.0</span>
        </div>
        <nav class="flex gap-6 text-sm font-medium text-neutral-500">
             <a href="/docs/index.html" class="hover:text-white transition">Docs</a>
             <a href="/admin/db" class="hover:text-white transition">Database</a>
             <a href="https://github.com/Roti18" class="hover:text-white transition">GitHub</a>
        </nav>
    </header>

    <!-- Content -->
    <main class="flex-grow flex flex-col justify-center items-center text-center px-4 py-20">
        
        <div class="mb-6 font-mono text-xs text-neutral-500 bg-neutral-900/50 px-3 py-1 rounded border border-neutral-800">
            SECURE • STATELESS • TYPESAFE
        </div>

        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 max-w-4xl leading-tight">
            The Foundation for <br>
            text<span class="text-neutral-500">Modern APIs.</span>
        </h1>
        
        <p class="text-lg text-neutral-400 max-w-2xl mb-12 leading-relaxed">
            A production-ready boilerplate built for performance. <br>
            Powered by Hono, Turso, and TypeScript.
        </p>

        <div class="flex gap-4 mb-20">
            <a href="/docs/index.html" class="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition">
                Read Documentation
            </a>
            <a href="/api/health" class="px-8 py-3 bg-black border border-neutral-800 text-white font-semibold rounded hover:border-neutral-600 transition">
                Health Check
            </a>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
            <div class="p-6 border border-neutral-900 rounded bg-black/50 hover:border-neutral-700 transition group">
                <div class="font-mono text-xs text-neutral-500 mb-2 group-hover:text-neutral-300">FRAMEWORK</div>
                <div class="text-xl font-bold text-white">Hono</div>
            </div>
            <div class="p-6 border border-neutral-900 rounded bg-black/50 hover:border-neutral-700 transition group">
                <div class="font-mono text-xs text-neutral-500 mb-2 group-hover:text-neutral-300">DATABASE</div>
                <div class="text-xl font-bold text-white">Turso</div>
            </div>
            <div class="p-6 border border-neutral-900 rounded bg-black/50 hover:border-neutral-700 transition group">
                <div class="font-mono text-xs text-neutral-500 mb-2 group-hover:text-neutral-300">VALIDATION</div>
                <div class="text-xl font-bold text-white">Zod</div>
            </div>
            <div class="p-6 border border-neutral-900 rounded bg-black/50 hover:border-neutral-700 transition group">
                <div class="font-mono text-xs text-neutral-500 mb-2 group-hover:text-neutral-300">RUNTIME</div>
                <div class="text-xl font-bold text-white">Node/Bun</div>
            </div>
        </div>

    </main>

    <footer class="border-t border-neutral-900 py-8 text-center bg-black">
        <p class="text-xs text-neutral-600 font-mono">MIT License • Built by Roti18</p>
    </footer>

</body>
</html>
  `)
}
