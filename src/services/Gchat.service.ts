import { gChatApi } from '.';

export const GET_ME_INFO_API = '/api/v3/auth/access_token';

export const getUserInfo = () => {
  return gChatApi.get(GET_ME_INFO_API);
};
