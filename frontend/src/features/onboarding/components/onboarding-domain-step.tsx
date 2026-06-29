import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ValueDomain } from '@/lib/value-domains'
import { valueDomains } from '@/lib/value-domains'

interface OnboardingDomainStepProps {
  onSelect: (domain: ValueDomain) => void
}

export const OnboardingDomainStep = ({
  onSelect,
}: OnboardingDomainStepProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <h2 className="font-bold text-ink">どの場面のことを考えますか</h2>
      <p className="text-sm leading-relaxed text-ink-soft">
        いまの自分が気になる場面を、ひとつ選んでみましょう。あとから何度でも変えられます。
      </p>
    </div>

    <ul className="flex flex-col gap-2">
      {valueDomains.map((domain) => (
        <li key={domain.label}>
          <button
            type="button"
            onClick={() => onSelect(domain)}
            className="w-full text-left"
          >
            <Card className="flex min-h-11 items-center justify-between gap-3 p-4 transition-transform active:scale-[0.99]">
              <span className="font-bold text-ink">{domain.label}</span>
              <ChevronRight
                size={18}
                aria-hidden="true"
                className="shrink-0 text-ink-soft"
              />
            </Card>
          </button>
        </li>
      ))}
    </ul>
  </div>
)
