import { mutationOptions } from '@tanstack/react-query';

import type { SubmitClubInformationUpdateRequestParams } from './entity';
import { submitClubInformationUpdateRequest } from '.';

export const clubInformationUpdateMutations = {
  submit: () =>
    mutationOptions({
      mutationKey: ['clubInformationUpdate', 'submit'],
      mutationFn: ({ clubId, body }: SubmitClubInformationUpdateRequestParams) =>
        submitClubInformationUpdateRequest(clubId, body),
    }),
};
