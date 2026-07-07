import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronRight,
  Compass,
  Footprints,
  Gauge,
  LifeBuoy,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Disclosure } from '@/components/ui/disclosure'
import { SafetyContent } from '@/features/learn/components/safety-content'
import { TopicStepModal } from '@/features/learn/components/topic-step-modal'
import { learnTopics } from '@/features/learn/lib/learn-content'
import type { LearnTopic } from '@/features/learn/types/learn'

const topicIcons: Record<LearnTopic['id'], ReactNode> = {
  values: <Compass size={22} aria-hidden="true" />,
  action: <Footprints size={22} aria-hidden="true" />,
  score: <Gauge size={22} aria-hidden="true" />,
}

export const LearnPage = () => {
  const navigate = useNavigate()
  const [openTopicId, setOpenTopicId] = useState<LearnTopic['id'] | null>(null)
  const openTopic = learnTopics.find((topic) => topic.id === openTopicId)

  return (
    <>
      <title>ippo の使い方・考え方</title>
      <main className="mx-auto flex min-h-svh w-full max-w-screen-sm flex-col gap-5 px-4 py-6 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            戻る
          </button>
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="font-rounded text-2xl font-bold text-ink">
            使い方・考え方
          </h1>
          <p className="text-sm leading-relaxed text-ink-soft">
            むずかしく考えなくて大丈夫。気になるところだけ、のぞいてみてください。
          </p>
        </header>

        {/* 危機時の相談先は「学習」ではなく常時アクセス可能な出口。ステップに埋めず、
            ハブ上部と各モーダル内から一貫して開けるようにする。 */}
        <Disclosure
          summary="こまったときは"
          icon={
            <LifeBuoy size={18} aria-hidden="true" className="text-ink-soft" />
          }
        >
          <SafetyContent />
        </Disclosure>

        <ul className="stagger flex flex-col gap-3">
          {learnTopics.map((topic, index) => (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => setOpenTopicId(topic.id)}
                className="w-full text-left"
              >
                <Card interactive className="flex items-center gap-4 p-4">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent"
                    aria-hidden="true"
                  >
                    {topicIcons[topic.id]}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="flex items-center gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink/10 text-xs font-bold text-ink-soft">
                        {index + 1}
                      </span>
                      <span className="font-bold text-ink">{topic.title}</span>
                    </span>
                    <span className="mt-0.5 text-xs text-ink-soft">
                      約{topic.estMinutes}分
                    </span>
                  </span>
                  <ChevronRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-ink-soft"
                  />
                </Card>
              </button>
            </li>
          ))}
        </ul>

        <div className="pb-[calc(env(safe-area-inset-bottom)+1rem)] text-center">
          <Link to="/exposures/new" className="text-sm font-bold text-accent">
            記録をはじめる
          </Link>
        </div>
      </main>

      {openTopic && (
        <TopicStepModal
          topic={openTopic}
          open={openTopicId !== null}
          onClose={() => setOpenTopicId(null)}
        />
      )}
    </>
  )
}
