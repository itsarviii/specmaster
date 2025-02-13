import { PageHeader } from "@/components/layout/page-header"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Pick up where you left off."
      />
      <p className="text-muted-foreground text-sm">Coming in Module 5.</p>
    </div>
  )
}
