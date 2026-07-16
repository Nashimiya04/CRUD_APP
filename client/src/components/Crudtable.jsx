import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Pencil, Plus, X, Check, Loader2 } from "lucide-react";


const API_URL = "https://crud-app-two-ruddy.vercel.app/users";

const api = axios.create({ baseURL: API_URL });

function normalizeRows(items) {
    return items.map((row) => ({
        ...row,
        id: row._id || row.id,
        image: row.image || "",
    }));
}

export default function CrudTableApi() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({ name: "", email: "", role: "", image: "" });

    const [adding, setAdding] = useState(false);
    const [newRow, setNewRow] = useState({ name: "", email: "", role: "", image: "" });
    const [savingId, setSavingId] = useState(null);

    function handleImageUpload(event, updater) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            updater(reader.result);
        };
        reader.readAsDataURL(file);
    }

    async function fetchUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/");
            setRows(normalizeRows(res.data));
        } catch (err) {
            setError("Failed to load users. " + (err.message || ""));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function handleAdd() {
        if (!newRow.name.trim() || !newRow.email.trim()) return;
        setSavingId("new");
        try {
            const res = await api.post("/", newRow);

            setRows((prev) => [...normalizeRows([res.data]), ...prev]);
            setNewRow({ name: "", email: "", role: "", image: "" });
            setAdding(false);
        } catch (err) {
            setError("Failed to create user. " + (err.message || ""));
        } finally {
            setSavingId(null);
        }
    }


    function startEdit(row) {
        setEditingId(row.id);
        setDraft({ name: row.name, email: row.email, role: row.role || "", image: row.image || "" });
    }

    async function saveEdit(id) {
        setSavingId(id);
        try {
            const res = await api.put(`/${id}`, draft);
            setRows((prev) =>
                prev.map((row) => (row.id === id ? normalizeRows([{ ...row, ...res.data }])[0] : row))
            );
            setEditingId(null);
        } catch (err) {
            setError("Failed to update user. " + (err.message || ""));
        } finally {
            setSavingId(null);
        }
    }

    function cancelEdit() {
        setEditingId(null);
    }


    async function handleDelete(id) {
        setSavingId(id);
        try {
            await api.delete(`/${id}`);
            setRows((prev) => prev.filter((row) => row.id !== id));
            if (editingId === id) setEditingId(null);
        } catch (err) {
            setError("Failed to delete user. " + (err.message || ""));
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-8">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h1 className="text-lg font-semibold text-slate-800">Users</h1>
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                {error && (
                    <div className="px-6 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center gap-2 text-slate-400 py-16">
                        <Loader2 size={18} className="animate-spin" /> Loading users...
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-left">
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Image</th>
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
                                        <label className="relative flex h-16 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-50 text-xs font-medium text-slate-700">
                                            {newRow.image ? (
                                                <img
                                                    src={newRow.image}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="px-2 text-center">Choose Image</span>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, (image) => setNewRow((prev) => ({ ...prev, image })))}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </label>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={handleAdd}
                                                disabled={savingId === "new"}
                                                className="p-1.5 rounded-md text-green-600 hover:bg-green-50 disabled:opacity-50"
                                                title="Save"
                                            >
                                                {savingId === "new" ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Check size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAdding(false);
                                                    setNewRow({ name: "", email: "", role: "", image: "" });
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
                                                <div className="flex flex-col items-start gap-2">
                                                    {draft.image && (
                                                        <img
                                                            src={draft.image}
                                                            alt="Edit preview"
                                                            className="h-14 w-14 object-cover rounded-md border border-slate-200"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => saveEdit(row.id)}
                                                        disabled={savingId === row.id}
                                                        className="p-1.5 rounded-md text-green-600 hover:bg-green-50 disabled:opacity-50"
                                                        title="Save"
                                                    >
                                                        {savingId === row.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Check size={16} />
                                                        )}
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
                                                    {row.role || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                {row.image ? (
                                                    <img
                                                        src={row.image}
                                                        alt={row.name}
                                                        className="h-14 w-14 object-cover rounded-md border border-slate-200"
                                                    />
                                                ) : (
                                                    <span className="text-slate-400 text-xs">No image</span>
                                                )}
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
                                                        disabled={savingId === row.id}
                                                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        {savingId === row.id ? (
                                                            <Loader2 size={15} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={15} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}

                            {rows.length === 0 && !adding && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        No users yet. Click "Add" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}






