import { type Ref, ref, watch } from 'vue'
import type { SelectBoxProps } from './SelectBoxProps'
import type { SelectFunctionality } from '~/components/common/interfaces/functions/Select.interface'
import type { SelectEvents } from '~/components/common/interfaces/events/Select.interface'
import type { SelectOption } from '~/components/common/interfaces/props/Select.interface'

interface SelectBoxComposition extends SelectBoxProps, SelectFunctionality, SelectEvents {
  isShowBox: Ref<boolean>
  selectedLabel: Ref<string>
  selectedIcon: Ref<string | null>
  isActive(value: string | number): boolean
  closeDropdown(): void
}

export function SelectBoxComposition(
  props: SelectBoxProps,
  onselect: (value: string | number) => void,
  onselectBoxClick: () => void
): SelectBoxComposition {
  const isShowBox: Ref<boolean> = ref<boolean>(false)
  const selectedLabel: Ref<string> = ref<string>(props.defaultLabel || '선택하세요')
  const selectedIcon: Ref<string | null> = ref<string | null>(null)
  const selectedValue: Ref<string | number | undefined> = ref('')

  // selectedItem 변경을 감지해 값 변경 (부모 컴포넌트에서 선택 값을 초기화하는 경우 존재)
  watch(
    () => [props.selectedItem],
    () => {
      setSelectedData()
    }
  )

  watch(
    () => [props.data],
    () => {
      selectedLabel.value = props.defaultLabel || '선택하세요'
      selectedValue.value = undefined
      selectedIcon.value = null
      if (props.selectedItem) {
        setSelectedData()
      }
    }
  )

  const findItem: (value: string | number | undefined) => any = (value) => {
    return props.data?.find((option) => option[props.valueKey || 'value'] === value)
  }

  const onSelect: (value: string | number) => void = (value) => {
    onselect(value)
  }

  const toggleList: () => void = () => {
    if (props.disabledAll) return
    isShowBox.value = !isShowBox.value
    if (isShowBox.value) {
      onselectBoxClick()
    }
  }

  const isDisabled: (value: string | number) => boolean = (value) => {
    return props.disabledList?.includes(value) ?? false
  }

  const closeDropdown: () => void = () => {
    isShowBox.value = false
  }

  const selectItem: (option: SelectOption) => void = (option) => {
    const valueKey = props.valueKey || 'value'
    const labelKey = props.labelKey || 'label'
    const iconKey = props.iconKey || 'icon'
    const value = option[valueKey]

    if (props.defaultLabel) {
      selectedLabel.value = props.defaultLabel
      selectedIcon.value = null
    } else {
      selectedLabel.value = option[labelKey].toString()
      selectedIcon.value = option[iconKey] ?? null
    }

    selectedValue.value = value // 선택된 값을 selectedValue로 저장

    onSelect(value)
    closeDropdown()
  }

  const isActive: (value: string | number) => boolean = (value) => {
    return value === selectedValue.value
  }

  const setSelectedData: () => void = () => {
    const foundItem = findItem(props.selectedItem?.[props.valueKey || 'value'])
    if (foundItem) {
      // foundItem의 값이 존재할 경우
      const valueKey = props.valueKey || 'value'
      const labelKey = props.labelKey || 'label'
      const iconKey = props.iconKey || 'icon'
      const value = foundItem[valueKey]
      selectedLabel.value = foundItem[labelKey].toString()
      selectedValue.value = value // 선택된 값을 selectedValue로 저장
      selectedIcon.value = iconKey ? (foundItem[iconKey] ?? null) : null
    } else {
      selectedValue.value = ''
      selectedLabel.value = props.defaultLabel || '선택하세요'
      selectedIcon.value = null
    }
  }

  // 초기값 설정
  if (props.selectedItem !== undefined) {
    // props.selectedItem이 undefined 아닐 때, 해당 값이 props.data 배열에 포함되어 있는지 확인
    setSelectedData()
  }

  // 초기값 설정
  if (props.isFirstSelectedEvent) {
    const foundItem = findItem(props.selectedItem?.[props.valueKey || 'value'])
    if (foundItem) {
      // foundItem의 값이 존재할 경우
      selectItem(foundItem)
    }
  }

  return {
    ...props,
    isShowBox,
    selectedLabel,
    selectedIcon,
    selectItem,
    toggleList,
    isDisabled,
    isActive,
    closeDropdown,
    onSelect,
    select: onSelect,
    click: onselectBoxClick
  }
} 