import { Illustration } from '@/components/ui/illustration'

// LCP は見出しテキスト（即描画）。人物イラストは priority で先読みするが、
// 面積の大きい見出しが最初に確定するよう DOM 上でも先に置く。
export const LandingHero = () => (
  <section className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[2rem] px-2 pt-4 pb-2 text-center">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <span className="animate-drift absolute -top-6 -left-10 size-40 rounded-full bg-accent/15 blur-3xl" />
      <span className="animate-float-slow absolute top-20 -right-8 size-44 rounded-full bg-[#8dbe9a]/25 blur-3xl" />
    </div>

    <p className="animate-soft-fade text-sm font-bold tracking-wide text-accent">
      大切にしたいこと × 小さな一歩
    </p>
    <h1 className="text-[2rem] leading-tight font-bold text-ink sm:text-4xl">
      価値に紐づく、
      <br />
      小さな一歩を。
    </h1>
    <p className="max-w-xs leading-relaxed text-ink-soft sm:max-w-sm">
      人と関わる場面の不安に、自分が大切にしたいことと結びつけて、少しずつ慣れていく。その一歩を記録して振り返るセルフヘルプアプリです。
    </p>

    <Illustration
      src="/illustrations/peeps/person-standing.svg"
      width={1179}
      height={3291}
      priority
      className="animate-float mt-1 w-28 sm:w-32"
    />
  </section>
)
