'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

type DeleteSelection = {
  id: string;
  label: string;
};

interface UseEntityDeleteOptions<T> {
  // eslint-disable-next-line no-unused-vars
  deleteEntity: (id: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  getSelection: (item: T) => DeleteSelection;
  successMessage: string;
  errorMessage: string;
}

export function useEntityDelete<T>(options: UseEntityDeleteOptions<T>) {
  const { deleteEntity, getSelection, successMessage, errorMessage } = options;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeleteSelection | null>(
    null,
  );
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const requestDelete = useCallback(
    (item: T) => {
      setSelectedItem(getSelection(item));
      setIsDeleteDialogOpen(true);
    },
    [getSelection],
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedItem) return;

    try {
      await deleteEntity(selectedItem.id);
      toast.success(successMessage);
      await gridMutateRef.current?.();
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : errorMessage);
      console.error(error);
    }
  }, [deleteEntity, errorMessage, selectedItem, successMessage]);

  const onMutateReady = useCallback((mutateFn: () => Promise<unknown>) => {
    gridMutateRef.current = mutateFn;
  }, []);

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedItem,
    requestDelete,
    confirmDelete,
    onMutateReady,
  };
}