import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { default as GSelect } from 'antd/lib/select';
import { DefaultOptionType, FilterFunc } from 'rc-select/lib/Select';
import { SizeType } from './lib/config-provider/SizeContext';

interface IProps {
  allowClear?: boolean;
  showSearch?: boolean;
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  suffixIcon?: ReactNode;
  size?: SizeType;
  mode?: 'multiple' | 'tags';
  maxTagCount?: number | 'responsive';
  optionLabelProp?: string;
  filterOption?: boolean | FilterFunc<DefaultOptionType>;
  options?: DefaultOptionType[];
  dropdownRender?: (
    menu: ReactElement<any, string | JSXElementConstructor<any>>,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  onDropdownVisibleChange?: (open: boolean) => void;
  defaultValue?: any;
  value?: any;
  onChange?: (value: any, option: DefaultOptionType | DefaultOptionType[]) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function Select({
  allowClear,
  showSearch,
  showArrow,
  loading,
  disabled,
  autoFocus,
  placeholder,
  suffixIcon,
  size,
  mode,
  maxTagCount,
  optionLabelProp,
  filterOption,
  options,
  dropdownRender,
  onDropdownVisibleChange,
  defaultValue,
  value,
  onChange,
  onSearch,
  onClear,
  className = '',
  children,
}: IProps) {
  return (
    <GSelect
      allowClear={allowClear}
      showSearch={showSearch}
      showArrow={showArrow}
      loading={loading}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      suffixIcon={suffixIcon}
      size={size}
      mode={mode}
      maxTagCount={maxTagCount}
      optionLabelProp={optionLabelProp}
      filterOption={filterOption}
      options={options}
      dropdownRender={dropdownRender}
      onDropdownVisibleChange={onDropdownVisibleChange}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onClear={onClear}
      className={className}
    >
      {children}
    </GSelect>
  );
}

Select.Option = GSelect.Option;
