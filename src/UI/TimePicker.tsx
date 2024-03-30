import { default as GTimePicker } from 'antd/lib/time-picker';
import { CustomFormat } from 'rc-picker/lib/interface';
import { Dayts } from '@/ultils/time';

interface IProps {
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  format?: string | CustomFormat<Dayts> | (string | CustomFormat<Dayts>)[];
  value?: Dayts;
  onChange?: (time: Dayts, timeString: string) => void;
  className?: string;
}

export default function TimePicker({
  allowClear,
  disabled,
  placeholder,
  format,
  value,
  onChange,
  className = '',
}: IProps) {
  return (
    <GTimePicker
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder}
      format={format}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

TimePicker.RangePicker = GTimePicker.RangePicker;
