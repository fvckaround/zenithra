"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSuspend = async (user) => {
    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailVerified: !user.emailVerified }),
    });
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
  };

  const deleteUser = async (id) => {
    if (!confirm("Permanently delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const adjustBalance = async (user) => {
    const input = prompt(`Adjust balance for ${user.fullName}\nCurrent: $${user.balance}\n\nEnter new balance:`);
    if (input === null || input === "") return;
    const amount = parseFloat(input);
    if (isNaN(amount)) return alert("Invalid amount");
    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance: amount }),
    });
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-ink-muted">{users.length} registered accounts</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50 sm:w-72"
        />
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-navy-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Verified</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-ink">{user.fullName}</td>
                    <td className="px-6 py-4 text-ink-muted">{user.email}</td>
                    <td className="px-6 py-4 text-ink">${(user.balance || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.emailVerified
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => adjustBalance(user)}
                          className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                        >
                          Balance
                        </button>
                        <button
                          onClick={() => toggleSuspend(user)}
                          className={`text-xs font-medium transition-colors ${
                            user.emailVerified
                              ? "text-amber-400 hover:text-amber-300"
                              : "text-emerald-400 hover:text-emerald-300"
                          }`}
                        >
                          {user.emailVerified ? "Unverify" : "Verify"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-ink-faint">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}