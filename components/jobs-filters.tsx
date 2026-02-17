'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { JobFilters, JobType, ExperienceLevel, WorkStyle } from '@/types/jobs'

interface JobsFiltersProps {
  filters: JobFilters
  categories: string[]
  onFiltersChange: (filters: JobFilters) => void
  totalJobs: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship']
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Entry', 'Mid', 'Senior', 'Lead']
const WORK_STYLES: WorkStyle[] = ['Remote', 'Hybrid', 'On-site']

export function JobsFilters({
  filters,
  categories,
  onFiltersChange,
  totalJobs,
  isCollapsed = false,
  onToggleCollapse
}: JobsFiltersProps) {
  const [search, setSearch] = useState(filters.search || '')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const toggleArrayFilter = <T extends string>(
    key: keyof JobFilters,
    value: T
  ) => {
    const current = (filters[key] as T[]) || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [key]: updated.length > 0 ? updated : undefined })
  }

  const clearFilters = () => {
    setSearch('')
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters {hasActiveFilters && `(${Object.keys(filters).length})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterContent
              filters={filters}
              categories={categories}
              search={search}
              onSearchChange={handleSearchChange}
              onToggleFilter={toggleArrayFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block relative">
        {/* Collapse/Expand Button - Always visible */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={`absolute top-0 z-20 h-8 w-8 rounded-full border bg-background shadow-sm hover:bg-accent transition-all duration-300 ${
              isCollapsed ? 'left-0' : 'right-0'
            }`}
            title={isCollapsed ? "Expand filters" : "Collapse filters"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Sidebar Content */}
        {!isCollapsed && (
          <div className="pr-4">
            <FilterContent
              filters={filters}
              categories={categories}
              search={search}
              onSearchChange={handleSearchChange}
              onToggleFilter={toggleArrayFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}
      </div>
    </>
  )
}

interface FilterContentProps {
  filters: JobFilters
  categories: string[]
  search: string
  onSearchChange: (value: string) => void
  onToggleFilter: <T extends string>(key: keyof JobFilters, value: T) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

function FilterContent({
  filters,
  categories,
  search,
  onSearchChange,
  onToggleFilter,
  onClearFilters,
  hasActiveFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Job title, company, skills..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear all filters
        </Button>
      )}

      {/* Work Style */}
      <FilterSection title="Work Style">
        {WORK_STYLES.map((style) => (
          <FilterCheckbox
            key={style}
            label={style}
            checked={(filters.workStyle || []).includes(style)}
            onCheckedChange={() => onToggleFilter('workStyle', style)}
          />
        ))}
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type">
        {JOB_TYPES.map((type) => (
          <FilterCheckbox
            key={type}
            label={type}
            checked={(filters.jobType || []).includes(type)}
            onCheckedChange={() => onToggleFilter('jobType', type)}
          />
        ))}
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Experience Level">
        {EXPERIENCE_LEVELS.map((level) => (
          <FilterCheckbox
            key={level}
            label={level}
            checked={(filters.experienceLevel || []).includes(level)}
            onCheckedChange={() => onToggleFilter('experienceLevel', level)}
          />
        ))}
      </FilterSection>

      {/* Category */}
      {categories.length > 0 && (
        <FilterSection title="Category">
          {categories.map((category) => (
            <FilterCheckbox
              key={category}
              label={category}
              checked={(filters.category || []).includes(category)}
              onCheckedChange={() => onToggleFilter('category', category)}
            />
          ))}
        </FilterSection>
      )}
    </div>
  )
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-sm mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onCheckedChange: () => void
}

function FilterCheckbox({ label, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`filter-${label}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <label
        htmlFor={`filter-${label}`}
        className="text-sm cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}

