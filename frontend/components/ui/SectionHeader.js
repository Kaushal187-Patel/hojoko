import { cn } from '@/utils/cn';

/** Eyebrow + section title block with optional description and action slot. */
export default function SectionHeader({ eyebrow, title, description, action, className }) {
  return (
    <div className={cn('section-header-row', className)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h2 className="section-title mt-3">{title}</h2> : null}
        {description ? <p className="body-copy mt-4 max-w-2xl">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
