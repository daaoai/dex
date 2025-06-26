'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/shadcn/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { Button } from '@/shadcn/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shadcn/components/ui/command';
import Text from '../ui/Text';

const options = [
  {
    value: 'inRange',
    label: 'In range',
    dotColor: 'bg-green-500',
  },
  {
    value: 'outOfRange',
    label: 'Out of range',
    dotColor: 'bg-red-500',
  },
  {
    value: 'closed',
    label: 'Closed',
    dotColor: 'bg-zinc-400',
  },
];

type Filters = {
  inRange: boolean;
  outOfRange: boolean;
  closed: boolean;
};

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function DropdownFilter({ filters, setFilters }: Props) {
  const [open, setOpen] = React.useState(false);

  const toggle = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="h-[2.125rem] py-0">
        <Button
          type="button"
          className="w-[100px] justify-between bg-white text-black border border-zinc-300 hover:bg-zinc-100 appearance-none focus:outline-none focus:ring-0 focus-visible:ring-0"
        >
          <div className="flex items-center justify-between">
            <Text type="p"> Status</Text>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 pointer-events-none" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 bg-zinc-900 text-white border-zinc-800">
        <Command>
          <CommandInput placeholder="Search filter..." className="h-9" />
          <CommandList>
            <CommandEmpty>No filters found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    toggle(option.value as keyof Filters);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className={`h-2 w-2 rounded-full mr-2 ${option.dotColor}`} />
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      filters[option.value as keyof Filters] ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
