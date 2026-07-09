import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Edit,
  FileUp,
  Plus,
  RefreshCw,
  Trash2,
  Trophy,
} from "lucide-react";
import { achievementBoardApi } from "../../../core/api";
import {
  ActionMenu,
  Button,
  Checkbox,
  ConfirmModal,
  Dropdown,
  Input,
  Modal,
  Pagination,
  SearchInput,
  Table,
  Textarea,
} from "../../../shared/components/ui";

const VISIBILITY_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
];

const FEATURED_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "true", label: "Nổi bật" },
  { value: "false", label: "Không nổi bật" },
];

const emptyBoardForm = {
  auto: true,
  title: "",
  slug: "",
  competitionName: "",
  academicYear: "",
  description: "",
  shortDescription: "",
  targetKeyword: "",
  keywordText: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  searchIntent: "",
  seoScore: "",
  visibility: "DRAFT",
  isFeatured: false,
  sortOrder: 0,
};

const emptyRowForm = {
  studentName: "",
  schoolName: "",
  grade: "",
  score: "",
  sortOrder: 0,
};

const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;
const getResponseMeta = (response) => response?.data?.meta ?? {};

const toOptionalString = (value) => {
  const trimmed = String(value ?? "").trim();
  return trimmed || undefined;
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const downloadBlob = (response, fallbackName) => {
  const blob = response.data || response;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const contentDisposition = response.headers?.["content-disposition"];
  const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/i);

  link.href = url;
  link.download = filenameMatch?.[1]
    ? decodeURIComponent(filenameMatch[1])
    : fallbackName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const VisibilityBadge = ({ value }) => {
  const isPublished = value === "PUBLISHED";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {isPublished ? "Đã xuất bản" : "Bản nháp"}
    </span>
  );
};

