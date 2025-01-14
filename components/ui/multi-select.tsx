import React, { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

import { url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';

import { Button } from './button';
import { Text } from './text';

export type MultiSelectShape = Record<string, unknown>;

export type MultiSelectProps<T extends MultiSelectShape> = {
  /**
   * The placeholder text for the search input
   */
  placeholder: string;
  /**
   * The data to display in the dropdown
   */
  data: T[];
  /**
   * The currently selected values
   */
  selectedValues: T[];
  /**
   * A render prop for the icon
   */
  iconRenderProp?: (item: T) => React.ReactNode;
  /**
   * Dispatch to set selected values
   */
  setSelectedValues: (newValues: T[]) => void;
  /**
   * Callback on item selection
   */
  onSelectItem?: (value: T) => void;
  /**
   * Callback on item deselection
   */
  onDeselectItem?: (value: T) => void;
  /**
   * A message to show when an empty data array is passed
   */
  emptyMessage?: string;
  /**
   * The key to use for the name of the item
   */
  nameKey?: keyof T;
  /**
   * The key to use for the id of the item
   */
  idKey?: keyof T;
  /**
   * If true, only one item can be selected at a time
   */
  isSingleSelect?: boolean;
  /**
   * If true, show the search input
   */
  withSearch?: boolean;
  /**
   * If true, show the checkbox
   */
  withCheckbox?: boolean;
  /**
   * If true, consumer can deselect all items
   */
  asRadio?: boolean;
  /**
   * If true, show the add new button
   */
  withAddNewButton?: boolean;
  /**
   * The title for add new button
   */
  addNewButtonTitle?: string;
  /**
   * If true, show the add new button when the searched item doesn't exist in the list
   */
  withAddNewFromSearchValueButton?: boolean;
  /**
   * Function to trigger add new item e.g to pop a dialog/popup
   */
  addNewButtonAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /**
   * Function to add new item and return the added item, to be added to selected values or used as selected value
   */
  addNewFromSearchValueButtonAction?: (item: string) => Promise<T>;

  /** Custom search input value */

  customSearchInputValue?: string;

  /** Set custom search input value */
  setCustomSearchInputValue?: React.Dispatch<React.SetStateAction<string>>;
};

export function MultiSelect<T extends MultiSelectShape>({
  placeholder,
  data = [],
  selectedValues = [],
  setSelectedValues,
  iconRenderProp,
  onSelectItem,
  onDeselectItem,
  isSingleSelect,
  emptyMessage,
  nameKey,
  idKey,
  withSearch = true,
  withCheckbox = true,
  asRadio,
  addNewButtonTitle,
  withAddNewButton,
  withAddNewFromSearchValueButton,
  addNewButtonAction,
  addNewFromSearchValueButtonAction,
  open,
  onOpenChange,
  customSearchInputValue,
  setCustomSearchInputValue,
}: MultiSelectProps<T>) {
  return (
    <Command shouldFilter={false}>
      {!data.length ? (
        <EmptyBody emptyMessage={emptyMessage} />
      ) : (
        <SelectBody
          placeholder={placeholder}
          data={data}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          iconRenderProp={iconRenderProp}
          onSelectItem={onSelectItem}
          onDeselectItem={onDeselectItem}
          isSingleSelect={isSingleSelect}
          nameKey={nameKey}
          idKey={idKey}
          withSearch={withSearch}
          withCheckbox={withCheckbox}
          asRadio={asRadio}
          addNewButtonTitle={addNewButtonTitle}
          withAddNewButton={withAddNewButton}
          withAddNewFromSearchValueButton={withAddNewFromSearchValueButton}
          addNewButtonAction={addNewButtonAction}
          addNewFromSearchValueButtonAction={addNewFromSearchValueButtonAction}
          open={open}
          onOpenChange={onOpenChange}
          customSearchInputValue={customSearchInputValue}
          setCustomSearchInputValue={setCustomSearchInputValue}
        />
      )}
    </Command>
  );
}

function EmptyBody({ emptyMessage }: { emptyMessage?: string }) {
  return (
    <div className="p-4 text-center text-sm">
      <Text className="text-sm">{emptyMessage || 'No data found.'}</Text>
    </div>
  );
}

function SelectBody<T extends MultiSelectShape>({
  placeholder,
  data,
  selectedValues,
  setSelectedValues,
  iconRenderProp,
  onSelectItem,
  onDeselectItem,
  isSingleSelect,
  withSearch,
  withCheckbox,
  asRadio,
  nameKey = 'name' as keyof T,
  idKey = 'id' as keyof T,
  addNewButtonTitle,
  withAddNewButton,
  withAddNewFromSearchValueButton,
  addNewButtonAction,
  addNewFromSearchValueButtonAction,
  onOpenChange,
  customSearchInputValue,
  setCustomSearchInputValue,

  open,
}: MultiSelectProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  function deselectItem(item: T) {
    if (asRadio && selectedValues.length === 1) return; // A radio must have a selected value

    if (isSingleSelect) {
      setSelectedValues([]);
    } else {
      setSelectedValues(selectedValues.filter(value => value[idKey] !== item[idKey]));
    }
    onDeselectItem?.(item);
  }

  function selectItem(item: T) {
    if (isSingleSelect) {
      setSelectedValues([item]);
    } else {
      setSelectedValues([...selectedValues, item]);
    }
    onSelectItem?.(item);
  }

  async function handleAddNewItem() {
    if (addNewButtonAction) {
      addNewButtonAction();
      return;
    }

    if (addNewFromSearchValueButtonAction) {
      setIsAdding(true);
      const item = await addNewFromSearchValueButtonAction(
        customSearchInputValue ? customSearchInputValue : searchValue,
      );
      setIsAdding(false);
      customSearchInputValue ? setCustomSearchInputValue?.('') : setSearchValue('');
      selectItem(item);
    }
  }

  const options = useMemo(
    () =>
      (customSearchInputValue ? customSearchInputValue : searchValue)
        ? data.filter(item =>
            (item[nameKey] as string)
              ?.toLocaleLowerCase()
              ?.includes((customSearchInputValue ? customSearchInputValue : searchValue)?.toLocaleLowerCase()),
          )
        : data,
    [data, customSearchInputValue, searchValue, nameKey],
  );

  const showButton =
    withAddNewButton ||
    (withAddNewFromSearchValueButton &&
      !!(customSearchInputValue ? customSearchInputValue : searchValue) &&
      !options.length);

  return (
    <>
      {withSearch && (
        <CommandInput
          placeholder={placeholder}
          value={customSearchInputValue ? customSearchInputValue : searchValue}
          onValueChange={setCustomSearchInputValue ? setCustomSearchInputValue : setSearchValue}
          className="text-text"
        />
      )}

      <CommandList className="text-text">
        {options.length ? (
          <CommandGroup>
            {options.map((item, idx) => {
              const isSelected = !!selectedValues.length
                ? isSingleSelect
                  ? selectedValues[0][idKey] === item[idKey]
                  : !!selectedValues.find(value => value[idKey] === item[idKey])
                : false;

              return (
                <CommandItem
                  className={cn(isSelected ? 'bg-primary-1 text-white hover:bg-primary-1' : '')}
                  value={item[idKey] as string}
                  key={`${item[idKey] as string}-${idx}`}
                  onSelect={() => {
                    if (isSelected) {
                      deselectItem(item);
                    } else {
                      selectItem(item);
                    }
                    onOpenChange?.(false);
                  }}
                >
                  <Checkbox checked={isSelected} className={cn('mr-2', { 'sr-only': !withCheckbox })} />
                  {iconRenderProp ? (
                    <span className="mr-2">{iconRenderProp(item)}</span>
                  ) : item.icon ? (
                    <Image
                      src={url(item.icon as string)}
                      alt={item[nameKey] as string}
                      className="mr-2"
                      width={16}
                      height={16}
                    />
                  ) : null}
                  <span>{item[nameKey] as string}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ) : (
          <p className="py-6 text-center text-sm text-text">No results found</p>
        )}

        {selectedValues.length > 0 && !isSingleSelect && !searchValue && (
          <>
            <CommandSeparator className="bg-white/10" />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedValues([]);
                }}
                className="justify-center text-center"
              >
                Clear selection
              </CommandItem>
            </CommandGroup>
          </>
        )}
        {showButton ? (
          <>
            <CommandSeparator className="bg-white/10" />
            <CommandGroup>
              <Button
                className="h-[28px] w-full font-semibold"
                size="sm"
                type="submit"
                variant="primary"
                onClick={handleAddNewItem}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : addNewButtonTitle || `Add ${searchValue}`}
              </Button>
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </>
  );
}
