// axios の 401→refresh 失敗時に、認証 Context をクリアするための橋渡し。
// axios（lib）が stores/auth を直接 import すると循環するため、コールバックを登録する形にする。

type UnauthorizedHandler = () => void

let handler: UnauthorizedHandler | null = null

export const setUnauthorizedHandler = (fn: UnauthorizedHandler | null) => {
  handler = fn
}

export const emitUnauthorized = () => handler?.()
