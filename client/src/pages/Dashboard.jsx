import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NoteModal from "../components/NoteModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useToast } from "../hooks/useToast.js";
import { extractErrorMessage } from "../utils/validators.js";

export default function Dashboard() {
  const { notes, totalCount, loading, searchTerm, setSearchTerm, createNote, editNote, removeNote } =
    useNotes();
  const { showToast } = useToast();

  // `editingNote` vaut : undefined (modale fermée), null (modale ouverte en
  // mode création), ou un objet note (modale ouverte en mode édition).
  const [editingNote, setEditingNote] = useState(undefined);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleModalSubmit = async ({ title, content }) => {
    if (editingNote) {
      await editNote(editingNote.id, { title, content });
    } else {
      await createNote({ title, content });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await removeNote(noteToDelete.id);
      setNoteToDelete(null);
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard-main">
        <div className="container">
          {/* ==================================================================
              En-tête de page : titre "Notes" + compteur en badge pill.
              ================================================================== */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Notes</h1>
            <span className="dashboard-count">
              {totalCount} note{totalCount > 1 ? "s" : ""} enregistrée{totalCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="dashboard-toolbar">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <button type="button" className="btn btn-primary" onClick={() => setEditingNote(null)}>
              + Nouvelle note
            </button>
          </div>

          {loading ? (
            <Loader fullPage />
          ) : notes.length === 0 ? (
            <EmptyState isSearching={Boolean(searchTerm)} onCreateClick={() => setEditingNote(null)} />
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={setEditingNote}
                  onDelete={setNoteToDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {editingNote !== undefined && (
        <NoteModal
          note={editingNote}
          onClose={() => setEditingNote(undefined)}
          onSubmit={handleModalSubmit}
        />
      )}

      {noteToDelete && (
        <ConfirmDialog
          title="Supprimer la note"
          message={
            <>
              Voulez-vous vraiment supprimer <strong>« {noteToDelete.title} »</strong> ? Cette action est
              irréversible.
            </>
          }
          confirmLabel="Supprimer"
          onConfirm={handleConfirmDelete}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </div>
  );
}