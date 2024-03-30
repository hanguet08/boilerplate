import { uid } from '@/ultils/function';
import { message } from '@/UI';
import { CloseIcon } from '../icons/common';
interface IProps {
  key?: string;
  msg?: string;
}

const GMessage = ({ key, msg }: IProps) => {
  return (
    <div className="flex items-center gap-x-6 max-w-[900px]">
      <span>{msg}</span>
      <CloseIcon
        className="text-xl hover:cursor-pointer rounded-[50%] p-1"
        onClick={() => {
          message.destroy(key);
        }}
      />
    </div>
  );
};

const DEFAULT_MESSAGE_DURATION = 3;
message.config({
  duration: DEFAULT_MESSAGE_DURATION,
  maxCount: 5, // Tối đa hiện 5 message
});

export const showMessage = {
  success: (msg) => {
    const key = uid(6);
    message.success({ key, content: GMessage({ key, msg }), className: 'message-custom' });
  },
  info: (msg) => {
    const key = uid(6);
    message.info({ key, content: GMessage({ msg }), className: 'message-custom' });
  },
  warn: (msg) => {
    const key = uid(6);
    message.warning({
      key,
      content: GMessage({
        key,
        msg,
      }),
      className: 'message-custom',
    });
  },
  error: (msg) => {
    const key = uid(6);
    message.error({ key, content: GMessage({ key, msg }), className: 'message-custom' });
  },
  loading: (msg) => {
    const key = uid(6);
    message.loading({ key, content: GMessage({ key, msg }), className: 'message-custom' });
  },
};
