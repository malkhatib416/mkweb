const GradientWrapper = ({ children, ...props }: any) => (
  <div
    {...props}
    className={`relative overflow-hidden my-12 border-t border-slate-200 dark:border-slate-800 sm:my-24 ${
      props.className || ''
    }`}
  >
    <div
      className="blur-[100px] absolute inset-0 w-full h-full bg-gradient-to-br from-myorange-100/5 via-violet-500/5 to-transparent dark:from-myorange-100/[0.07] dark:via-violet-500/[0.06] dark:to-transparent"
      aria-hidden
    />
    <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
