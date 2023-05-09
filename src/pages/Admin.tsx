import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Card } from 'antd';
import React, { useEffect } from 'react';

const Admin: React.FC = () => {
  let [searchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get('index'));
  }, []);
  return (
    <PageContainer content="This page can only be viewed by admin">
      <Card>
        query参数：index = {searchParams.get('index')}
        <br />
        <br />
        <input type="text" />
      </Card>
    </PageContainer>
  );
};

export default Admin;
