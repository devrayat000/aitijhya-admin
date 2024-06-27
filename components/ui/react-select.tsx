"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import ReactSelect, { OptionsOrGroups } from "react-select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem } from "./select";

type SelectContextType = {
  options: OptionsOrGroups<any, any>;
  setOptions: Dispatch<SetStateAction<OptionsOrGroups<any, any>>>;
};

const useSelectScope = SelectPrimitive.createSelectScope();
const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx)
    throw new Error("useSelectContext must be used within a SelectRoot");
  return ctx;
}

function SelectRoot({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<OptionsOrGroups<any, any>>([]);

  return (
    <SelectContext.Provider value={{ options, setOptions }}>
      <Select />
      {children}
    </SelectContext.Provider>
  );
}

function Select() {
  const { options } = useSelectContext();
  return (
    <ReactSelect
      options={options}
      components={{
        Group: SelectGroup,
        ValueContainer: SelectContent,
      }}
    />
  );
}

function SelectOptions(props: SelectPrimitive.SelectItemProps) {
  const { setOptions } = useSelectContext();
  useEffect(() => {
    setOptions((prev) => [...prev, props]);
    return () => {
      setOptions((prev) =>
        prev.filter((option) => option.value !== props.value)
      );
    };
  }, [props, setOptions]);

  return null;
}
