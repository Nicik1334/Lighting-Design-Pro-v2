import { PageContainer, ProCard } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import React, { useState, useContext } from 'react';
import { LNumberRoll, LTypeit } from 'lighting-design';
import styles from './index.less';
import { useRafInterval } from 'ahooks';
import { BaseTabsContext } from '@/layouts/BaseTabs';
import { Button, Space, theme, Tooltip } from 'antd';
import { history, request } from '@umijs/max';
import Hamster from '@/components/common/Hamster';

const Dashboard: React.FC = () => {
  const [value, setValue] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  useRafInterval(() => {
    setValue(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  }, 1000);

  const { handleRefreshPage, handleClosePage, handleCloseAll, handleCloseOther } =
    useContext(BaseTabsContext);
  const { useToken } = theme;

  const { token } = useToken();
  return (
    <PageContainer>
      <ProCard
        style={{
          backgroundColor: token.colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Hamster />
        <LNumberRoll type="date" className={styles.numberStyle} value={value} />
        <LTypeit
          className={styles.typeit}
          options={{
            cursor: false,
            speed: 60,
            waitUntilVisible: true,
          }}
          getBeforeInit={(instance) => {
            return instance.type('时间就像奔跑的仓鼠，它总是不知疲倦地奔跑，永不停息。');
          }}
        />
        <Space>
          <Tooltip title="/">
            <Button onClick={() => history.push('/')}>刷新系统</Button>
          </Tooltip>
          <Tooltip title="/form">
            <Button onClick={() => history.push('/form')}>重定向</Button>
          </Tooltip>
          <Tooltip title="/system/menu">
            <Button onClick={() => history.push('/system/menu')}>无权限</Button>
          </Tooltip>
          <Tooltip title="/404">
            <Button onClick={() => history.push('/404')}>404</Button>
          </Tooltip>
          <Tooltip title="/form/modal-form?index=1">
            <Button onClick={() => history.push('/form/modal-form?index=1')}>带参数</Button>
          </Tooltip>
          <Button
            onClick={() => {
              handleRefreshPage();
              // handleRefreshPage((tag: TagsItemType) => {
              //   return { ...tag, path: '/dashboard' };
              // });
            }}
          >
            刷新当前页面
          </Button>
          <Button
            onClick={() => {
              handleClosePage();
              // handleClosePage((tag) => ({ ...tag }));
            }}
          >
            关闭当前页面
          </Button>
          <Button
            onClick={() => {
              handleCloseOther();
            }}
          >
            关闭其他页面
          </Button>
          <Button
            onClick={() => {
              handleCloseAll();
            }}
          >
            关闭所有页面
          </Button>
        </Space>
      </ProCard>
    </PageContainer>
  );
};

export default Dashboard;
