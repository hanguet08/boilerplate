import { Dayts } from '@/ultils/time';
import { default as GDatePicker } from 'antd/lib/date-picker';
import type { SharedTimeProps } from 'rc-picker/lib/panels/TimePanel';

interface IProps {
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mode?: 'time' | 'date' | 'month' | 'year' | 'decade';
  format?: string;
  showTime?: boolean | SharedTimeProps<Dayts>;
  disabledDate?: (currentDate: Dayts) => boolean;
  value?: Dayts;
  onChange?: (date: Dayts, dateString: string) => void;
  className?: string;
}

export default function DatePicker({
  allowClear,
  disabled,
  placeholder,
  mode,
  format,
  showTime,
  disabledDate,
  value,
  onChange,
  className = '',
}: IProps) {
  return (
    <GDatePicker
      allowClear={allowClear}
      disabled={disabled}
      placeholder={placeholder}
      mode={mode}
      format={format}
      showTime={showTime}
      disabledDate={disabledDate}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

DatePicker.RangePicker = GDatePicker.RangePicker;
