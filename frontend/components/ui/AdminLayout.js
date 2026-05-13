import AdminSidebar from '@/components/AdminSidebar';
import { cn } from '@/utils/cn';

/** Shared admin page shell: sidebar + content column. */
export default function AdminLayout({ title, description, className, children }) {
  return (
    <div className={cn('admin-layout', className)}>
      <AdminSidebar />
      <div>
        {title ? <h1 className="admin-title">{title}</h1> : null}
        {description ? <p className="admin-subtitle">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}
