import { useState } from 'react';
import { ChevronDown, ChevronRight, Files, Folder, MoreHorizontal } from 'lucide-react';
import type { KBArticle, KBFolder } from '@/types';
import {
  getRootCategories,
  getChildFolders,
  getArticlesInFolder,
  getAllArticlesInCategory,
  getUnitPath,
  flattenUnits,
  getUnit,
} from '@/data/mock-data';

export type SidebarSelection = 'all' | { type: 'folder'; folderId: string };

interface KBSidebarProps {
  unitId: string;
  showSubUnits: boolean;
  selection: SidebarSelection;
  onSelect: (selection: SidebarSelection) => void;
}

function articlesVisibleToUnit(articles: KBArticle[], unitId: string, showSubUnits: boolean): KBArticle[] {
  const path = getUnitPath(unitId);
  const parentIds = new Set(path.slice(0, -1).map((u) => u.id));
  const currentUnit = getUnit(unitId);
  const subUnitIds = new Set<string>();
  if (currentUnit) {
    flattenUnits(currentUnit).forEach((u) => {
      if (u.id !== unitId) subUnitIds.add(u.id);
    });
  }
  return articles.filter((a) => {
    if (a.status === 'archived') return false;
    if (parentIds.has(a.unitId)) return true;
    if (a.unitId === unitId) return true;
    if (showSubUnits && subUnitIds.has(a.unitId)) return true;
    return false;
  });
}

interface FolderRowProps {
  folder: KBFolder;
  count: number;
  selected: boolean;
  expanded?: boolean;
  hasChildren?: boolean;
  depth: number;
  onSelect: () => void;
  onToggleExpand?: () => void;
}

function FolderRow({ folder, count, selected, expanded, hasChildren, depth, onSelect, onToggleExpand }: FolderRowProps) {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center gap-1.5 h-8 cursor-pointer rounded-md select-none ${
        selected ? 'bg-[#e6f0fb] text-[#006bd6]' : 'text-[#1f242e] hover:bg-[#f5f6f8]'
      }`}
      style={{ paddingLeft: 8 + depth * 20, paddingRight: 8 }}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand?.();
          }}
          className="flex items-center justify-center w-4 h-4 shrink-0 text-[#697a9b] hover:text-[#1f242e]"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      ) : (
        <span className="w-4 h-4 shrink-0" />
      )}
      <Folder
        className="w-4 h-4 shrink-0"
        style={{ color: folder.color, fill: folder.color }}
      />
      <span className={`flex-1 truncate text-[14px] ${selected ? 'font-medium' : ''}`}>
        {folder.name}
      </span>
      <span className={`text-[12px] ${selected ? 'text-[#006bd6]' : 'text-[#697a9b]'} group-hover:hidden`}>
        {count}
      </span>
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-[#697a9b] hover:bg-white hover:text-[#1f242e]"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function KBSidebar({ unitId, showSubUnits, selection, onSelect }: KBSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['cat-onboarding']));

  const rootCategories = getRootCategories();

  const totalArticles = articlesVisibleToUnit(
    rootCategories.flatMap((c) => getAllArticlesInCategory(c.id)),
    unitId,
    showSubUnits,
  );

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFolderSelected = (id: string): boolean =>
    typeof selection === 'object' && selection.type === 'folder' && selection.folderId === id;

  const allSelected = selection === 'all';

  return (
    <div className="w-[280px] shrink-0 border-r border-[#edeff3] bg-white flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-2 divide-y divide-[#edeff3] [&>*+*]:pt-2">
        {/* All articles */}
        <div
          onClick={() => onSelect('all')}
          className={`flex items-center gap-2 h-8 px-2 cursor-pointer rounded-md select-none ${
            allSelected ? 'bg-[#e6f0fb] text-[#006bd6]' : 'text-[#1f242e] hover:bg-[#f5f6f8]'
          }`}
        >
          <Files className="w-4 h-4 shrink-0" />
          <span className={`flex-1 text-[14px] ${allSelected ? 'font-medium' : ''}`}>All articles</span>
          <span className={`text-[12px] ${allSelected ? 'text-[#006bd6]' : 'text-[#697a9b]'}`}>
            {totalArticles.length}
          </span>
        </div>

        {/* Own folders section */}
        <div className="flex flex-col">
          <div className="flex flex-col">
            {rootCategories
              .map((cat) => {
                const subs = getChildFolders(cat.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((sub) => ({
                    folder: sub,
                    count: articlesVisibleToUnit(getArticlesInFolder(sub.id), unitId, showSubUnits).length,
                  }))
                  .filter((s) => s.count > 0);
                const totalCount = articlesVisibleToUnit(getAllArticlesInCategory(cat.id), unitId, showSubUnits).length;
                return { cat, subs, totalCount };
              })
              .filter(({ totalCount }) => totalCount > 0)
              .map(({ cat, subs, totalCount }) => {
                const isExpanded = expanded.has(cat.id);
                return (
                  <div key={cat.id} className="flex flex-col">
                    <FolderRow
                      folder={cat}
                      count={totalCount}
                      selected={isFolderSelected(cat.id)}
                      expanded={isExpanded}
                      hasChildren={subs.length > 0}
                      depth={0}
                      onSelect={() => onSelect({ type: 'folder', folderId: cat.id })}
                      onToggleExpand={() => toggleExpand(cat.id)}
                    />
                    {isExpanded &&
                      subs.map(({ folder: sub, count }) => (
                        <FolderRow
                          key={sub.id}
                          folder={sub}
                          count={count}
                          selected={isFolderSelected(sub.id)}
                          depth={1}
                          onSelect={() => onSelect({ type: 'folder', folderId: sub.id })}
                        />
                      ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
