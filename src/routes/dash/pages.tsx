import { createFileRoute } from '@tanstack/react-router'
import { SimplePage } from '@/components/ui/simple-page'
import { Facebook } from 'lucide-react'

export const Route = createFileRoute('/dash/pages')({
  component: PagesPage,
})

function PagesPage() {
  return <SimplePage title="Facebook Pages" subtitle="Quản lý các trang Facebook đã kết nối" icon={Facebook} />
}
