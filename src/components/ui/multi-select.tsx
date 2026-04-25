
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

const multiSelectVariants = cva(
  'm-0 flex w-full p-0 data-[state=open]:border-ring',
  {
    variants: {
      variant: {
        default: 'border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
  }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      variant,
      options,
      selected,
      onChange,
      placeholder = 'Select an option',
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    const handleSelect = (value: string) => {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    };

    const handleRemove = (value: string) => {
      onChange(selected.filter((v) => v !== value));
    };

    const selectedLabels = selected
      .map((value) => options.find((option) => option.value === value)?.label)
      .filter(Boolean);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-auto min-h-10 w-full justify-start',
              className,
            )}
            {...props}
          >
            <div className="flex w-full flex-wrap items-center gap-1.5">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      const valueToRemove = options.find(o => o.label === label)?.value;
                      if (valueToRemove) {
                        handleRemove(valueToRemove);
                      }
                    }}
                  >
                    {label}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !inputValue) {
                if (selected.length > 0) {
                  handleRemove(selected[selected.length - 1]);
                }
              }
            }}
          >
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      'cursor-pointer',
                      selected.includes(option.value) &&
                        'font-bold text-primary',
                    )}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
