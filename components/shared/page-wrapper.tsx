import React from 'react';

import GoBackButton from './go-back-button';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <GoBackButton />
      </div>

      <section>{children}</section>
    </div>
  );
};

export default PageWrapper;
