import SellerSidebar from '@/components/SellerSidebar';
import { cn } from '@/utils/cn';

export default function SellerLayout({ title, description, className, children }) {
  return (
    <div className={cn('admin-layout', className)}>
      <SellerSidebar />
      <div>
        {title ? <h1 className="admin-title">{title}</h1> : null}
        {description ? <p className="admin-subtitle">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}
