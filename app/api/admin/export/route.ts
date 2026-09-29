import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check admin session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'registrations'; // 'registrations' | 'applications'
  const format = searchParams.get('format') || 'csv'; // 'csv' | 'xlsx'
  const eventId = searchParams.get('eventId') || 'all';
  const pillar = searchParams.get('pillar') || 'all';
  const status = searchParams.get('status') || 'all';
  const query = searchParams.get('q') || '';

  let exportData: Record<string, any>[] = [];
  let filename = '3zero_export';

  if (type === 'registrations') {
    filename = `3zero_registrations_${new Date().toISOString().slice(0, 10)}`;

    let dbQuery = supabase
      .from('event_registrations')
      .select('id, submitted_at, email, status, responses, events(title, category, slug)')
      .order('submitted_at', { ascending: false });

    if (eventId !== 'all') {
      dbQuery = dbQuery.eq('event_id', eventId);
    }

    if (status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }

    const { data, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    exportData = (data || []).map((row: any) => {
      const responses = (row.responses || {}) as Record<string, any>;
      return {
        'Pass ID': row.id,
        'Event': row.events?.title || 'Unknown Event',
        'Category': row.events?.category || '',
        'Submitted At': new Date(row.submitted_at).toLocaleString(),
        'Status': row.status,
        'Full Name': responses.fullName || '',
        'Email': row.email || responses.email || '',
        'Affiliation': responses.affiliation || '',
        'Major / Department': responses.majorOrField || responses.department || '',
        'Motivation Notes': responses.motivationNotes || responses.motivation || '',
        'Phone': responses.phone || '',
      };
    });

    if (query.trim()) {
      const q = query.toLowerCase();
      exportData = exportData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      );
    }
  } else if (type === 'applications') {
    filename = `3zero_club_applications_${new Date().toISOString().slice(0, 10)}`;

    let dbQuery = supabase
      .from('club_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (pillar !== 'all') {
      dbQuery = dbQuery.eq('pillar_focus', pillar);
    }

    if (status !== 'all') {
      dbQuery = dbQuery.eq('status', status);
    }

    const { data, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    exportData = (data || []).map((row: any) => ({
      'Application ID': row.id,
      'Submitted At': new Date(row.submitted_at).toLocaleString(),
      'Status': row.status,
      'Full Name': row.full_name,
      'Email': row.email,
      'Pillar Focus': row.pillar_focus || 'general',
      'Department / Major': row.department || '',
      'Year of Study': row.year_of_study || '',
      'Phone': row.phone || '',
      'Motivation / Pitch': row.motivation || '',
    }));

    if (query.trim()) {
      const q = query.toLowerCase();
      exportData = exportData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(q))
      );
    }
  }

  // Generate requested format
  if (format === 'xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
      },
    });
  } else {
    // CSV with UTF-8 BOM for Excel compatibility
    if (exportData.length === 0) {
      return new NextResponse('\uFEFFNo data found', {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    }

    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? '';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const csvContent = '\uFEFF' + csvRows.join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  }
}
