export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <motion.div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}

function motion({ children, className }) {
  return <motion.div className={className}>{children}</motion.div>;
}
