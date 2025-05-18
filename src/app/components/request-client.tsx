"use client";

import { ChevronDown, Loader2, Play } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { createContext, useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CustomTokenWithAnnotation, InnerToken } from "codehike/code";

type Param = {
  name: string;
  value: string;
  type: string;
  lineNumber: number;
};

type RequestClientContextType = {
  values: Record<string, string>;
  params: Param[];
  setValue: (_name: string, _value: string) => void;
  body: string;
};

const servers = [
  "https://api.devnet.solana.com",
  "https://api.testnet.solana.com",
  "https://api.mainnet-beta.solana.com",
];

const RequestClientContext = createContext<
  RequestClientContextType | undefined
>(undefined);

export function RequestClientProvider({
  children,
  params,
  json,
}: {
  children: React.ReactNode;
  params: Param[];
  json: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(params.map((p) => [p.name, String(p.value)])),
  );

  function setValue(name: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const body = fillParamsInJSON(json, params, values);

  return (
    <RequestClientContext.Provider value={{ values, setValue, params, body }}>
      {children}
    </RequestClientContext.Provider>
  );
}

function useRequestClient() {
  const context = useContext(RequestClientContext);
  if (context === undefined) {
    throw new Error(
      "useRequestClient must be used within a RequestClientProvider",
    );
  }
  return context;
}

export function useRequestParam(name: string): { param: Param; value: string } {
  const { values, params } = useRequestClient();
  const param = params.find((p) => p.name === name);
  if (!param) {
    throw new Error(`Parameter ${name} not found in RequestClientProvider`);
  }
  return {
    param,
    value: values[name],
  };
}

function ParamInput({
  param,
  value,
  onChange,
}: {
  param: Param;
  value: string;
  onChange: (_: string) => void;
}) {
  const [text, setText] = useState(value);
  return (
    <div className="flex items-center gap-4">
      <Label
        htmlFor={param.name}
        className="w-[100px] truncate"
        title={param.name}
      >
        {param.name}
      </Label>
      <Input
        id={param.name}
        type={param.type === "number" ? "number" : "text"}
        min={param.type === "number" ? 0 : undefined}
        value={param.type === "number" ? Number(text) : text}
        className="flex-1 h-8 max-w-lg"
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function RequestClientContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState<string | null>("");

  const { values, setValue, params, body } = useRequestClient();

  const sendRequest = async () => {
    setResponse(null);
    const response = await fetch(values["SERVER"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await response.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      data-playground={isOpen}
      className="bg-ch-tabs-background flex flex-col min-h-0 flex-1"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full gap-2 p-2 transition-colors duration-200 cursor-pointer text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground">
        <div className="flex items-center h-5 gap-2 font-medium shrink-0">
          <Play className="size-3" fill="currentColor" />
          <span className="text-ch-tab-active-foreground">Try it</span>
        </div>
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="min-h-0 flex-col flex flex-1">
        <div className="grid gap-2 px-4 [&:not(:empty)]:py-2">
          {params
            .filter((p) => p.name !== "SERVER")
            .map((param) => (
              <ParamInput
                key={param.name}
                param={param}
                value={values[param.name]}
                onChange={(value) => setValue(param.name, value)}
              />
            ))}
        </div>
        <div className="flex gap-2 p-2">
          <Select
            value={values["SERVER"]}
            onValueChange={(value) => setValue("SERVER", value)}
          >
            <SelectTrigger className="min-w-0">
              <SelectValue placeholder="Select a server" />
            </SelectTrigger>
            <SelectContent>
              {servers.map((server) => (
                <SelectItem key={server} value={server}>
                  {server}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={sendRequest}
            disabled={response === null}
            className="w-40"
          >
            {response === null ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
        {response && (
          <pre className="overflow-auto px-3 py-3 m-0 rounded-none !bg-ch-background font-mono text-sm max-h-[500px] flex-1 min-h-0">
            {response}
          </pre>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export const ParamToken: CustomTokenWithAnnotation = ({
  annotation,
  ...props
}) => {
  const paramName = annotation.data.name;
  const { param, value } = useRequestParam(paramName);
  const matches = props.value.match(/^(['"]?)(.+?)\1$/);
  const quote = matches?.[1] || "";
  const tokenValue = matches?.[2] || props.value;
  const defaultValue = String(param.value);
  const currentValue = String(value);
  const showValue =
    tokenValue === defaultValue
      ? `${quote}${currentValue}${quote}`
      : props.value;
  return <InnerToken merge={{ ...props, value: showValue }} />;
};

function fillParamsInJSON(
  json: string,
  params: Param[],
  values: Record<string, string>,
) {
  const lines = json.split("\n");
  params
    .filter((p) => p.name !== "SERVER")
    .forEach((param) => {
      lines[param.lineNumber - 1] = lines[param.lineNumber - 1].replace(
        `${param.value}`,
        values[param.name],
      );
    });
  return lines.join("\n");
}
