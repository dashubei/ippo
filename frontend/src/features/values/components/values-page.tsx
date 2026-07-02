import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Illustration } from '@/components/ui/illustration'
import { Skeleton } from '@/components/ui/skeleton'
import { useValues } from '@/features/values/api/values'
import { ValueForm } from '@/features/values/components/value-form'
import { ValueItem } from '@/features/values/components/value-item'

export const ValuesPage = () => {
  const { data: values, isPending, isError } = useValues()

  return (
    <div className="mx-auto flex w-full max-w-screen-sm flex-col gap-6 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-rounded text-2xl font-bold text-ink">価値</h1>
        <p className="text-sm text-ink-soft">
          「どんな人でありたいか」「何を大切にしたいか」を、自由に書き留めてみましょう。正解はありません。
        </p>
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-accent"
        >
          <BookOpen size={16} aria-hidden="true" />
          価値ってなんだろう
        </Link>
      </header>

      <Card className="p-4">
        <ValueForm />
      </Card>

      {isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : isError ? (
        <ErrorText>
          価値を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
      ) : values.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center text-ink-soft">
          <Illustration
            src="/illustrations/peeps/sitting-mid.svg"
            width={240}
            height={324}
            className="w-32"
          />
          <p className="leading-relaxed">
            まだ価値が登録されていません。最初の価値を追加してみましょう。
          </p>
          <Link to="/onboarding">
            <Button variant="secondary">ガイドにそって決める</Button>
          </Link>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <ul className="stagger divide-y divide-ink/10">
            {values.map((value) => (
              <li key={value.id}>
                <ValueItem value={value} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
