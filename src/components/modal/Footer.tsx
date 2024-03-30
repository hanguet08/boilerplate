import { Button } from '@/UI';
interface IProps {
  buttonLabel?: string;
  handleOk: () => void;
}
export default function Footer(props: IProps) {
  return (
    <div className="w-full flex">
      <Button
        type="primary"
        className="mx-auto px-3 py-1 h-[32px] flex items-center"
        size="small"
        onClick={props.handleOk}
      >
        {props.buttonLabel ? props.buttonLabel : 'Xác nhận'}
      </Button>
    </div>
  );
}
