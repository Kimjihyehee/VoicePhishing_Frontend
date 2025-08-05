export interface SelectOption {
  label: string
  value: string | number
  icon?: string
  [key: string]: any
}

export interface SelectProps {
  data: SelectOption[]
  labelKey?: string
  valueKey?: string
  iconKey?: string
  selectedItem?: SelectOption | null
  disabledList?: (string | number)[]
  isFirstSelectedEvent?: boolean
  defaultLabel?: string
} 