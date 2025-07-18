const GradientWrapper = ({ children, ...props }: any) => (
  <div
    {...props}
    className={`relative overflow-hidden my-12 border-t sm:my-24 ${
      props.className || ''
    }`}
  >
    <div
      className="blur-[100px] absolute inset-0 w-full h-full"
      style={{
        background:
          'linear-gradient(202.72deg, rgba(237, 78, 80, 0.05) 14.76%, rgba(152, 103, 240, 0.04) 34.37%, rgba(152, 103, 240, 0) 86.62%)',
      }}
    />
    <div className="relative">{children}</div>
  </div>
);

export default GradientWrapper;
