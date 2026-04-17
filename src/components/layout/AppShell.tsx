import { useState, useCallback } from 'react';
import { UnitSidebar } from './UnitSidebar';
import { TopBar } from './TopBar';
import { TabBar } from './TabBar';
import { KBRoot } from '../kb/KBRoot';
import { ArticleView } from '../kb/ArticleView';
import { ArticleEditor } from '../kb/ArticleEditor';
import { ArchiveDialog } from '../kb/ArchiveDialog';
import { MoveDialog } from '../kb/MoveDialog';
import type { KBArticle, ArticleStatus } from '@/types';
import { unitTree, selectedUnitId as defaultSelectedUnitId, getUnitPath } from '@/data/mock-data';

type ModalState =
  | { type: 'none' }
  | { type: 'view'; article: KBArticle }
  | { type: 'edit'; article: KBArticle }
  | { type: 'create' };

type DialogState =
  | { type: 'none' }
  | { type: 'archive'; article: KBArticle }
  | { type: 'move'; article: KBArticle };

export function AppShell() {
  const [selectedUnitId, setSelectedUnitId] = useState(defaultSelectedUnitId);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const [, setLocalArticles] = useState<KBArticle[]>([]);

  const unitPath = getUnitPath(selectedUnitId).map((u) => u.name);

  const updateArticle = useCallback((updated: KBArticle) => {
    setLocalArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
  }, []);

  const handleSaveArticle = useCallback((saved: KBArticle) => {
    updateArticle(saved);
    setModal({ type: 'view', article: saved });
  }, [updateArticle]);

  const handleStatusChange = useCallback((article: KBArticle, status: ArticleStatus) => {
    if (status === 'archived') {
      setDialog({ type: 'archive', article });
      return;
    }
    const now = new Date().toISOString();
    const updated: KBArticle = {
      ...article,
      status,
      updatedAt: now,
      publishedAt: status === 'published' ? now : article.publishedAt,
    };
    updateArticle(updated);
    setModal({ type: 'view', article: updated });
  }, [updateArticle]);

  const handleArchiveConfirm = useCallback(() => {
    if (dialog.type !== 'archive') return;
    const now = new Date().toISOString();
    const updated: KBArticle = {
      ...dialog.article,
      status: 'archived',
      updatedAt: now,
    };
    updateArticle(updated);
    setDialog({ type: 'none' });
    setModal({ type: 'none' });
  }, [dialog, updateArticle]);

  const handleMoveConfirm = useCallback((folderId: string) => {
    if (dialog.type !== 'move') return;
    const now = new Date().toISOString();
    const updated: KBArticle = {
      ...dialog.article,
      folderId,
      updatedAt: now,
    };
    updateArticle(updated);
    setDialog({ type: 'none' });
    setModal({ type: 'view', article: updated });
  }, [dialog, updateArticle]);

  const closeModal = useCallback(() => setModal({ type: 'none' }), []);
  const closeDialog = useCallback(() => setDialog({ type: 'none' }), []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafbfc] text-[14px] text-[#1f242e]">
      <UnitSidebar
        unitTree={unitTree}
        selectedUnitId={selectedUnitId}
        onSelectUnit={setSelectedUnitId}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        <TopBar unitPath={unitPath} />
        <TabBar activeTab="kb" />
        <KBRoot
          unitId={selectedUnitId}
          onArticleClick={(article) => setModal({ type: 'view', article })}
          onCreateArticle={() => setModal({ type: 'create' })}
        />
      </div>

      {/* Entity modal */}
      {modal.type === 'view' && (
        <ArticleView
          article={modal.article}
          onClose={closeModal}
          onEdit={() => setModal({ type: 'edit', article: modal.article })}
          onStatusChange={handleStatusChange}
          onMove={(article) => setDialog({ type: 'move', article })}
        />
      )}
      {modal.type === 'edit' && (
        <ArticleEditor
          article={modal.article}
          unitId={selectedUnitId}
          onSave={handleSaveArticle}
          onClose={closeModal}
        />
      )}
      {modal.type === 'create' && (
        <ArticleEditor
          unitId={selectedUnitId}
          onSave={handleSaveArticle}
          onClose={closeModal}
        />
      )}

      {/* Confirmation dialogs */}
      {dialog.type === 'archive' && (
        <ArchiveDialog
          article={dialog.article}
          onConfirm={handleArchiveConfirm}
          onCancel={closeDialog}
        />
      )}
      {dialog.type === 'move' && (
        <MoveDialog
          article={dialog.article}
          onConfirm={handleMoveConfirm}
          onCancel={closeDialog}
        />
      )}
    </div>
  );
}
