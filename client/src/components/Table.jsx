import { useState } from "react";
import { Trash2, Pencil, Plus, X, Check } from "lucide-react";

const initialData = [
  { id: 1, name: "Ravi Kumar", email: "ravi@example.com", role: "Admin" },
  { id: 2, name: "Ananya Singh", email: "ananya@example.com", role: "Editor" },
  { id: 3, name: "Vikram Rao", email: "vikram@example.com", role: "Viewer" },
];

let nextId = 4;

export default function CrudTable() {
  const [rows, setRows] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", email: "", role: "" });
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ name: "", email: "", role: "" });

  // ---- DELETE ----
  function handleDelete(id) {
    setRows((prev) => prev.filter((row) => row.id !== id));
    if (editingId === id) setEditingId(null);
  }

  // ---- START EDIT ----
  function startEdit(row) {
    setEditingId(row.id);
    setDraft({ name: row.name, email: row.email, role: row.role });
  }

  // ---- SAVE EDIT (UPDATE) ----
  function saveEdit(id) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...draft } : row))
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // ---- CREATE ----
  function handleAdd() {
    if (!newRow.name.trim() || !newRow.email.trim()) return;
    setRows((prev) => [...prev, { id: nextId++, ...newRow }]);
    setNewRow({ name: "", email: "", role: "" });
    setAdding(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800">Users</h1>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr className="border-t border-slate-100 bg-slate-50/60">
                <td className="px-6 py-2">
                  <input
                    autoFocus
                    value={newRow.name}
                    onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                    placeholder="Name"
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </td>
                <td className="px-6 py-2">
                  <input
                    value={newRow.email}
                    onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
                    placeholder="Email"
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </td>
                <td className="px-6 py-2">
                  <input
                    value={newRow.role}
                    onChange={(e) => setNewRow({ ...newRow, role: e.target.value })}
                    placeholder="Role"
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </td>
                <td className="px-6 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleAdd}
                      className="p-1.5 rounded-md text-green-600 hover:bg-green-50"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setAdding(false);
                        setNewRow({ name: "", email: "", role: "" });
                      }}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                {editingId === row.id ? (
                  <>
                    <td className="px-6 py-2">
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        value={draft.email}
                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        value={draft.role}
                        onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => saveEdit(row.id)}
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3 text-slate-800 font-medium">{row.name}</td>
                    <td className="px-6 py-3 text-slate-500">{row.email}</td>
                    <td className="px-6 py-3">
                      <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {row.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(row)}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {rows.length === 0 && !adding && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  No users yet. Click "Add" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}