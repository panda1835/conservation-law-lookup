import { Badge } from "@/components/ui/badge";
import {
  getIUCNBadgeColor,
  getVietnameseLegalBadgeColor,
} from "../utils/badge-utils";
import type { TranslationFunction } from "@/types/species";

interface StatusBadgeCellProps {
  status: string;
  note: string;
  isRedList: boolean;
  t: TranslationFunction;
}

export function StatusBadgeCell({
  status,
  note,
  isRedList,
  t,
}: StatusBadgeCellProps) {
  if (!status) {
    return null;
  }

  const badgeContent = (
    <Badge
      className={`text-xs px-2 py-1 ${
        isRedList
          ? `${getIUCNBadgeColor(status)} ${
              note ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
            }`
          : getVietnameseLegalBadgeColor(status)
      }`}
      title={
        isRedList && t(`iucnCategories.${status}`)
          ? t(`iucnCategories.${status}`)
          : status
      }
    >
      {status}
    </Badge>
  );

  return (
    <div className="text-center">
      <div>
        {isRedList && note ? (
          <a
            href={note}
            target="_blank"
            rel="noopener noreferrer"
            title={t(`iucnCategories.${status}`)}
          >
            {badgeContent}
          </a>
        ) : (
          badgeContent
        )}
        {!isRedList && note && (
          <div className="text-blue-400 text-xs mt-1">{note}</div>
        )}
      </div>
    </div>
  );
}
