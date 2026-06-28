import { authHandlers } from '@/test/handlers/auth'
import { exposuresHandlers } from '@/test/handlers/exposures'
import { valuesHandlers } from '@/test/handlers/values'

export const handlers = [
  ...authHandlers,
  ...valuesHandlers,
  ...exposuresHandlers,
]
