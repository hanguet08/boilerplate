import { CloseIcon } from '@/components/icons/common';
interface IProps {
  label: string;
  handleCancel: () => void;
}
export default function Title(props: IProps) {
  return (
    <>
      <CloseIcon
        className="absolute right-[10px] top-[12px] hover:cursor-pointer"
        onClick={props.handleCancel}
      />
      <p className="w-full text-center font-semibold">{props.label}</p>
    </>
  );
}
