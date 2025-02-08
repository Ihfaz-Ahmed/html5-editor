import Editor from '@/components/Editor'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            WYSIWYG Editor
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <div className="max-w-7xl mx-auto">
        <Editor />
      </div>
    </main>
  )
}