const BoardFormModal = ({ isOpen, onClose, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(() => ({
    ...emptyBoardForm,
    ...initialData,
    auto: initialData?.auto ?? true,
    seoScore: initialData?.seoScore ?? "",
    sortOrder: initialData?.sortOrder ?? 0,
    isFeatured: initialData?.isFeatured ?? false,
    visibility: initialData?.visibility || "DRAFT",
  }));
  const isEdit = Boolean(initialData?.achievementBoardId);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.competitionName.trim()) {
      return;
    }

    const payload = {
      auto: Boolean(formData.auto),
      title: formData.title.trim(),
      slug: toOptionalString(formData.slug),
      competitionName: formData.competitionName.trim(),
      academicYear: toOptionalString(formData.academicYear),
      description: toOptionalString(formData.description),
      shortDescription: toOptionalString(formData.shortDescription),
      targetKeyword: toOptionalString(formData.targetKeyword),
      keywordText: toOptionalString(formData.keywordText),
      metaTitle: toOptionalString(formData.metaTitle),
      metaDescription: toOptionalString(formData.metaDescription),
      ogTitle: toOptionalString(formData.ogTitle),
      ogDescription: toOptionalString(formData.ogDescription),
      searchIntent: toOptionalString(formData.searchIntent),
      seoScore:
        formData.seoScore === "" ? undefined : Number(formData.seoScore),
      visibility: formData.visibility,
      isFeatured: Boolean(formData.isFeatured),
      sortOrder: Number(formData.sortOrder || 0),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Cập nhật bảng thành tích" : "Tạo bảng thành tích"}
      size="5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="title"
            label="Tiêu đề"
            required
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            name="competitionName"
            label="Tên cuộc thi"
            required
            value={formData.competitionName}
            onChange={handleChange}
          />
          <Input
            name="slug"
            label="Slug"
            value={formData.slug || ""}
            onChange={handleChange}
            helperText="Để trống để backend tự sinh"
          />
          <Input
            name="academicYear"
            label="Năm học"
            placeholder="2025-2026"
            value={formData.academicYear || ""}
            onChange={handleChange}
          />
          <Dropdown
            label="Trạng thái"
            value={formData.visibility}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, visibility: value }))
            }
            options={VISIBILITY_OPTIONS.filter((item) => item.value)}
          />
          <Input
            name="sortOrder"
            label="Thứ tự"
            type="number"
            value={formData.sortOrder}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Textarea
            name="shortDescription"
            label="Mô tả ngắn"
            rows={3}
            maxLength={500}
            value={formData.shortDescription || ""}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            label="Mô tả đầy đủ"
            rows={3}
            maxLength={2000}
            value={formData.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-5 rounded-sm border border-border bg-gray-50 p-3">
          <Checkbox
            id="achievement-auto-seo"
            checked={formData.auto}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, auto: checked }))
            }
            label="Tự sinh SEO bằng AI cho field còn thiếu"
          />
          <Checkbox
            id="achievement-featured"
            checked={formData.isFeatured}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFeatured: checked }))
            }
            label="Đánh dấu nổi bật"
          />
        </div>

        {!formData.auto && (
          <div className="rounded-sm border border-border p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              SEO thủ công
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                name="targetKeyword"
                label="Từ khóa chính"
                value={formData.targetKeyword || ""}
                onChange={handleChange}
              />
              <Input
                name="keywordText"
                label="Danh sách từ khóa"
                value={formData.keywordText || ""}
                onChange={handleChange}
              />
              <Input
                name="metaTitle"
                label="Meta title"
                value={formData.metaTitle || ""}
                onChange={handleChange}
              />
              <Input
                name="searchIntent"
                label="Search intent"
                value={formData.searchIntent || ""}
                onChange={handleChange}
              />
              <Textarea
                name="metaDescription"
                label="Meta description"
                rows={3}
                maxLength={500}
                value={formData.metaDescription || ""}
                onChange={handleChange}
              />
              <Textarea
                name="ogDescription"
                label="OG description"
                rows={3}
                maxLength={500}
                value={formData.ogDescription || ""}
                onChange={handleChange}
              />
              <Input
                name="ogTitle"
                label="OG title"
                value={formData.ogTitle || ""}
                onChange={handleChange}
              />
              <Input
                name="seoScore"
                label="SEO score"
                type="number"
                min={0}
                max={100}
                value={formData.seoScore}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const RowFormModal = ({ isOpen, onClose, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(() => ({
    ...emptyRowForm,
    ...initialData,
    grade: initialData?.grade ?? "",
    score: initialData?.score ?? "",
    sortOrder: initialData?.sortOrder ?? 0,
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      studentName: formData.studentName.trim(),
      schoolName: toOptionalString(formData.schoolName),
      grade: Number(formData.grade),
      score: Number(formData.score),
      sortOrder: Number(formData.sortOrder || 0),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập nhật dòng thành tích"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="studentName"
          label="Tên học sinh"
          required
          value={formData.studentName || ""}
          onChange={handleChange}
        />
        <Input
          name="schoolName"
          label="Trường"
          value={formData.schoolName || ""}
          onChange={handleChange}
        />
        <div className="grid grid-cols-3 gap-3">
          <Input
            name="grade"
            label="Khối"
            type="number"
            min={1}
            max={12}
            required
            value={formData.grade}
            onChange={handleChange}
          />
          <Input
            name="score"
            label="Điểm"
            type="number"
            min={0}
            step="0.01"
            required
            value={formData.score}
            onChange={handleChange}
          />
          <Input
            name="sortOrder"
            label="Thứ tự"
            type="number"
            value={formData.sortOrder}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Cập nhật
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const RowsManagerModal = ({
  board,
  isOpen,
  onClose,
  onDownloadTemplate,
  onImportRows,
  onEditRow,
  onDeleteRow,
  loading,
}) => {
  const rows = board?.rows || [];
  const [file, setFile] = useState(null);

  const columns = [
    {
      key: "studentName",
      label: "Học sinh",
      render: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.studentName}</p>
          <p className="text-xs text-foreground-light">
            {row.schoolName || "Chưa có trường"}
          </p>
        </div>
      ),
    },
    { key: "grade", label: "Khối", align: "center" },
    { key: "score", label: "Điểm", align: "center" },
    { key: "sortOrder", label: "Thứ tự", align: "center" },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (row) => (
        <ActionMenu
          items={[
            {
              label: "Sửa dòng",
              icon: <Edit size={14} />,
              onClick: () => onEditRow(row),
            },
            {
              label: "Xóa dòng",
              icon: <Trash2 size={14} />,
              variant: "danger",
              onClick: () => onDeleteRow(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dòng thành tích: ${board?.title || ""}`}
      size="5xl"
    >
      <div className="space-y-4">
        <div className="rounded-sm border border-border bg-gray-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Import Excel
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="w-full rounded-sm border border-border bg-white px-3 py-2 text-sm"
              />
            </div>
            <Button variant="outline" onClick={onDownloadTemplate}>
              <Download className="h-4 w-4" />
              Tải file mẫu
            </Button>
            <Button
              onClick={() => file && onImportRows(file)}
              disabled={!file}
              loading={loading}
            >
              <FileUp className="h-4 w-4" />
              Import
            </Button>
          </div>
          <p className="mt-2 text-xs text-foreground-light">
            Import sẽ thêm dòng mới, không thay thế dữ liệu cũ.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-white">
          <Table
            columns={columns}
            data={rows}
            loading={loading}
            emptyMessage="Chưa có dòng thành tích"
            emptySubMessage="Hãy tải file mẫu và import Excel để thêm dữ liệu."
          />
        </div>
      </div>
    </Modal>
  );
};

export const AchievementBoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    visibility: "",
    isFeatured: "",
    sortBy: "sortOrder",
    sortOrder: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [boardModal, setBoardModal] = useState({ open: false, data: null });
  const [rowsModalBoard, setRowsModalBoard] = useState(null);
  const [rowModal, setRowModal] = useState({ open: false, data: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteRowTarget, setDeleteRowTarget] = useState(null);

  const queryParams = useMemo(
    () => ({
      page: meta.page,
      limit: meta.limit,
      includeRows: true,
      search: filters.search || undefined,
      visibility: filters.visibility || undefined,
      isFeatured:
        filters.isFeatured === "" ? undefined : filters.isFeatured === "true",
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [filters, meta.limit, meta.page]
  );

  const loadBoards = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await achievementBoardApi.getAll(queryParams);
      setBoards(getResponseData(response) || []);
      setMeta((prev) => ({
        ...prev,
        ...getResponseMeta(response),
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không tải được danh sách bảng thành tích"
      );
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const refreshAndSyncRowsModal = async () => {
    const response = await achievementBoardApi.getAll(queryParams);
    const nextBoards = getResponseData(response) || [];
    setBoards(nextBoards);
    setMeta((prev) => ({ ...prev, ...getResponseMeta(response) }));

    if (rowsModalBoard) {
      const latestBoard = nextBoards.find(
        (item) =>
          item.achievementBoardId === rowsModalBoard.achievementBoardId
      );
      setRowsModalBoard(latestBoard || null);
    }
  };

  const handleSaveBoard = async (payload) => {
    setSaving(true);
    try {
      if (boardModal.data?.achievementBoardId) {
        await achievementBoardApi.update(
          boardModal.data.achievementBoardId,
          payload
        );
      } else {
        await achievementBoardApi.create(payload);
      }
      setBoardModal({ open: false, data: null });
      await loadBoards();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      await achievementBoardApi.delete(deleteTarget.achievementBoardId);
      setDeleteTarget(null);
      await loadBoards();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Xóa thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await achievementBoardApi.downloadRowTemplate();
      downloadBlob(response, "achievement-row-template.xlsx");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không tải được file mẫu");
    }
  };

  const handleImportRows = async (file) => {
    if (!rowsModalBoard) return;

    setSaving(true);
    try {
      await achievementBoardApi.importRows(
        rowsModalBoard.achievementBoardId,
        file
      );
      await refreshAndSyncRowsModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Import thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRow = async (payload) => {
    if (!rowModal.data?.achievementRowId) return;

    setSaving(true);
    try {
      await achievementBoardApi.updateRow(rowModal.data.achievementRowId, payload);
      setRowModal({ open: false, data: null });
      await refreshAndSyncRowsModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Cập nhật dòng thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRow = async () => {
    if (!deleteRowTarget) return;

    setSaving(true);
    try {
      await achievementBoardApi.deleteRow(deleteRowTarget.achievementRowId);
      setDeleteRowTarget(null);
      await refreshAndSyncRowsModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Xóa dòng thất bại");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "title",
      label: "Bảng thành tích",
      render: (board) => (
        <div>
          <p className="font-medium text-foreground">{board.title}</p>
          <p className="text-xs text-foreground-light">{board.slug}</p>
        </div>
      ),
    },
    { key: "competitionName", label: "Cuộc thi" },
    { key: "academicYear", label: "Năm học" },
    {
      key: "visibility",
      label: "Trạng thái",
      render: (board) => <VisibilityBadge value={board.visibility} />,
    },
    {
      key: "isFeatured",
      label: "Nổi bật",
      align: "center",
      render: (board) => (board.isFeatured ? "Có" : "Không"),
    },
    {
      key: "rows",
      label: "Dòng",
      align: "center",
      render: (board) => board.rows?.length || 0,
    },
    {
      key: "seoScore",
      label: "SEO",
      align: "center",
      render: (board) => board.seoScore ?? "-",
    },
    {
      key: "updatedAt",
      label: "Cập nhật",
      render: (board) => formatDate(board.updatedAt),
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (board) => (
        <ActionMenu
          items={[
            {
              label: "Quản lý dòng",
              icon: <Trophy size={14} />,
              onClick: () => setRowsModalBoard(board),
            },
            {
              label: "Sửa bảng",
              icon: <Edit size={14} />,
              onClick: () => setBoardModal({ open: true, data: board }),
            },
            {
              label: "Xóa bảng",
              icon: <Trash2 size={14} />,
              variant: "danger",
              onClick: () => setDeleteTarget(board),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Quản lý bảng thành tích
          </h1>
          <p className="text-sm text-foreground-light">
            Tạo bảng thành tích SEO, import Excel và quản lý từng dòng hiển thị.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadBoards} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </Button>
          <Button onClick={() => setBoardModal({ open: true, data: null })}>
            <Plus className="h-4 w-4" />
            Tạo bảng
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-sm border border-border bg-white">
        <div className="grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_180px_180px]">
          <SearchInput
            value={filters.search}
            onChange={(value) => {
              setMeta((prev) => ({ ...prev, page: 1 }));
              setFilters((prev) => ({ ...prev, search: value }));
            }}
            placeholder="Tìm tiêu đề, cuộc thi, từ khóa..."
          />
          <Dropdown
            value={filters.visibility}
            onChange={(value) => {
              setMeta((prev) => ({ ...prev, page: 1 }));
              setFilters((prev) => ({ ...prev, visibility: value }));
            }}
            options={VISIBILITY_OPTIONS}
          />
          <Dropdown
            value={filters.isFeatured}
            onChange={(value) => {
              setMeta((prev) => ({ ...prev, page: 1 }));
              setFilters((prev) => ({ ...prev, isFeatured: value }));
            }}
            options={FEATURED_OPTIONS}
          />
        </div>

        <Table
          columns={columns}
          data={boards}
          loading={loading}
          emptyMessage="Chưa có bảng thành tích"
          emptySubMessage="Tạo bảng đầu tiên để hiển thị trên trang SEO."
          emptyIcon="trophy"
          emptyActionLabel="Tạo bảng"
          onEmptyAction={() => setBoardModal({ open: true, data: null })}
        />

        <Pagination
          currentPage={meta.page || 1}
          totalPages={meta.totalPages || 1}
          totalItems={meta.total || 0}
          itemsPerPage={meta.limit || 10}
          onPageChange={(page) => setMeta((prev) => ({ ...prev, page }))}
          onItemsPerPageChange={(limit) =>
            setMeta((prev) => ({ ...prev, page: 1, limit: Number(limit) }))
          }
          disabled={loading}
        />
      </div>

      {boardModal.open && (
        <BoardFormModal
          isOpen={boardModal.open}
          initialData={boardModal.data}
          loading={saving}
          onClose={() => setBoardModal({ open: false, data: null })}
          onSubmit={handleSaveBoard}
        />
      )}

      {rowsModalBoard && (
        <RowsManagerModal
          board={rowsModalBoard}
          isOpen={Boolean(rowsModalBoard)}
          loading={saving}
          onClose={() => setRowsModalBoard(null)}
          onDownloadTemplate={handleDownloadTemplate}
          onImportRows={handleImportRows}
          onEditRow={(row) => setRowModal({ open: true, data: row })}
          onDeleteRow={(row) => setDeleteRowTarget(row)}
        />
      )}

      {rowModal.open && (
        <RowFormModal
          isOpen={rowModal.open}
          initialData={rowModal.data}
          loading={saving}
          onClose={() => setRowModal({ open: false, data: null })}
          onSubmit={handleSaveRow}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBoard}
        isLoading={saving}
        title="Xóa bảng thành tích?"
        message={
          <span>
            Bảng <strong>{deleteTarget?.title}</strong> và toàn bộ dòng bên
            trong sẽ bị xóa.
          </span>
        }
        confirmText="Xóa bảng"
      />

      <ConfirmModal
        isOpen={Boolean(deleteRowTarget)}
        onClose={() => setDeleteRowTarget(null)}
        onConfirm={handleDeleteRow}
        isLoading={saving}
        title="Xóa dòng thành tích?"
        message={`Xóa dòng của học sinh ${deleteRowTarget?.studentName || ""}?`}
        confirmText="Xóa dòng"
      />
    </div>
  );
};
