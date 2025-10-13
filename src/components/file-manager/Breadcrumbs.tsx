"use client";

import { HomeIcon } from "lucide-react";
import { useFiles } from "@/components/providers/Provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const { getPathSegments, setCurrentPath } = useFiles();
  const segments = getPathSegments();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <BreadcrumbItem key={segment.path}>
              {isLast ? (
                <span className="flex items-center gap-1">
                  {index === 0 ? (
                    <HomeIcon className="h-4 w-4" />
                  ) : (
                    segment.name
                  )}
                </span>
              ) : (
                <BreadcrumbLink onClick={() => setCurrentPath(segment.path)}>
                  {index === 0 ? (
                    <HomeIcon className="h-4 w-4" />
                  ) : (
                    segment.name
                  )}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
