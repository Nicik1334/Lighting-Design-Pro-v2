import { ExpandOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useModel } from '@umijs/max';
import HeaderSearch from '../HeaderSearch';
import TimeRoll from '../../common/TimeRoll';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }
  return (
    <Space className={styles.right}>
      <div className={`${styles.action} ${styles.hidden}`} style={{ fontFamily: 'initial' }}>
        <TimeRoll format="YYYY-MM-DD HH:mm" />
      </div>
      <HeaderSearch className={`${styles.action} ${styles.fullscreen} ${styles.hidden}`} />
      <div
        className={`${styles.action} ${styles.hidden}`}
        style={{ fontFamily: 'inherit' }}
        title={!isFullScreen ? '全屏' : '退出全屏'}
        onClick={() => {
          const doc = document as any;
          const isFull: boolean = doc?.webkitIsFullScreen;
          setIsFullScreen(!isFull);
          if (isFull) {
            doc?.webkitExitFullscreen();
          } else {
            document.querySelector('html')?.requestFullscreen();
          }
        }}
      >
        {isFullScreen ? (
          <FullscreenExitOutlined style={{ fontSize: 16 }} />
        ) : (
          <ExpandOutlined style={{ fontSize: 16 }} />
        )}
      </div>
      <Avatar menu />
    </Space>
  );
};
export default GlobalHeaderRight;
