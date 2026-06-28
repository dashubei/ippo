import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import type { ExposureRecord } from '@/types/api'

interface ExposureListItemProps {
  record: ExposureRecord
  valueName: string
}

export const ExposureListItem = ({
  record,
  valueName,
}: ExposureListItemProps) => {
  const isDone = record.done_at !== null
  return (
    <li>
      <Link to={`/exposures/${record.id}`} className="block">
        <Card className="flex min-h-11 items-center justify-between gap-3 p-4 transition-transform active:scale-[0.99]">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-bold text-ink">{record.action}</span>
            <span className="truncate text-sm text-ink-soft">{valueName}</span>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              isDone ? 'bg-accent text-white' : 'bg-ink/10 text-ink-soft'
            }`}
          >
            {isDone ? '実施済み' : 'これから'}
          </span>
        </Card>
      </Link>
    </li>
  )
}
