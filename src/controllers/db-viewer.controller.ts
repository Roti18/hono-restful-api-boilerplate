import { Context } from 'hono'
import { db } from '../config/database'

export const dbViewer = async (c: Context) => {
  const tablesResult = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  )
  const tables = tablesResult.rows.map((r) => r.name as string)

  const selectedTable = c.req.query('table') || tables[0]
  let rows: any[] = []
  let columns: string[] = []
  let error = null

  if (selectedTable && tables.includes(selectedTable)) {
    try {
      const data = await db.execute(
        `SELECT * FROM ${selectedTable} ORDER BY created_at DESC LIMIT 50`
      )
      rows = data.rows
      if (rows.length > 0) {
        columns = Object.keys(rows[0])
      }
    } catch (e: any) {
      error = e.message
    }
  }

  return c.html(`
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <title>DB Viewer</title>
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
    </style>
    <script>
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        function toggleTheme() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark')
                localStorage.theme = 'light'
            } else {
                document.documentElement.classList.add('dark')
                localStorage.theme = 'dark'
            }
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            
            if (sidebar && overlay) {
                sidebar.classList.toggle('-translate-x-full');
                overlay.classList.toggle('hidden');
            }
        }
    </script>
</head>
<body class="h-screen flex flex-col antialiased selection:bg-blue-500/20 bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 transition-colors duration-200">
    
    <header class="h-16 border-b border-gray-200 dark:border-neutral-900 flex items-center justify-between px-6 bg-white dark:bg-black z-10 transition-colors duration-200">
        <div class="flex items-center gap-4">
            <button onclick="toggleSidebar()" class="md:hidden text-gray-500 dark:text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 class="font-semibold text-gray-900 dark:text-white tracking-tight">Database Viewer</h1>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-500 border border-gray-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800">local.db</span>
        </div>
        
        <div class="flex items-center gap-4">
            <button onclick="toggleTheme()" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-500 dark:text-gray-400 transition-colors">
                <svg class="hidden dark:block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <svg class="block dark:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
            <div class="text-xs text-gray-400 font-mono">v1.0.0</div>
        </div>
    </header>

    <div class="flex flex-grow overflow-hidden relative">
        
        <!-- Sidebar -->
        <aside id="sidebar" class="absolute inset-y-0 left-0 z-20 w-64 md:relative transform -translate-x-full md:translate-x-0 transition-transform duration-200 border-r border-gray-200 dark:border-neutral-900 bg-gray-50 dark:bg-black flex flex-col">
            <div class="p-4">
                <div class="text-[11px] font-bold text-gray-400 dark:text-neutral-600 uppercase tracking-wider mb-3 pl-2">Tables</div>
                <nav class="space-y-0.5">
                    ${tables
                      .map(
                        (t) => `
                        <a href="?table=${t}" 
                           class="flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group ${
                             t === selectedTable
                               ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-white/10 dark:text-white dark:border-white/10'
                               : 'text-gray-600 hover:bg-gray-200 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300'
                           }">
                           <span class="${t === selectedTable ? 'text-blue-500 dark:text-white' : 'text-gray-400 dark:text-neutral-700 group-hover:text-gray-500 dark:group-hover:text-neutral-500'} mr-2 font-mono">#</span>
                           ${t}
                        </a>
                    `
                      )
                      .join('')}
                </nav>
            </div>
            
            <div class="mt-auto p-4 border-t border-gray-200 dark:border-neutral-900">
                <div class="text-[10px] text-gray-400 dark:text-neutral-700">Connected to Turso/LibSQL (Local)</div>
            </div>
        </aside>

        <!-- Overlay for mobile sidebar -->
        <div onclick="toggleSidebar()" class="md:hidden absolute inset-0 bg-black/50 z-10 hidden transition-opacity" id="overlay"></div>

        <main class="flex-grow flex flex-col overflow-hidden bg-white dark:bg-black transition-colors duration-200">
            
            <div class="h-12 border-b border-gray-200 dark:border-neutral-900 flex items-center px-6 bg-white dark:bg-black justify-between transition-colors duration-200">
                <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-500">
                   <span>Table:</span>
                   <span class="font-mono text-gray-800 dark:text-neutral-200 font-medium">${selectedTable}</span>
                   <span class="text-gray-300 dark:text-neutral-800 mx-2">|</span>
                   <span>Rows:</span>
                   <span class="font-mono text-gray-800 dark:text-neutral-200">${rows.length}</span>
                </div>
            </div>

            ${
              error
                ? `
                <div class="m-6 p-4 bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ${error}
                </div>
            `
                : ''
            }

            <div class="flex-grow overflow-auto p-0">
                ${
                  rows.length === 0
                    ? `
                    <div class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-neutral-600">
                       <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center mb-4 border border-gray-200 dark:border-neutral-800 font-mono">0</div>
                       <p class="text-sm">No records found</p>
                    </div>
                    `
                    : `
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50 dark:bg-black sticky top-0 z-10 transition-colors duration-200">
                            <tr>
                                ${columns
                                  .map(
                                    (col) => `
                                    <th class="px-6 py-3 text-[11px] font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider border-b border-gray-200 dark:border-neutral-900 whitespace-nowrap bg-gray-50 dark:bg-black">
                                        ${col}
                                    </th>
                                `
                                  )
                                  .join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-neutral-900">
                            ${rows
                              .map(
                                (row) => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-neutral-900/40 transition-colors group">
                                    ${columns
                                      .map((col) => {
                                        let val = row[col]
                                        let displayVal = val
                                        let isNull = val === null

                                        if (isNull) displayVal = 'null'
                                        else if (typeof val === 'object')
                                          displayVal = JSON.stringify(val)

                                        const isId = col.toLowerCase() === 'id'
                                        const isDate = col.includes('_at') || col.includes('date')

                                        let classes = 'text-gray-700 dark:text-neutral-300'
                                        if (isNull)
                                          classes =
                                            'text-gray-400 dark:text-neutral-700 italic font-mono text-xs'
                                        else if (isId)
                                          classes =
                                            'font-mono text-blue-600 dark:text-neutral-400 text-[11px]'
                                        else if (isDate)
                                          classes =
                                            'text-gray-500 dark:text-neutral-500 text-xs tabular-nums font-mono'

                                        return `<td class="px-6 py-3 text-sm whitespace-nowrap max-w-sm overflow-hidden text-ellipsis border-r border-transparent group-hover:border-gray-100 dark:group-hover:border-neutral-900 last:border-0">
                                            <div class="${classes}">${displayVal}</div>
                                        </td>`
                                      })
                                      .join('')}
                                </tr>
                            `
                              )
                              .join('')}
                        </tbody>
                    </table>
                    `
                }
            </div>

        </main>
    </div>
</body>
</html>
  `)
}
