import type { Ref } from 'vue'
import type { SelectOption } from '../props/Select.interface'

export interface SelectFunctionality {
  selectItem(option: SelectOption): void
  toggleList(): void
  isDisabled(value: string | number): boolean
  closeDropdown(): void
  onSelect(value: string | number): void
} 