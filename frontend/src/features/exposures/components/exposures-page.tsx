import { useState } from 'react'
import Calendar from 'react-calendar'
import type { TileArgs } from 'react-calendar'
import { Link } from 'react-router-dom'
import { Footprints } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Skeleton } from '@/components/ui/skeleton'
import { useExposures } from '@/features/exposures/api/exposures'
import { useValueOptions } from '@/features/exposures/api/value-options'
import { ExposureListItem } from '@/features/exposures/components/exposure-list-item'
import {
  formatDate,
  groupByDoneDate,
  toDateKey,
} from '@/features/exposures/lib/date'
import type { ExposureRecord } from '@/types/api'

const PageHeader = () => (
  <header className="flex flex-col gap-1">
    <div className="flex items-center justify-between gap-2">
      <h1 className="font-rounded text-2xl font-bold text-ink">
        これまでの記録
      </h1>
      <Link to="/exposures/new">
        <Button className="px-4 py-2 text-sm">新しく記録する</Button>
      </Link>
    </div>
    <p className="text-sm leading-relaxed text-ink-soft">
      重ねてきた一歩を、カレンダーで振り返れます。日付を選ぶと、その日の記録が見られます。
    </p>
  </header>
)

export const ExposuresPage = () => {
  const exposures = useExposures()
  const values = useValueOptions()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  if (exposures.isPending) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <PageHeader />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (exposures.isError) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <PageHeader />
        <ErrorText>
          記録を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
      </div>
    )
  }

  const records = exposures.data
  const doneGroups = groupByDoneDate(records)
  const pending = records.filter((record) => !record.done_at)

  const valueNameOf = (record: ExposureRecord) =>
    values.data?.find((value) => value.id === record.value)?.name ??
    '（削除された価値の記録）'

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const selectedRecords = selectedKey ? (doneGroups.get(selectedKey) ?? []) : []

  const tileContent = ({ date, view }: TileArgs) => {
    if (view !== 'month') return null
    if (!doneGroups.has(toDateKey(date))) return null
    return (
      <span
        aria-hidden="true"
        className="mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full bg-accent"
      />
    )
  }

  return (
    <div className="flex animate-soft-fade flex-col gap-5 py-4">
      <PageHeader />

      <Card className="p-3">
        <Calendar
          locale="ja-JP"
          onClickDay={(value) => setSelectedDate(value)}
          tileContent={tileContent}
          className="ippo-calendar"
        />
      </Card>

      {selectedDate && (
        <section className="flex flex-col gap-3" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-ink">
              {formatDate(selectedDate)}の記録
            </h2>
            <Button
              variant="ghost"
              className="px-3 py-1.5 text-sm text-ink-soft"
              onClick={() => setSelectedDate(null)}
            >
              クリア
            </Button>
          </div>
          {selectedRecords.length === 0 ? (
            <p className="py-4 text-center text-ink-soft">
              この日の記録はありません
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {selectedRecords.map((record) => (
                <ExposureListItem
                  key={record.id}
                  record={record}
                  valueName={valueNameOf(record)}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      {pending.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-ink">これからの一歩</h2>
          <ul className="flex flex-col gap-3">
            {pending.map((record) => (
              <ExposureListItem
                key={record.id}
                record={record}
                valueName={valueNameOf(record)}
              />
            ))}
          </ul>
        </section>
      )}

      {records.length === 0 && (
        <Card className="flex flex-col items-center gap-3 p-6 text-center text-ink-soft">
          <span
            aria-hidden="true"
            className="grid size-16 place-items-center rounded-full bg-accent/10 text-accent"
          >
            <Footprints size={28} />
          </span>
          <p>
            まだ振り返る記録はありません。最初の一歩を残すと、ここに積み重なっていきます。
          </p>
          <Link to="/exposures/new" className="font-bold text-accent">
            新しく記録する
          </Link>
        </Card>
      )}
    </div>
  )
}
