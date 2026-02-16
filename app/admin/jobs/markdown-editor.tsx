'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Eye, Edit } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={showPreview ? 'outline' : 'secondary'}
            size="xs"
            onClick={() => setShowPreview(false)}
            disabled={disabled}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant={showPreview ? 'secondary' : 'outline'}
            size="xs"
            onClick={() => setShowPreview(true)}
            disabled={disabled}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">Markdown supported</span>
      </div>

      {showPreview ? (
        <div className="min-h-32 rounded-md border p-4 prose prose-sm max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">No content to preview</p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-32 font-mono text-sm"
        />
      )}
    </div>
  )
}

