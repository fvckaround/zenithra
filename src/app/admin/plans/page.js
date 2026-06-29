"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

const EMPTY = {
  name: "", tagline: "", minDeposit: "", maxDeposit: "",
  dailyRoi: "", durationDays: "", features: "", isActive: true,
};

const inputClass = "w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-2.5 text-sm text-ink outline-none focus:border-gold-500/50 placeholder:text-ink-faint";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((r) => r.json())
      .then((data) => { setPlans(data); setLoading(false); });
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      minDeposit: Number(form.minDeposit),
      maxDeposit: form.maxDeposit ? Number(form.maxDeposit) : null,
      dailyRoi: Number(form.dailyRoi),
      durationDays: Number(form.durationDays),
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    };

    if (editId) {
      const res = await fetch(`/api/admin/plans/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setPlans((p) => p.map((pl) => (pl._id === updated._id ? updated : pl)));
      setEditId(null);
    } else {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const newPlan = await res.json();
      setPlans((p) => [...p, newPlan]);
    }

    setForm(EMPTY);
    setShowForm(false);
    setSaving(false);
  };

  const startEdit = (plan) => {
    setForm({
      name: plan.name,
      tagline: plan.tagline || "",
      minDeposit: plan.minDeposit,
      maxDeposit: plan.maxDeposit || "",
      dailyRoi: plan.dailyRoi,
      durationDays: plan.durationDays,
      features: (plan.features || []).join(", "),
      isActive: plan.isActive,
    });
    setEditId(plan._id);
    setShowForm(true);
  };

  const deletePlan = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    setPlans((p) => p.filter((pl) => pl._id !== id));
  };

  const toggleActive = async (plan) => {
    const res = await fetch(`/api/admin/plans/${plan._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !plan.isActive }),
    });
    const updated = await res.json();
    setPlans((p) => p.map((pl) => (pl._id === updated._id ? updated : pl)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Plans</h1>
          <p className="mt-1 text-sm text-ink-muted">{plans.length} investment plans</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditId(null); setShowForm((v) => !v); }}
          className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Plan"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gold-500/20 bg-navy-800/60 p-6 space-y-4">
          <p className="text-sm font-medium text-ink">{editId ? "Edit Plan" : "Create New Plan"}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} name="name" placeholder="Plan name (e.g. Growth)" value={form.name} onChange={handleChange} />
            <input className={inputClass} name="tagline" placeholder="Tagline" value={form.tagline} onChange={handleChange} />
            <input className={inputClass} name="minDeposit" placeholder="Min deposit ($)" type="number" value={form.minDeposit} onChange={handleChange} />
            <input className={inputClass} name="maxDeposit" placeholder="Max deposit (leave blank = no limit)" type="number" value={form.maxDeposit} onChange={handleChange} />
            <input className={inputClass} name="dailyRoi" placeholder="Daily ROI (%)" type="number" step="0.01" value={form.dailyRoi} onChange={handleChange} />
            <input className={inputClass} name="durationDays" placeholder="Duration (days)" type="number" value={form.durationDays} onChange={handleChange} />
            <input className={`${inputClass} sm:col-span-2`} name="features" placeholder="Features (comma-separated)" value={form.features} onChange={handleChange} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 disabled:opacity-60 transition-colors"
            >
              <Check size={15} />
              {saving ? "Saving..." : editId ? "Update Plan" : "Create Plan"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-10 text-center text-sm text-ink-faint">
          No plans yet. Create your first investment plan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-2xl border border-white/5 bg-navy-800/60 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg text-ink">{plan.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{plan.tagline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(plan)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      plan.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-faint">Daily ROI</span>
                  <span className="text-gold-400 font-medium">{plan.dailyRoi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Duration</span>
                  <span className="text-ink">{plan.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Min deposit</span>
                  <span className="text-ink">${Number(plan.minDeposit).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-faint">Max deposit</span>
                  <span className="text-ink">{plan.maxDeposit ? `$${Number(plan.maxDeposit).toLocaleString()}` : "No limit"}</span>
                </div>
              </div>

              {plan.features?.length > 0 && (
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-ink-faint">• {f}</li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2 border-t border-white/5 pt-4">
                <button
                  onClick={() => startEdit(plan)}
                  className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-gold-400 transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => deletePlan(plan._id)}
                  className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}