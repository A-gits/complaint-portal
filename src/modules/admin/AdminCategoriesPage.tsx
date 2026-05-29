import { useState, useMemo, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, InputAdornment, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip,
} from '@mui/material';
import SearchIcon      from '@mui/icons-material/Search';
import AddIcon         from '@mui/icons-material/Add';
import EditIcon        from '@mui/icons-material/Edit';
import DeleteIcon      from '@mui/icons-material/Delete';
import CheckIcon       from '@mui/icons-material/Check';
import CloseIcon       from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CategoryIcon    from '@mui/icons-material/Category';
import { PageHeader }  from '../../components/shared/PageHeader';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import type { Category } from '../../types';

let localCategories: Category[] = [];

export const AdminCategoriesPage = () => {
  const [categories,   setCategories]   = useState<Category[]>([]);
  const [search,       setSearch]       = useState('');

  // Inline rename state
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editName,     setEditName]     = useState('');
  const [editDesc,     setEditDesc]     = useState('');
  const [editNameErr,  setEditNameErr]  = useState('');
  const [editLoading,  setEditLoading]  = useState(false);

  // Add dialog
  const [addOpen,      setAddOpen]      = useState(false);
  const [newName,      setNewName]      = useState('');
  const [newDesc,      setNewDesc]      = useState('');
  const [newNameErr,   setNewNameErr]   = useState('');
  const [addLoading,   setAddLoading]   = useState(false);
  const [addError,     setAddError]     = useState('');

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading,setDeleteLoading]= useState(false);
  const [deleteError,  setDeleteError]  = useState('');

  // Success banner
  const [successMsg,   setSuccessMsg]   = useState('');

  useEffect(() => {
    getCategories().then(({ data }) => {
      localCategories = data.map((c) => ({ ...c }));
      setCategories([...localCategories]);
    });
  }, []);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  /* ── Search filter ── */
  const filtered = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }, [categories, search]);

  /* ── Name uniqueness check ── */
  const isDuplicate = (name: string, excludeId?: string) =>
    localCategories.some(
      (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase() && c.id !== excludeId
    );

  /* ── Add ── */
  const handleAddOpen = () => {
    setNewName(''); setNewDesc(''); setNewNameErr(''); setAddError('');
    setAddOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!newName.trim()) { setNewNameErr('Category name is required'); return; }
    if (isDuplicate(newName)) { setNewNameErr('A category with this name already exists'); return; }
    setAddLoading(true);
    setAddError('');
    try {
      await createCategory({ name: newName.trim(), description: newDesc.trim() || undefined });
      const created: Category = {
        id: `cat-${Date.now()}`,
        name: newName.trim(),
        description: newDesc.trim() || undefined,
      };
      localCategories = [...localCategories, created];
      setCategories([...localCategories]);
      setAddOpen(false);
      flash(`Category "${created.name}" created.`);
    } catch {
      setAddError('Failed to create category. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setNewName(''); setNewDesc(''); setNewNameErr(''); setAddError('');
  };

  /* ── Inline rename ── */
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description ?? '');
    setEditNameErr('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNameErr('');
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) { setEditNameErr('Name cannot be empty'); return; }
    if (isDuplicate(editName, id)) { setEditNameErr('A category with this name already exists'); return; }
    setEditLoading(true);
    try {
      await updateCategory(id, { name: editName.trim(), description: editDesc.trim() || undefined });
      localCategories = localCategories.map((c) =>
        c.id === id ? { ...c, name: editName.trim(), description: editDesc.trim() || undefined } : c
      );
      setCategories([...localCategories]);
      setEditingId(null);
      flash(`Category renamed to "${editName.trim()}".`);
    } catch {
      setEditNameErr('Failed to save. Try again.');
    } finally {
      setEditLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteCategory(deleteTarget.id);
      localCategories = localCategories.filter((c) => c.id !== deleteTarget.id);
      setCategories([...localCategories]);
      flash(`Category "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      setDeleteError('Failed to delete category. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'} configured`}
        crumbs={[{ label: 'Dashboard', path: '/admin' }, { label: 'Categories' }]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ bgcolor: '#3b82f6', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#3b82f6', filter: 'brightness(1.1)' } }}
          >
            New Category
          </Button>
        }
      />

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: '12px !important' }}>
          <TextField
            size="small"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 280 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography sx={{ ml: 'auto', color: 'text.secondary', fontSize: '0.82rem' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </Typography>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 48 }}>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right" sx={{ width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {search ? 'No categories match your search' : 'No categories yet — add one above'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cat, idx) => (
                  <TableRow key={cat.id} hover>
                    {/* Index */}
                    <TableCell>
                      <Chip
                        label={idx + 1}
                        size="small"
                        sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontWeight: 700, minWidth: 32 }}
                      />
                    </TableCell>

                    {/* Name — inline edit or display */}
                    <TableCell sx={{ minWidth: 180 }}>
                      {editingId === cat.id ? (
                        <TextField
                          value={editName}
                          onChange={(e) => { setEditName(e.target.value); setEditNameErr(''); }}
                          error={!!editNameErr}
                          helperText={editNameErr}
                          size="small"
                          autoFocus
                          sx={{ minWidth: 160 }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(cat.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{cat.name}</Typography>
                      )}
                    </TableCell>

                    {/* Description — inline edit or display */}
                    <TableCell sx={{ minWidth: 240 }}>
                      {editingId === cat.id ? (
                        <TextField
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          size="small"
                          placeholder="Optional description"
                          sx={{ minWidth: 220 }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      ) : (
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          {cat.description ?? <span style={{ fontStyle: 'italic', opacity: 0.45 }}>No description</span>}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      {editingId === cat.id ? (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Save">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSave(cat.id)}
                              disabled={editLoading}
                              sx={{ color: '#22c55e', '&:hover': { bgcolor: 'rgba(34,197,94,0.1)' } }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              size="small"
                              onClick={cancelEdit}
                              sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Rename">
                            <IconButton
                              size="small"
                              onClick={() => startEdit(cat)}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59,130,246,0.08)' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => { setDeleteTarget(cat); setDeleteError(''); }}
                              sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Add Category dialog ── */}
      <Dialog
        open={addOpen}
        onClose={handleAddClose}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: 'background.paper', backgroundImage: 'none', borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CategoryIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>New Category</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                Add a complaint category
              </Typography>
            </Box>
            <IconButton onClick={handleAddClose} size="small" sx={{ ml: 'auto', color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1 }}>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Category Name"
              placeholder="e.g. Technical Support"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNewNameErr(''); }}
              error={!!newNameErr}
              helperText={newNameErr}
              fullWidth
              size="small"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); }}
            />
            <TextField
              label="Description"
              placeholder="Optional — briefly describe this category"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button onClick={handleAddClose} color="inherit" disabled={addLoading}
            sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            disabled={addLoading}
            sx={{ bgcolor: '#3b82f6', fontWeight: 700, '&:hover': { bgcolor: '#3b82f6', filter: 'brightness(1.1)' } }}
          >
            {addLoading ? 'Creating…' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete guard dialog ── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: 'background.paper', backgroundImage: 'none', borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Delete Category</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1 }}>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            You are about to delete{' '}
            <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              "{deleteTarget?.name}"
            </Typography>
            .
          </Typography>

          {/* Guard notice */}
          <Box sx={{
            px: 2, py: 1.5, borderRadius: 2,
            bgcolor: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.2)',
            display: 'flex', gap: 1.5, alignItems: 'flex-start',
          }}>
            <WarningAmberIcon sx={{ color: '#fbbf24', fontSize: 18, mt: '1px', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(251,191,36,0.9)', lineHeight: 1.6 }}>
              Existing complaints assigned to this category will <strong>not</strong> be affected.
              They will retain their current category label but it will no longer be selectable for new complaints.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit" disabled={deleteLoading}
            sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleteLoading}
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
          >
            {deleteLoading ? 'Deleting…' : 'Delete Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};