'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

interface SkillsInputProps {
  skills: string[]
  onChange: (skills: string[]) => void
  disabled?: boolean
}

export function SkillsInput({ skills, onChange, disabled }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addSkill = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed])
      setInputValue('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addSkill}
          disabled={disabled || !inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                disabled={disabled}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

