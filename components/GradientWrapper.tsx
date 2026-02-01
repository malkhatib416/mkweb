const GradientWrapper = ({ children, ...props }: any) => (
  <div
    {...props}
    className={`relative overflow-hidden my-12 sm:my-24 ${props.className || ''}`}
  >
    {/* Fixed 1px separator so the line looks the same between all sections */}
    <div
      className="h-px w-full bg-slate-200 dark:bg-slate-600 shrink-0"
      aria-hidden
    />
    <div
      className="blur-[100px] absolute inset-0 w-full h-full bg-gradient-to-br from-myorange-100/5 via-violet-500/5 to-transparent dark:from-myorange-100/[0.07] dark:via-violet-500/[0.06] dark:to-transparent pointer-events-none"
      aria-hidden
    />
    <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
