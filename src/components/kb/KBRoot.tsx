import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  List,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { KBFolder, KBArticle } from '@/types';
import {
  getRootCategories,
  getAllArticlesInCategory,
  getArticlesInFolder,
  getChildFolders,
  getFolder,
  getUnitPath,
  flattenUnits,
  getUnit,
} from '@/data/mock-data';
import { ArticleCard, ArticleRow } from './ArticleCard';
import { EmptyState } from './EmptyState';
import { KBSidebar, type SidebarSelection } from './KBSidebar';

interface KBRootProps {
  unitId: string;
  /** Bumped on every mock-data mutation to force re-render of helper-based reads. */
  dataVersion?: number;
  onArticleClick?: (article: KBArticle) => void;
  onCreateArticle?: () => void;
}

/** Sort articles: 1. parent unit, 2. current unit, 3. sub-units */
function sortArticlesByUnitProximity(articles: KBArticle[], currentUnitId: string): KBArticle[] {
  const path = getUnitPath(currentUnitId);
  const parentIds = new Set(path.slice(0, -1).map((u) => u.id));

  const currentUnit = getUnit(currentUnitId);
  const subUnitIds = new Set<string>();
  if (currentUnit) {
    flattenUnits(currentUnit).forEach((u) => {
      if (u.id !== currentUnitId) subUnitIds.add(u.id);
    });
  }

  function rank(unitId: string): number {
    if (parentIds.has(unitId)) return 0;
    if (unitId === currentUnitId) return 1;
    if (subUnitIds.has(unitId)) return 2;
    return 3;
  }

  return [...articles].sort((a, b) => rank(a.unitId) - rank(b.unitId));
}

function filterArticlesForUnit(
  articles: KBArticle[],
  unitId: string,
  showSubUnits: boolean,
): KBArticle[] {
  const path = getUnitPath(unitId);
  const parentIds = new Set(path.slice(0, -1).map((u) => u.id));
  const currentUnit = getUnit(unitId);
  const subUnitIds = new Set<string>();
  if (currentUnit) {
    flattenUnits(currentUnit).forEach((u) => {
      if (u.id !== unitId) subUnitIds.add(u.id);
    });
  }
  return sortArticlesByUnitProximity(
    articles.filter((a) => {
      if (parentIds.has(a.unitId)) return true;
      if (a.unitId === unitId) return true;
      if (showSubUnits && subUnitIds.has(a.unitId)) return true;
      return false;
    }),
    unitId,
  );
}

interface ArticleListProps {
  articles: KBArticle[];
  viewMode: 'grid' | 'list';
  onArticleClick?: (article: KBArticle) => void;
}

function ArticleList({ articles, viewMode, onArticleClick }: ArticleListProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-3 pb-4 px-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={() => onArticleClick?.(article)} />
        ))}
      </div>
    );
  }
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-y border-[#edeff3] bg-[#fafbfc]">
          <th className="text-left text-[12px] font-medium text-[#697a9b] py-1.5 pr-4 pl-4">Article</th>
          <th className="text-left text-[12px] font-medium text-[#697a9b] py-1.5 pr-4 w-[160px]">Unit</th>
          <th className="text-left text-[12px] font-medium text-[#697a9b] py-1.5 pr-4 w-[100px]">Status</th>
          <th className="text-left text-[12px] font-medium text-[#697a9b] py-1.5 pr-4 w-[90px]">Updated</th>
          <th className="text-left text-[12px] font-medium text-[#697a9b] py-1.5 pr-4 w-[180px]">Owner</th>
          <th className="w-[40px] py-1.5 pr-2"></th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <ArticleRow key={article.id} article={article} onClick={() => onArticleClick?.(article)} />
        ))}
      </tbody>
    </table>
  );
}

interface SubCategorySectionProps {
  category: KBFolder;
  articles: KBArticle[];
  collapsed: boolean;
  onToggle: () => void;
  viewMode: 'grid' | 'list';
  onArticleClick?: (article: KBArticle) => void;
}

function SubCategorySection({ category, articles, collapsed, onToggle, viewMode, onArticleClick }: SubCategorySectionProps) {
  const [iconHovered, setIconHovered] = useState(false);
  const count = articles.filter((a) => a.status !== 'archived').length;

  return (
    <div className="flex flex-col border-t border-[#edeff3]">
      <div className="flex items-center gap-2 cursor-pointer select-none px-4 pt-3 pb-2.5" onClick={onToggle}>
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: category.color }}
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        >
          {iconHovered ? (
            collapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            )
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <h3 className="text-[14px] font-medium text-[#1f242e] leading-[20px]">
          {category.name}
        </h3>
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[12px] font-medium text-[#525f7a] bg-white border border-[#e0e4eb] rounded-lg min-w-[24px] text-center leading-[16px]">
          {count}
        </span>
      </div>

      {!collapsed && <ArticleList articles={articles} viewMode={viewMode} onArticleClick={onArticleClick} />}
    </div>
  );
}

interface CategorySectionProps {
  category: KBFolder;
  collapsed: boolean;
  onToggle: () => void;
  collapsedIds: Set<string>;
  onToggleId: (id: string) => void;
  viewMode: 'grid' | 'list';
  unitId: string;
  showSubUnits: boolean;
  onArticleClick?: (article: KBArticle) => void;
}

