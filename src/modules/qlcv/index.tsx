import DefaultLayout from '@/layout/default';
import Header from './components/Header';
import { useState } from 'react';
import Content from './components/Content';

const WorkFlowManagement = () => {
  const [filterState, setFilterState] = useState();

  return (
    <DefaultLayout
      header={<Header filterState={filterState} setFilterState={setFilterState} />}
      content={<Content filterState={filterState} setFilterState={setFilterState} />}
    />
  );
};

export default WorkFlowManagement;
