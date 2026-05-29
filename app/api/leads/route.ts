import { NextRequest, NextResponse } from "next/server";
import {
  isLikelySpam,
  readLeads,
  saveLead,
  validateLeadInput,
} from "@/app/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasAdminAccess(request: NextRequest) {
  const token = process.env.LEADS_ADMIN_TOKEN;

  if (!token) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Submit valid JSON.",
      },
      { status: 400 },
    );
  }

  const result = validateLeadInput(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        message: "Check the application fields.",
        errors: result.errors,
      },
      { status: 400 },
    );
  }

  if (isLikelySpam(result.data)) {
    return NextResponse.json({
      message: "Application received.",
    });
  }

  let lead;

  try {
    lead = await saveLead(result.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Could not save application. Please try again later.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      id: lead.id,
      message: "Application received. We will review it before the next step.",
    },
    { status: 201 },
  );
}

export async function GET(request: NextRequest) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json(
      {
        message: "Set LEADS_ADMIN_TOKEN and pass it as a Bearer token.",
      },
      { status: 401 },
    );
  }

  let leads;

  try {
    leads = await readLeads();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Could not read leads.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    count: leads.length,
    leads,
  });
}
