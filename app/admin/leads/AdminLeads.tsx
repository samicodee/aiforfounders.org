"use client";

import { useMemo, useState } from "react";
import { leadStatuses, type LeadStatus } from "@/app/lib/lead-statuses";

type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  business: string;
  role: string;
  business_stage: string;
  problem_statement: string;
  status: LeadStatus;
  notes: string;
  last_contacted_at: string | null;
};

type LeadResponse = {
  count: number;
  leads: Lead[];
  message?: string;
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  accepted: "Accepted",
  rejected: "Rejected",
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminLeads() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "all">("all");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    if (activeStatus === "all") {
      return leads;
    }

    return leads.filter((lead) => lead.status === activeStatus);
  }, [activeStatus, leads]);

  const counts = useMemo(() => {
    return leadStatuses.reduce(
      (acc, status) => ({
        ...acc,
        [status]: leads.filter((lead) => lead.status === status).length,
      }),
      {} as Record<LeadStatus, number>,
    );
  }, [leads]);

  async function loadLeads() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/leads/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json()) as LeadResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "Could not load leads.");
      }

      setLeads(result.leads);
      setMessage(`Loaded ${result.count} lead${result.count === 1 ? "" : "s"}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load leads.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateLead(
    leadId: string,
    updates: Partial<Pick<Lead, "status" | "notes" | "last_contacted_at">>,
  ) {
    setSavingLeadId(leadId);
    setMessage("");

    try {
      const response = await fetch("/api/leads/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          ...updates,
        }),
      });
      const result = (await response.json()) as {
        lead?: Lead;
        message?: string;
      };

      if (!response.ok || !result.lead) {
        throw new Error(result.message ?? "Could not update lead.");
      }

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === result.lead?.id ? result.lead : lead,
        ),
      );
      setMessage(result.message ?? "Lead updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update lead.",
      );
    } finally {
      setSavingLeadId(null);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <div>
            <p className="kicker">AI for Founders</p>
            <h1>Lead Admin</h1>
          </div>
          <div className="admin-auth">
            <input
              aria-label="Admin token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="LEADS_ADMIN_TOKEN"
              type="password"
            />
            <button className="button primary" onClick={loadLeads} type="button">
              {isLoading ? "Loading..." : "Load Leads"}
            </button>
          </div>
        </div>

        <div className="admin-status-bar">
          <button
            className={activeStatus === "all" ? "is-active" : ""}
            onClick={() => setActiveStatus("all")}
            type="button"
          >
            All <span>{leads.length}</span>
          </button>
          {leadStatuses.map((status) => (
            <button
              className={activeStatus === status ? "is-active" : ""}
              key={status}
              onClick={() => setActiveStatus(status)}
              type="button"
            >
              {statusLabels[status]} <span>{counts[status]}</span>
            </button>
          ))}
        </div>

        {message ? <p className="admin-message">{message}</p> : null}

        <div className="lead-table-wrap">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Business</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Contacted</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <span>{lead.phone}</span>
                    <span>{lead.email}</span>
                    <small>{formatDate(lead.createdAt)}</small>
                  </td>
                  <td>
                    <strong>{lead.business}</strong>
                    <span>{lead.role}</span>
                    <p>{lead.problem_statement}</p>
                  </td>
                  <td>{lead.business_stage}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(event) =>
                        updateLead(lead.id, {
                          status: event.target.value as LeadStatus,
                        })
                      }
                      disabled={savingLeadId === lead.id}
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <textarea
                      defaultValue={lead.notes}
                      onBlur={(event) =>
                        updateLead(lead.id, {
                          notes: event.currentTarget.value,
                        })
                      }
                      placeholder="Call notes, fit, next step..."
                      rows={4}
                      disabled={savingLeadId === lead.id}
                    />
                  </td>
                  <td>
                    <span>{formatDate(lead.last_contacted_at)}</span>
                    <button
                      className="admin-small-button"
                      onClick={() =>
                        updateLead(lead.id, {
                          last_contacted_at: new Date().toISOString(),
                        })
                      }
                      type="button"
                      disabled={savingLeadId === lead.id}
                    >
                      Mark now
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6}>No leads in this view.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
