import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_teacher/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/account"!</div>
}
