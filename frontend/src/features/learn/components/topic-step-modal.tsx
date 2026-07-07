import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Illustration } from '@/components/ui/illustration'
import { Button } from '@/components/ui/button'
import { SafetyContent } from '@/features/learn/components/safety-content'
import type { LearnTopic } from '@/features/learn/types/learn'

interface TopicStepModalProps {
  topic: LearnTopic
  open: boolean
  onClose: () => void
}

const stepStorageKey = (topicId: string) => `ippo:learn:${topicId}:step`

// localStorage はプライベートブラウジング等で例外を投げることがあるため、
// anxiety-anchors.ts と同様に読み書きを try/catch で防御する。
const readSavedStep = (topicId: string): number | null => {
  try {
    const raw = localStorage.getItem(stepStorageKey(topicId))
    if (raw === null) return null
    const parsed = Number(raw)
    return Number.isInteger(parsed) ? parsed : null
  } catch {
    return null
  }
}

const writeSavedStep = (topicId: string, step: number) => {
  try {
    localStorage.setItem(stepStorageKey(topicId), String(step))
  } catch {
    // 保存できなくても学習フローは続けられるので無視する。
  }
}

const clearSavedStep = (topicId: string) => {
  try {
    localStorage.removeItem(stepStorageKey(topicId))
  } catch {
    // ignore
  }
}

const clampStep = (value: number, length: number) => {
  if (length <= 0) return 0
  if (value < 0) return 0
  if (value > length - 1) return length - 1
  return value
}

export const TopicStepModal = ({
  topic,
  open,
  onClose,
}: TopicStepModalProps) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [showSafety, setShowSafety] = useState(false)

  // 開いた瞬間に前回の続きを復元する。安全情報を見ていたかどうかは持ち越さない。
  useEffect(() => {
    if (!open) return
    const saved = readSavedStep(topic.id)
    setStepIndex(saved === null ? 0 : clampStep(saved, topic.steps.length))
    setShowSafety(false)
  }, [open, topic.id, topic.steps.length])

  useEffect(() => {
    if (!open) return
    writeSavedStep(topic.id, stepIndex)
  }, [open, topic.id, stepIndex])

  const step = topic.steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === topic.steps.length - 1

  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0))
  const goNext = () =>
    setStepIndex((current) => Math.min(current + 1, topic.steps.length - 1))

  // 完了扱いなので、次回開いたときは最初のステップから始められるようにする。
  const handleFinish = () => {
    clearSavedStep(topic.id)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={showSafety ? 'こまったときは' : topic.title}
    >
      {showSafety ? (
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="self-start px-2"
            onClick={() => setShowSafety(false)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            ステップにもどる
          </Button>
          <SafetyContent />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-2" aria-hidden="true">
            {topic.steps.map((_, index) => (
              <span
                key={index}
                aria-current={index === stepIndex ? 'step' : undefined}
                className={
                  index === stepIndex
                    ? 'size-2.5 rounded-full bg-accent'
                    : 'size-2 rounded-full bg-ink-soft/30'
                }
              />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {topic.steps.length}つ中{stepIndex + 1}つ目
          </p>

          <div
            key={stepIndex}
            className="flex flex-col gap-3 animate-soft-fade"
          >
            {step.illustration && (
              <Illustration
                src={step.illustration.src}
                alt={step.illustration.alt}
                className="mx-auto w-40"
              />
            )}
            <h3 className="text-lg font-bold text-ink">{step.headline}</h3>
            <div className="text-sm leading-relaxed text-ink">{step.body}</div>
            {step.extra}
          </div>

          <div className="sticky bottom-0 -mx-5 flex flex-col gap-2 border-t border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              {isFirst ? (
                <span />
              ) : (
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  戻る
                </Button>
              )}
              {isLast ? (
                <Link to={topic.finalCta.to} onClick={handleFinish}>
                  <Button variant="primary">{topic.finalCta.label}</Button>
                </Link>
              ) : (
                <Button variant="primary" onClick={goNext}>
                  次へ
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-ink-soft"
              >
                スキップ
              </button>
              <button
                type="button"
                onClick={() => setShowSafety(true)}
                className="text-xs font-bold text-ink-soft"
              >
                こまったときは
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
