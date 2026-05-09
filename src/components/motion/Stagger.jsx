export const StaggerContainer = ({ children, className = '', as = 'div' }) => {
  const Component = as;

  return (
    <Component className={className}>
      {children}
    </Component>
  );
};

export const StaggerItem = ({ children, className = '', hover = false, as = 'div' }) => {
  const Component = as;
  const hoverClass = hover ? ' transition-transform duration-300 hover:-translate-y-1' : '';

  return (
    <Component className={`${className}${hoverClass}`}>
      {children}
    </Component>
  );
};
