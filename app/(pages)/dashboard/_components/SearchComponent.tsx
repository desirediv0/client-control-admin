"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  FiSearch,
  FiUser,
  FiLoader,
  FiMail,
  FiPhone,
  FiGlobe,
  FiChevronRight,
} from "react-icons/fi";
import { CHILD_SEARCH } from "@/app/GraphQL/Queries";
import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";
import { CustomSession, SearchResult } from "@/types/type";
import Link from "next/link";

export default function SearchComponent() {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;

  const parentId = sessionData?.user?.id ? sessionData.user.id : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { loading, error, data } = useQuery(CHILD_SEARCH, {
    variables: { search: debouncedTerm.toLowerCase(), parentId: parentId || "" },
    skip: debouncedTerm.length < 3 || !parentId,
    fetchPolicy: "network-only",
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedTerm(value);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-md  p-4 relative">
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search (at least 3 characters)"
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>
      {debouncedTerm.length >= 3 && (
        <div className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="flex justify-center items-center p-4">
                <FiLoader className="animate-spin text-primary text-2xl" />
              </div>
            )}
            {error && (
              <p className="text-center text-destructive p-4">
                Error: {error.message}
              </p>
            )}
            {data?.childSearch && data.childSearch.length > 0 ? (
              <div className="space-y-2 p-2">
                {data.childSearch.map((result: SearchResult) => (
                  <Link href={`/dashboard/users/${result.id}`} key={result.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-start space-y-2">
                          <div className="flex items-center space-x-3 w-full">
                            <div className="bg-primary/10 rounded-full p-2">
                              <FiUser className="text-primary text-lg" />
                            </div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {highlightText(
                                result.name.charAt(0).toUpperCase() +
                                  result.name.slice(1),
                                searchTerm
                              )}
                            </h3>
                            <FiChevronRight className="text-muted-foreground ml-auto" />
                          </div>
                          <div className="flex flex-col space-y-1 w-full pl-9">
                            <p className="text-sm text-muted-foreground flex items-center">
                              <FiMail className="mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {highlightText(result.email, searchTerm)}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <FiPhone className="mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {highlightText(result.phone, searchTerm)}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <FiGlobe className="mr-2 flex-shrink-0" />
                              <span className="truncate">
                                {highlightText(result.domain, searchTerm)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-center text-muted-foreground p-4">
                  No results found
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
