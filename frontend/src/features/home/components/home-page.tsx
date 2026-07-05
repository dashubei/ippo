import { Link } from 'react-router-dom'
import { ArrowRight, History, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Illustration } from '@/components/ui/illustration'
import { Skeleton } from '@/components/ui/skeleton'
import { useExposures } from '@/features/exposures/api/exposures'
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
  const { data: exposures } = useExposures()

  // 計画したが未実施の記録。実行→振り返りへ促すためホームに前出しする。
  const pendingExposures = exposures?.filter((record) => !record.done_at) ?? []

  return (
    <div className="flex flex-col gap-6 py-6">
      <header className="flex animate-soft-fade items-center gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-bold text-accent">こんにちは</p>
          <h1 className="font-rounded text-2xl font-bold text-ink">
            今日も、あなたのペースで
          </h1>
          <p className="text-sm leading-relaxed text-ink-soft">
            大切にしたいことに向けて、小さな一歩を残してみましょう。
          </p>
        </div>
        <Illustration
          src="/illustrations/peeps/easing.svg"
          width={240}
          height={324}
          priority
          className="w-20 shrink-0 animate-float sm:w-24"
        />
      </header>

      <div className="stagger flex flex-col gap-4">
        {/* メインの導線。今日の一歩を促す。 */}
        <Card className="relative flex flex-col gap-4 overflow-hidden p-5">
          <div className="flex items-start gap-4">
            <div className="flex flex-1 flex-col gap-1">
              <h2 className="font-bold text-ink">今日の小さな一歩</h2>
              <p className="text-sm leading-relaxed text-ink-soft">
                できそうなことを、ひとつだけ。やる前の気持ちも、あとから書き足せます。
              </p>
            </div>
            <Illustration
              src="/illustrations/peeps/walking.svg"
              width={240}
              height={324}
              className="w-14 shrink-0 self-end"
            />
          </div>
          <Link to="/exposures/new">
            <Button className="w-full">
              <Plus size={18} aria-hidden="true" />
              一歩を記録する
            </Button>
          </Link>
        </Card>

        {/* 計画済みで未実施の一歩。実行して振り返るところまでを促す。 */}
        {pendingExposures.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-ink">やってみた？ 予定した一歩</h2>
              {pendingExposures.length > 2 && (
                <Link to="/history" className="text-sm font-bold text-accent">
                  すべて見る
                </Link>
              )}
            </div>
            <ul className="flex flex-col gap-3">
              {pendingExposures.slice(0, 2).map((record) => (
                <li key={record.id}>
                  <Link to={`/exposures/${record.id}`} className="block">
                    <Card
                      interactive
                      className="flex min-h-11 items-center gap-4 p-4"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-bold text-ink">
                          {record.action}
                        </span>
                        <span className="text-sm text-ink-soft">
                          やってみて、振り返りを記録する
                        </span>
                      </div>
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="shrink-0 text-ink-soft"
                      />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
          <Card interactive className="flex min-h-11 items-center gap-4 p-4">
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
    </div>
  )
}
