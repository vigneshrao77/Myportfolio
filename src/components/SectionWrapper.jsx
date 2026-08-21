import React from 'react';

const SectionWrapper = ({ id, children, className = '' }) => {
  return (
    <section id={id} className={className}>
      <div className="container">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;