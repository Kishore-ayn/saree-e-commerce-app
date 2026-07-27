"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { FileText, FileVideo, Trash2 } from "lucide-react";
import { deleteMedia } from "@/app/admin/media/actions";
import type { MediaItem } from "@/lib/cms/media";

export function MediaGrid({ items }: { items: MediaItem[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.storagePath}"? This cannot be undone.`)) return;

    setPendingId(item.id);
    startTransition(async () => {
      await deleteMedia(item.id, item.storagePath);
      setPendingId(null);
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No media uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="relative flex aspect-square items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            {item.fileType === "image" ? (
              <Image
                src={item.url}
                alt={item.altText ?? ""}
                fill
                sizes="200px"
                className="object-cover"
              />
            ) : item.fileType === "video" ? (
              <FileVideo className="size-8 text-neutral-400" />
            ) : (
              <FileText className="size-8 text-neutral-400" />
            )}
          </div>

          <button
            onClick={() => handleDelete(item)}
            disabled={isPending && pendingId === item.id}
            aria-label="Delete media"
            className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50 dark:bg-neutral-950/90"
          >
            <Trash2 className="size-4 text-red-600" />
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate border-t border-neutral-200 px-2 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
          >
            {item.storagePath.split("/").pop()}
          </a>
        </div>
      ))}
    </div>
  );
}
