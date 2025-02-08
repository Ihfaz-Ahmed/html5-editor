'use client'

import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import { useTheme } from 'next-themes'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'

interface CleaningOptions {
  clearInlineStyles: boolean
  clearClassesAndIds: boolean
  characterEncoding: boolean
  clearComments: boolean
  clearSpanTags: boolean
  clearSuccessiveNbsp: boolean
  clearTagsWithOneNbsp: boolean
  clearEmptyTags: boolean
  clearTagAttributes: boolean
  clearAllTags: boolean
  clearImages: boolean
  clearLinks: boolean
  clearTables: boolean
  convertTablesToDiv: boolean
  organizeTreeView: boolean
}

function formatHtml(code: string): string {
  let formatted = code.replace(/></g, '>\n<')
  
  // Add proper indentation
  let indent = 0
  let result = ''
  
  formatted.split('\n').forEach(line => {
    // Decrease indent for closing tags
    if (line.match(/<\//)) {
      indent--
    }
    
    // Add indentation
    result += '  '.repeat(Math.max(0, indent)) + line + '\n'
    
    // Increase indent for opening tags that aren't self-closing
    if (line.match(/<[^/]/) && !line.match(/\/>/)) {
      indent++
    }
  })
  
  return result.trim()
}

export default function Editor() {
  const [html, setHtml] = useState('')
  const [cleanedHtml, setCleanedHtml] = useState('')
  const [showCleaned, setShowCleaned] = useState(false)
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<any>(null)
  const { theme } = useTheme()
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>({
    clearInlineStyles: true,
    clearClassesAndIds: true,
    characterEncoding: true,
    clearComments: true,
    clearSpanTags: true,
    clearSuccessiveNbsp: true,
    clearTagsWithOneNbsp: true,
    clearEmptyTags: false,
    clearTagAttributes: false,
    clearAllTags: false,
    clearImages: false,
    clearLinks: false,
    clearTables: false,
    convertTablesToDiv: false,
    organizeTreeView: false
  })
  const [showCleaningOptions, setShowCleaningOptions] = useState(false)

  useEffect(() => {
    setMounted(true)
    Prism.highlightAll()
  }, [])

  useEffect(() => {
    Prism.highlightAll()
  }, [html, cleanedHtml, showCleaned])

  const cleanHtml = useCallback((dirtyHtml: string, options: CleaningOptions) => {
    const config = {
      FORBID_TAGS: [] as string[],
      FORBID_ATTR: ['dir'] as string[],
      ALLOW_DATA_ATTR: false,
    }

    if (options.clearInlineStyles) {
      config.FORBID_ATTR.push('style')
    }

    if (options.clearClassesAndIds) {
      config.FORBID_ATTR.push('class', 'id')
    }

    if (options.clearTagAttributes) {
      config.FORBID_ATTR = ['*']
    }

    if (options.clearImages) {
      config.FORBID_TAGS.push('img')
    }

    if (options.clearLinks) {
      config.FORBID_TAGS.push('a')
    }

    if (options.clearTables) {
      config.FORBID_TAGS.push('table', 'thead', 'tbody', 'tr', 'td', 'th')
    }

    if (options.clearAllTags) {
      config.FORBID_TAGS.push('*')
    }

    let cleanHtml = DOMPurify.sanitize(dirtyHtml, config)

    cleanHtml = cleanHtml.replace(/\s+dir="[^"]*"/g, '')

    if (options.clearComments) {
      cleanHtml = cleanHtml.replace(/<!--[\s\S]*?-->/g, '')
    }

    if (options.clearSpanTags) {
      cleanHtml = cleanHtml.replace(/<\/?span[^>]*>/g, '')
    }

    if (options.clearSuccessiveNbsp) {
      cleanHtml = cleanHtml.replace(/(&nbsp;){2,}/g, ' ')
    }

    if (options.clearTagsWithOneNbsp) {
      cleanHtml = cleanHtml.replace(/<([^>]+)>&nbsp;<\/\1>/g, ' ')
    }

    if (options.clearEmptyTags) {
      cleanHtml = cleanHtml.replace(/<([^>]+)>\s*<\/\1>/g, '')
    }

    if (options.convertTablesToDiv) {
      cleanHtml = cleanHtml
        .replace(/<table[^>]*>/g, '<div class="table">')
        .replace(/<\/table>/g, '</div>')
        .replace(/<tr[^>]*>/g, '<div class="row">')
        .replace(/<\/tr>/g, '</div>')
        .replace(/<td[^>]*>/g, '<div class="cell">')
        .replace(/<\/td>/g, '</div>')
    }

    if (options.characterEncoding) {
      cleanHtml = cleanHtml
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/…/g, '...')
        .replace(/[–—]/g, '-')
    }

    if (options.organizeTreeView) {
      cleanHtml = formatHtml(cleanHtml)
    }

    return formatHtml(cleanHtml)
  }, [])

  const handleClean = () => {
    const cleaned = cleanHtml(html, cleaningOptions)
    setCleanedHtml(cleaned)
    setShowCleaned(true)
    if (editorRef.current) {
      editorRef.current.setContent(cleaned)
    }
    setHtml(cleaned)
  }

  const toggleOption = (key: keyof CleaningOptions) => {
    setCleaningOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getOptionIcon = (key: keyof CleaningOptions) => {
    const icons: Record<keyof CleaningOptions, string> = {
      clearInlineStyles: '🎨',
      clearClassesAndIds: '🏷️',
      characterEncoding: 'ä',
      clearComments: '💬',
      clearSpanTags: '🏷️',
      clearSuccessiveNbsp: '⌨️',
      clearTagsWithOneNbsp: '1️⃣',
      clearEmptyTags: '📄',
      clearTagAttributes: '❌',
      clearAllTags: '🏷️',
      clearImages: '🖼️',
      clearLinks: '🔗',
      clearTables: '📊',
      convertTablesToDiv: '📑',
      organizeTreeView: '🌳'
    }
    return icons[key]
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-[calc(100vh-80px)]">
      <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <div className="h-full flex flex-col">
          <TinyMCEEditor
            key={theme}
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => {
              editorRef.current = editor
              editor.setContent(html)
            }}
            onEditorChange={(content) => {
              setHtml(content)
              setShowCleaned(false)
            }}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | table link image code | help',
              content_style: theme === 'dark' 
                ? 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #111827; color: #fff; } body.mce-content-body[data-mce-placeholder]:not([contenteditable="false"]):before { color: #666; }'
                : 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #f9fafb; color: #111827; } body.mce-content-body[data-mce-placeholder]:not([contenteditable="false"]):before { color: #666; }',
              skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
              content_css: theme === 'dark' ? 'dark' : 'default',
              promotion: false,
              branding: false,
              statusbar: false,
              resize: false,
              contextmenu: 'link image table',
              custom_colors: false,
              color_map: [
                "000000", "Black",
                "808080", "Gray",
                "FFFFFF", "White",
                "FF0000", "Red",
                "00FF00", "Green",
                "0000FF", "Blue",
                "FFFF00", "Yellow",
                "FF00FF", "Magenta",
                "00FFFF", "Cyan"
              ]
            }}
          />

          <div className="mt-4 relative">
            <div className="flex gap-2">
              <button
                onClick={handleClean}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Clean HTML
              </button>
              <button
                onClick={() => setShowCleaningOptions(!showCleaningOptions)}
                className="p-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Cleaning Options"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {showCleaningOptions && (
              <>
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setShowCleaningOptions(false)}
                />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cleaning Options</h3>
                    <button
                      onClick={() => setShowCleaningOptions(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
                    {Object.entries(cleaningOptions).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleOption(key as keyof CleaningOptions)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-xl">{getOptionIcon(key as keyof CleaningOptions)}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 h-full">
        <div className="h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {showCleaned ? 'Cleaned HTML' : 'Original HTML'}
          </h2>
          <div className="relative flex-grow h-[500px]">
            <pre 
              className="language-markup rounded-lg overflow-auto !bg-gray-50 dark:!bg-gray-900 !p-4 !m-0 h-full"
              contentEditable
              onBlur={(e) => {
                const content = e.currentTarget.textContent || ''
                setHtml(content)
                if (editorRef.current) {
                  editorRef.current.setContent(content)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  document.execCommand('insertText', false, '  ')
                }
              }}
              spellCheck={false}
            >
              <code className="language-markup block h-full">
                {formatHtml(showCleaned ? cleanedHtml : html)}
              </code>
            </pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showCleaned ? cleanedHtml : html)
                }}
                className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 