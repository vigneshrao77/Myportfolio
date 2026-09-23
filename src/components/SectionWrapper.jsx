import React from 'react';

const SectionWrapper = React.forwardRef(({ id, children, className = '' }, ref) => {
  return (
    <section id={id} className={className} ref={ref}>
      <div className="container">
        {children}
      </div>
    </section>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;
