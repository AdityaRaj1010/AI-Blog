import React from 'react'
import Button from './ui/button'
import Link from 'next/link'

type EmptyStateProps = {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export default function EmptyState({ 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mb-4" />
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {action && (
        <Link href={action.href}>
          <Button variant="primary">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  )
}