function CategorySection({ category, collapsed, onToggle, collapsedIds, onToggleId, viewMode, unitId, showSubUnits, onArticleClick }: CategorySectionProps) {
  const directArticles = filterArticlesForUnit(getArticlesInFolder(category.id), unitId, showSubUnits);
  const subCategories = getChildFolders(category.id).sort((a, b) => a.sortOrder - b.sortOrder);
  const subSections = subCategories
    .map((sub) => ({ category: sub, articles: filterArticlesForUnit(getArticlesInFolder(sub.id), unitId, showSubUnits) }))
    .filter((s) => s.articles.length > 0);

  const totalArticles = filterArticlesForUnit(getAllArticlesInCategory(category.id), unitId, showSubUnits);
  const count = totalArticles.filter((a) => a.status !== 'archived').length;
  const [iconHovered, setIconHovered] = useState(false);

  if (totalArticles.length === 0) return null;

  return (
    <div className="border-b border-[#edeff3] flex flex-col">
      {/* Section header */}
      <div className="flex items-center gap-2 cursor-pointer select-none px-4 pt-4 pb-3" onClick={onToggle}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: category.color }}
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        >
          {iconHovered ? (
            collapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )
          ) : (
            <BookOpen className="w-4 h-4 text-white" />
          )}
        </div>
        <h2 className="text-[16px] font-medium text-[#1f242e] leading-[24px]">
          {category.name}
        </h2>
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[12px] font-medium text-[#525f7a] bg-white border border-[#e0e4eb] rounded-lg min-w-[24px] text-center leading-[16px]">
          {count}
        </span>
      </div>

      {!collapsed && directArticles.length > 0 && (
        <ArticleList articles={directArticles} viewMode={viewMode} onArticleClick={onArticleClick} />
      )}
      {subSections.map(({ category: sub, articles }) => (
        <SubCategorySection
          key={sub.id}
          category={sub}
          articles={articles}
          collapsed={collapsedIds.has(sub.id)}
          onToggle={() => onToggleId(sub.id)}
          viewMode={viewMode}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  );
}

export function KBRoot({ unitId, dataVersion: _dataVersion, onArticleClick, onCreateArticle }: KBRootProps) {
  const [showSubUnits, setShowSubUnits] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<SidebarSelection>('all');

  const rootCategories = getRootCategories();
  const visibleCategories: KBFolder[] =
    selection === 'all'
      ? rootCategories
      : (() => {
          const f = getFolder(selection.folderId);
          return f ? [f] : [];
        })();

  const hasContent = rootCategories.some(
    (c) => getAllArticlesInCategory(c.id).length > 0
  );

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <KBSidebar
        unitId={unitId}
        showSubUnits={showSubUnits}
        selection={selection}
        onSelect={setSelection}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#edeff3]">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="relative h-7">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#697a9b]" />
            <input
              type="text"
              placeholder="Search"
              className="h-7 pl-8 pr-3 text-[14px] border border-[#e0e4eb] rounded-lg w-[220px] bg-[#fafbfc] placeholder:text-[#697a9b] focus:outline-none focus:ring-1 focus:ring-[#006bd6] focus:border-[#006bd6]"
            />
          </div>
          <button className="flex items-center justify-center w-[34px] h-7 border border-[#e0e4eb] rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-[#697a9b]" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Sub-units toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#1f242e]">Sub-units</span>
            <button
              type="button"
              role="switch"
              aria-checked={showSubUnits}
              onClick={() => setShowSubUnits((p) => !p)}
              className={`relative inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full transition-colors ${
                showSubUnits ? 'bg-[#006bd6]' : 'bg-[#c1c7d0]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[14px] w-[14px] rounded-full bg-white shadow transform transition-transform ${
                  showSubUnits ? 'translate-x-[16px] translate-y-[2px]' : 'translate-x-[2px] translate-y-[2px]'
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-[#edeff3]" />

          {/* View mode toggle */}
          <div className="flex items-center bg-[#edeff3] rounded-lg p-[2px] h-7">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center w-6 h-6 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-[0px_1px_3px_0px_rgba(31,36,46,0.1),0px_1px_2px_-1px_rgba(31,36,46,0.1)]'
                  : ''
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#1f242e]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center w-6 h-6 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white shadow-[0px_1px_3px_0px_rgba(31,36,46,0.1),0px_1px_2px_-1px_rgba(31,36,46,0.1)]'
                  : ''
              }`}
            >
              <List className="w-4 h-4 text-[#1f242e]" />
            </button>
          </div>

          {/* Create button */}
          <button
            onClick={onCreateArticle}
            className="flex items-center gap-2 h-7 px-2 text-[14px] font-medium text-white bg-[#006bd6] rounded-lg hover:bg-[#0052a3]"
          >
            <Plus className="w-5 h-5" />
            Create article
          </button>

          {/* More button */}
          <button className="flex items-center justify-center w-7 h-7 border border-[#e0e4eb] rounded-lg hover:bg-gray-50">
            <MoreHorizontal className="w-4 h-4 text-[#525f7a]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!hasContent ? (
          <EmptyState
            title="Knowledge Base is empty"
            description="Create your first article to start building your team's knowledge base."
            action={
              <button
                onClick={onCreateArticle}
                className="flex items-center gap-2 px-3 py-1.5 text-[14px] font-medium text-white bg-[#006bd6] rounded-lg hover:bg-[#0052a3]"
              >
                <Plus className="w-4 h-4" />
                Create article
              </button>
            }
          />
        ) : (
          <>
            {visibleCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                collapsed={collapsedCategories.has(category.id)}
                onToggle={() => toggleCategory(category.id)}
                collapsedIds={collapsedCategories}
                onToggleId={toggleCategory}
                viewMode={viewMode}
                unitId={unitId}
                showSubUnits={showSubUnits}
                onArticleClick={onArticleClick}
              />
            ))}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
