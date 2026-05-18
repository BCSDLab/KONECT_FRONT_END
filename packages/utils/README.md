# @konect/utils

공용 유틸은 subpath export로만 공개한다.

```ts
import { cn } from '@konect/utils/cn';
import { getApiErrorMessage } from '@konect/utils/api-error-message';
import useDebouncedCallback from '@konect/utils/use-debounced-callback';
```

새 유틸을 추가할 때는 `src/{name}.ts`를 만들고 `package.json`의 `exports`에 `./{name}`을 명시한다.
루트 barrel export(`@konect/utils`)는 만들지 않는다.
