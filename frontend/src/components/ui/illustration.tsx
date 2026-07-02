interface IllustrationProps {
  src: string
  /** 装飾目的なら空文字（aria-hidden 扱い）。意味を持つ場合のみ説明を入れる。 */
  alt?: string
  className?: string
  /** 内在アスペクト比のヒント。CLS 防止のため width/height 属性を必ず出す。 */
  width?: number
  height?: number
  /** ファーストビュー（LCP 候補）は先読みする。 */
  priority?: boolean
}

// Open Peeps などの人物イラストを CLS なく安全に描画する共通ラッパ。
// 表示サイズは className（w-40 等）で指定し、width/height 属性はアスペクト比の維持に使う。
export const Illustration = ({
  src,
  alt = '',
  className = '',
  width = 660,
  height = 1000,
  priority = false,
}: IllustrationProps) => (
  <img
    src={src}
    alt={alt}
    aria-hidden={alt === '' ? true : undefined}
    width={width}
    height={height}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
    draggable={false}
    className={`h-auto max-w-full select-none ${className}`}
  />
)
