import { createFileRoute } from '@tanstack/react-router'
import ManualImportPage from '#/features/products/components/manual-import-page'

export const Route = createFileRoute('/dash/products/manual-import')({
  component: ManualImportPage,
})
