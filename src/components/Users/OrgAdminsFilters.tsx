import { SearchInput, SelectField } from "../common";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function OrgAdminsFilters({ search, onSearchChange, status, onStatusChange }: Props) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">
    <SearchInput
      widthClass="w-[280px]"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search admins or organizations..."
    />
    <SelectField value={status} onChange={(event) => onStatusChange(event.target.value)}>
      <option value="">All Statuses</option>
      <option value="Active">Active</option>
      <option value="Invited">Invited</option>
      <option value="Suspended">Suspended</option>
    </SelectField>
  </div>;
}
