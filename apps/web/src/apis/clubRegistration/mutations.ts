import { mutationOptions } from '@tanstack/react-query';

import type { SubmitClubRegistrationRequestParams } from './entity';
import { submitClubRegistrationRequest } from '.';

export const clubRegistrationMutations = {
  submit: () =>
    mutationOptions({
      mutationKey: ['clubRegistration', 'submit'],
      mutationFn: ({ body }: SubmitClubRegistrationRequestParams) => submitClubRegistrationRequest(body),
    }),
};
