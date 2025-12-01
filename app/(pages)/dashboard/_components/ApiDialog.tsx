"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbApi } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useApiAction } from "@/app/hooks/useApiAction";

type ApiType = "GET" | "PUT";

export interface ApiDialogProps {
  databaseType: string;
  databaseUrl: string;
  isDisabled: boolean;
}

export default function ApiDialog({ databaseUrl, isDisabled }: ApiDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiType, setApiType] = useState<ApiType | "">("");
  const { getData, performApiAction } = useApiAction(databaseUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!apiType) {
      toast.error("Please select an API type");
      return;
    }
    setIsLoading(true);
    try {
      await performApiAction(apiType, true);
      if (apiType !== "GET") {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 px-4 py-2 flex items-center justify-center"
              disabled={isDisabled}
            >
              <TbApi className="h-5 w-5 " />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isDisabled ? "Database not connected" : "Perform API Action"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">API Action</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="api-type" className="text-right font-medium">
                API Type
              </label>
              <Select
                value={apiType}
                onValueChange={(value: ApiType) => setApiType(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select API type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT (Toggle Status)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {apiType === "GET" && getData && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Site Status:</h3>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(getData, null, 2)}
                </pre>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={!apiType}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
