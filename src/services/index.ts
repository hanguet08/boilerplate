import ApiClient from '@/configs/ApiClient';

const GCHAT_APIURL = process.env.NEXT_PUBLIC_GCHAT_API_URL;

const gChatApi = new ApiClient(GCHAT_APIURL).getInstance();

export { gChatApi };
