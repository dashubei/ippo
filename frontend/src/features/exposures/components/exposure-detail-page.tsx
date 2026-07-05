import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ErrorText } from '@/components/ui/error-text'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDeleteExposure,
  useExposure,
} from '@/features/exposures/api/exposures'
import { useValueOptions } from '@/features/exposures/api/value-options'
import { CompleteExposureForm } from '@/features/exposures/components/complete-exposure-form'
import { formatDateTime } from '@/features/exposures/lib/date'
import type { ExposureRecord } from '@/types/api'

const DetailRow = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-sm text-ink-soft">{label}</dt>
    <dd className="text-ink">{children}</dd>
  </div>
)

// 予想（やる前）と実際（やってみて）を横に並べて見くらべる。
// 抑制学習では「予想と実際のズレ」に気づくこと自体が学習になるため、
// before/after を別々に流し読みさせず、対比の形で見せる。
const ExpectationContrast = ({ record }: { record: ExposureRecord }) => (
  <Card className="flex flex-col gap-4 p-5">
    <div className="flex flex-col gap-1">
      <h2 className="font-bold text-ink">予想と、実際</h2>
      <p className="text-sm leading-relaxed text-ink-soft">
        やる前の見立てと、やってみた実際を見くらべてみましょう。ズレに気づくことが、次の一歩の助けになります。
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2 rounded-2xl bg-white/60 p-3">
        <p className="text-xs font-bold text-ink-soft">やる前の予想</p>
        <p className="text-sm text-ink">
          不安{' '}
          <span className="font-bold tabular-nums">
            {record.anxiety_before}
          </span>
        </p>
        {record.memo_before ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {record.memo_before}
          </p>
        ) : (
          <p className="text-sm text-ink-soft">（メモなし）</p>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-accent/10 p-3">
        <p className="text-xs font-bold text-ink-soft">やってみた実際</p>
        <p className="text-sm text-ink">
          不安{' '}
          <span className="font-bold tabular-nums">
            {record.anxiety_after ?? '—'}
          </span>
        </p>
        {record.memo_after ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {record.memo_after}
          </p>
        ) : (
          <p className="text-sm text-ink-soft">（メモなし）</p>
        )}
      </div>
    </div>
  </Card>
)

export const ExposureDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const exposureId = Number(id)
  const exposure = useExposure(exposureId)
  const values = useValueOptions()
  const deleteExposure = useDeleteExposure()
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // 削除が成功で確定してから一覧へ遷移する。失敗時は遷移せずエラーを表示する。
  const handleDelete = async () => {
    setDeleteError(null)
    try {
      await deleteExposure.mutateAsync(exposureId)
      navigate('/history')
    } catch {
      setDeleteError('削除に失敗しました。時間をおいて再度お試しください')
    }
  }

  if (exposure.isPending) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Skeleton className="h-7 w-32" />
        <Card className="flex flex-col gap-3 p-5">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
        </Card>
      </div>
    )
  }

  if (exposure.isError) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <ErrorText>
          記録を読み込めませんでした。時間をおいて再度お試しください
        </ErrorText>
        <Button variant="secondary" onClick={() => navigate('/history')}>
          一覧へ戻る
        </Button>
      </div>
    )
  }

  const record = exposure.data
  const valueName =
    values.data?.find((value) => value.id === record.value)?.name ??
    '（削除された価値の記録）'
  const isDone = record.done_at !== null

  return (
    <div className="flex animate-soft-fade flex-col gap-4 py-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-rounded text-2xl font-bold text-ink">記録の詳細</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isDone ? 'bg-accent text-white' : 'bg-ink/10 text-ink-soft'
          }`}
        >
          {isDone ? '実施済み' : 'これから'}
        </span>
      </div>

      {justCompleted && isDone && (
        <div
          className="flex animate-pop-in items-start gap-2 rounded-2xl bg-accent/10 px-4 py-3 text-sm leading-relaxed text-ink"
          role="status"
        >
          <Sparkles
            size={18}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent"
          />
          <span>振り返りを記録しました。よく取り組めましたね。</span>
        </div>
      )}

      <Card className="p-5">
        <dl className="flex flex-col gap-3">
          <DetailRow label="価値">{valueName}</DetailRow>
          <DetailRow label="行動">{record.action}</DetailRow>
          {record.done_at && (
            <DetailRow label="実施日時">
              {formatDateTime(record.done_at)}
            </DetailRow>
          )}
        </dl>
      </Card>

      {isDone ? (
        <ExpectationContrast record={record} />
      ) : (
        <Card className="flex flex-col gap-3 p-5">
          <h2 className="font-bold text-ink">やる前の見立て</h2>
          <dl className="flex flex-col gap-3">
            <DetailRow label="実施前の不安の強さ">
              {record.anxiety_before}
            </DetailRow>
            {record.memo_before && (
              <DetailRow label="やる前のメモ（予想）">
                <span className="whitespace-pre-wrap">
                  {record.memo_before}
                </span>
              </DetailRow>
            )}
          </dl>
        </Card>
      )}

      {!isDone && (
        <Card className="flex animate-rise-in flex-col gap-4 p-5">
          <h2 className="font-bold text-ink">
            やってみてどうだったか、振り返る
          </h2>
          <CompleteExposureForm
            id={record.id}
            onCompleted={() => setJustCompleted(true)}
          />
        </Card>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => navigate('/history')}
        >
          一覧へ戻る
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-danger"
          onClick={() => setConfirmingDelete(true)}
        >
          削除
        </Button>
      </div>

      <Modal
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="記録を削除しますか"
        dismissibleByBackdrop={false}
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink">
            この記録を削除します。取り消せません。記録は、うまくいかなくても残しておくと振り返りの助けになります。
          </p>
          {deleteError && <ErrorText>{deleteError}</ErrorText>}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setConfirmingDelete(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={deleteExposure.isPending}
              onClick={handleDelete}
            >
              削除する
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
