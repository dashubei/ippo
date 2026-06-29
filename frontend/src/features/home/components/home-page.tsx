import { Link } from 'react-router-dom'
import { ArrowRight, Compass, History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Skeleton } from '@/components/ui/skeleton'
import { useValues } from '@/features/values/api/values'

// 登録済みの価値を控えめに見せるチップ。多すぎると圧迫感が出るため数を絞る。
const ValueChips = ({ names }: { names: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {names.map((name) => (
      <span
        key={name}
        className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs text-ink"
      >
        {name}
      </span>
    ))}
  </div>
)

export const HomePage = () => {
  const { data: values, isPending, isError } = useValues()

  return (
    <div className="flex animate-soft-fade flex-col gap-6 py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-rounded text-2xl font-bold text-ink">ようこそ</h1>
        <p className="text-sm leading-relaxed text-ink-soft">
          今日も、無理のないペースで。あなたの大切にしたいことに向けて、小さな一歩を残してみましょう。
        </p>
      </header>

      {/* メインの導線。今日の一歩を促す。 */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Compass size={20} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-ink">今日の小さな一歩</h2>
            <p className="text-sm leading-relaxed text-ink-soft">
              できそうなことを、ひとつだけ。やる前の気持ちも、あとから書き足せます。
            </p>
          </div>
        </div>
        <Link to="/exposures/new">
          <Button className="w-full">
            <Plus size={18} aria-hidden="true" />
            一歩を記録する
          </Button>
        </Link>
      </Card>

      {/* 価値が 0 件のときは、まず価値設定にやさしく誘導する。 */}
      {isPending ? (
        <Skeleton className="h-24 w-full" />
      ) : isError ? (
        <ErrorText>
          情報を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
      ) : values.length === 0 ? (
        <Card className="flex flex-col gap-3 p-5">
          <h2 className="font-bold text-ink">
            まず、大切にしたいことを決めませんか
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            「どんな自分でいたいか」を一つ決めておくと、一歩を選びやすくなります。完璧でなくて大丈夫。あとから変えられます。
          </p>
          <Link to="/onboarding">
            <Button variant="secondary" className="w-full">
              大切にしたいことを決める
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </Link>
        </Card>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-ink">あなたが大切にしたいこと</h2>
            <Link to="/values" className="text-sm font-bold text-accent">
              編集する
            </Link>
          </div>
          <ValueChips names={values.slice(0, 6).map((value) => value.name)} />
        </section>
      )}

      {/* これまでの記録（履歴）への導線。ホームは「次の一歩」、履歴は「振り返り」と役割を分ける。 */}
      <Link to="/history" className="block">
        <Card className="flex min-h-11 items-center gap-4 p-4 transition-transform active:scale-[0.99]">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
            <History size={20} aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-bold text-ink">これまでの記録を見る</span>
            <span className="text-sm text-ink-soft">
              重ねてきた一歩を、カレンダーで振り返れます
            </span>
          </div>
          <ArrowRight
            size={18}
            aria-hidden="true"
            className="shrink-0 text-ink-soft"
          />
        </Card>
      </Link>
    </div>
  )
}
