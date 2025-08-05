import type { SelectProps } from '~/components/common/interfaces/props/Select.interface'

export interface SelectBoxProps extends SelectProps {
  disabledAll?: boolean
  useDelete?: boolean
  nodataMsg?: string
} 