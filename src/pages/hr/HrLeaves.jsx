import { useState } from 'react';
import { Check, X } from 'lucide-react';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import usePagination        from '../../hooks/usePagination';

import PageHeader  from '../../components/common/PageHeader';
import DataTable   from '../../components/ui/DataTable';
import Button      from '../../components/ui/Button';
import { toast }   from '../../components/ui/Toast';

const INITIAL = [
  { id: 'l1', employee: 'Sam Wilson',   type: 'Annual',   from: '2026-07-10', to: '2026-07-14', reason: 'Family vacation', status: 'Pending'  },
  { id: 'l2', employee: 'Jordan Lee',   type: 'Sick',     from: '2026-07-17', to: '2026-07-17', reason: 'Unwell',          status: 'Pending'  },
  { id: 'l3', employee: 'Casey Nguyen', type: 'Personal', from: '2026-07-21', to: '2026-07-22', reason: 'Appointment',     status: 'Approved' },
  { id: 'l4', employee: 'Riley Patel',  type: 'Annual',   from: '2026-08-01', to: '2026-08-07', reason: 'Holiday',         status: 'Rejected' },
  { id: 'l5', employee: 'Taylor Kim',   type: 'Annual',   from: '2026-08-10', to: '2026-08-14', reason: 'Travel',          status: 'Pending'  },
  { id: 'l6', employee: 'Morgan Chen',  type: 'Sick',     from: '2026-07-25', to: '2026-07-25', reason: 'Doctor visit',    status: 'Approved' },
];

const STATUS_STYLE = {
  Pending:  'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-600',
};

const COLS = [
  { label: 'Employee'  },
  { label: 'Type',     className: 'hidden sm:table-cell' },
  { label: 'From',     className: 'hidden md:table-cell' },
  { label: 'To',       className: 'hidden md:table-cell' },
  { label: 'Reason',   className: 'hidden lg:table-cell' },
  { label: 'Status'   },
  { label: 'Actions'  },
];

function HrLeaves() {
  useDocumentTitle('Leave Requests');
  const [requests, setRequests] = useState(INITIAL);

  const pagination = usePagination(requests, 8);

  const update = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Leave request ${status.toLowerCase()}.`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Requests"
        subtitle="Review and action all employee leave applications."
      />

      <DataTable
        columns={COLS}
        data={pagination.paginatedItems}
        keyExtractor={(r) => r.id}
        emptyTitle="No leave requests"
        emptyMessage="No requests have been submitted yet."
        pagination={pagination}
        renderRow={(r) => (
          <>
            <td className="px-5 py-3.5 font-medium text-slate-800">{r.employee}</td>
            <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{r.type}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs tabular-nums hidden md:table-cell">{r.from}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs tabular-nums hidden md:table-cell">{r.to}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs hidden lg:table-cell truncate max-w-[140px]">{r.reason}</td>
            <td className="px-5 py-3.5">
              <span className={`badge ${STATUS_STYLE[r.status]}`}>{r.status}</span>
            </td>
            <td className="px-5 py-3.5">
              {r.status === 'Pending' && (
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost" size="sm"
                    leftIcon={<Check size={13} />}
                    onClick={() => update(r.id, 'Approved')}
                    className="text-emerald-600 hover:bg-emerald-50"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    leftIcon={<X size={13} />}
                    onClick={() => update(r.id, 'Rejected')}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </td>
          </>
        )}
      />
    </div>
  );
}

export default HrLeaves;
