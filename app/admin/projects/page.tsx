'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/swr-fetcher';
import {
  projectService,
  type Project,
  type ProjectListResponse,
} from '@/lib/services/project.service';
import Pagination from '@/components/admin/Pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ProjectsPage() {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.projects;
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const limit = 10;

  const { data, error, isLoading } = useSWR<ProjectListResponse>(
    `/api/admin/projects?page=${page}&limit=${limit}`,
    fetcher,
  );

  const projects = data?.data || [];
  const total = data?.pagination.total || 0;

  if (error) {
    toast.error(t.fetchError);
  }

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await projectService.delete(itemToDelete.id);
      toast.success(t.deleteSuccess);
      mutate(`/api/admin/projects?page=${page}&limit=${limit}`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.deleteError);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-myorange-100 hover:bg-myorange-200">
            <Plus className="mr-2 h-4 w-4" />
            {t.newProject}
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t.loading}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.noProjects}</p>
          <Link href="/admin/projects/new">
            <Button className="mt-4 bg-myorange-100 hover:bg-myorange-200">
              {t.createFirst}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.title}
                        </h3>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t.status[project.status]}
                        </span>
                      </div>
                      {project.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {project.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {t.metadata.slug}: {project.slug} • {t.metadata.created}
                        : {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteClick(project.id, project.title)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            currentPage={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            itemName="projects"
          />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.admin.common.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete &&
                t.deleteConfirm.replace('{title}', itemToDelete.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.admin.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {dict.admin.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
