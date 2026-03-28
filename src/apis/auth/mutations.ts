import { mutationOptions } from '@tanstack/react-query';
import { deleteMyAccount, logout, putMyInfo, signup } from '.';

export const authMutationKeys = {
  signup: () => ['signup'] as const,
  logout: () => ['logout'] as const,
  withdraw: () => ['withdraw'] as const,
  updateMyInfo: () => ['modifyMyInfo'] as const,
};

export const authMutations = {
  signup: () =>
    mutationOptions({
      mutationKey: authMutationKeys.signup(),
      mutationFn: signup,
    }),
  logout: () =>
    mutationOptions({
      mutationKey: authMutationKeys.logout(),
      mutationFn: logout,
    }),
  withdraw: () =>
    mutationOptions({
      mutationKey: authMutationKeys.withdraw(),
      mutationFn: deleteMyAccount,
    }),
  updateMyInfo: () =>
    mutationOptions({
      mutationKey: authMutationKeys.updateMyInfo(),
      mutationFn: putMyInfo,
    }),
};
