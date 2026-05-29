import "server-only";
import { createClient } from "@supabase/supabase-js";

const MAX_FIELD_LENGTH = 1200;
const LEADS_TABLE = "leads";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  program: string;
  source_domain: string;
  business: string;
  role: string;
  business_stage: string;
  problem_statement: string;
  company_website?: string;
};

export type LeadRecord = Omit<LeadInput, "company_website"> & {
  id: string;
  createdAt: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  source_domain: string;
  business: string;
  role: string;
  business_stage: string;
  problem_statement: string;
};

export type ValidationResult =
  | {
      ok: true;
      data: LeadInput;
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

const allowedBusinessStages = new Set([
  "pre-revenue",
  "0-1cr",
  "1-5cr",
  "5-25cr",
  "25cr-plus",
]);

const requiredFields: Array<keyof LeadInput> = [
  "name",
  "phone",
  "email",
  "program",
  "source_domain",
  "business",
  "role",
  "business_stage",
  "problem_statement",
];

function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, MAX_FIELD_LENGTH);
}

export function validateLeadInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      ok: false,
      errors: {
        form: "Submit the application form with all required fields.",
      },
    };
  }

  const source = input as Record<string, unknown>;
  const data: LeadInput = {
    name: cleanText(source.name),
    phone: cleanText(source.phone),
    email: cleanText(source.email),
    program: cleanText(source.program),
    source_domain: cleanText(source.source_domain),
    business: cleanText(source.business),
    role: cleanText(source.role),
    business_stage: cleanText(source.business_stage),
    problem_statement: cleanText(source.problem_statement),
    company_website: cleanText(source.company_website),
  };

  const errors: Record<string, string> = {};

  for (const field of requiredFields) {
    if (!data[field]) {
      errors[field] = "This field is required.";
    }
  }

  if (data.program && data.program !== "founders") {
    errors.program = "Select a valid program.";
  }

  if (data.source_domain && data.source_domain !== "aiforfounders.org") {
    errors.source_domain = "Invalid source domain.";
  }

  if (data.phone && !/^[+()\d\s-]{7,24}$/.test(data.phone)) {
    errors.phone = "Enter a valid phone or WhatsApp number.";
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.business_stage && !allowedBusinessStages.has(data.business_stage)) {
    errors.business_stage = "Select a valid business stage.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

export function isLikelySpam(input: LeadInput) {
  return Boolean(input.company_website);
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function mapLeadRow(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    program: row.program,
    source_domain: row.source_domain,
    business: row.business,
    role: row.role,
    business_stage: row.business_stage,
    problem_statement: row.problem_statement,
  };
}

export async function saveLead(input: LeadInput): Promise<LeadRecord> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(LEADS_TABLE)
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email,
      program: input.program,
      source_domain: input.source_domain,
      business: input.business,
      role: input.role,
      business_stage: input.business_stage,
      problem_statement: input.problem_statement,
    })
    .select(
      "id, created_at, name, phone, email, program, source_domain, business, role, business_stage, problem_statement",
    )
    .single<LeadRow>();

  if (error) {
    throw new Error(`Could not save lead: ${error.message}`);
  }

  return mapLeadRow(data);
}

export async function readLeads(): Promise<LeadRecord[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(LEADS_TABLE)
    .select(
      "id, created_at, name, phone, email, program, source_domain, business, role, business_stage, problem_statement",
    )
    .order("created_at", { ascending: false })
    .returns<LeadRow[]>();

  if (error) {
    throw new Error(`Could not read leads: ${error.message}`);
  }

  return data.map(mapLeadRow);
}
