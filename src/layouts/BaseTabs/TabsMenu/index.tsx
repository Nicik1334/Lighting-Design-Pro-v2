import { FullscreenOutlined, HomeOutlined, ReloadOutlined, TagOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import * as antIcons from '@ant-design/icons';
import { useKeyPress } from 'ahooks';
import { Button, Tooltip, Dropdown, Space, Tabs } from 'antd';
import React, { CSSProperties, useContext, useRef, useState } from 'react';
import { useModel, useNavigate } from '@umijs/max';
import type { TabsMenuProps, TagsItemType } from './data';
import styles from './index.less';
import { BaseTabsContext } from '..';
import { NOT_PATH, TABS_LIST } from '@/constants';
import NotPage from '@/pages/404';

const tabIconStyle: CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  transition: 'width .2s',
  overflow: 'hidden',
};

const TabBarStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 1,
  padding: 0,
  width: '100%',
  height: 48,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(8px)',
};
const TabsMenu: React.FC<TabsMenuProps> = ({
  cacheKeyMap,
  tabList,
  closePage,
  closeAllPage,
  closeOtherPage,
  refreshPage,
}) => {
  const navigate = useNavigate();
  const { initialState } = useModel('@@initialState');
  const { handleRefreshPage } = useContext(BaseTabsContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFull, setIsFull] = useState<boolean>(false);
  useKeyPress('ESC', () => setIsFull(false));
  const fullRef = useRef(null);

  return (
    <div className={`${styles.tags_wrapper} ${isFull ? styles.tabs_full : ''}`} ref={fullRef}>
      <Tabs
        tabBarExtraContent={{
          right: (
            <Space style={{ marginRight: 24, display: 'flex', alignItems: 'center' }}>
              <Tooltip title="重新加载" placement="bottom">
                <Button
                  type="text"
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    if (!loading) {
                      setLoading(true);
                      handleRefreshPage();
                      setTimeout(() => setLoading(false), 1000);
                    }
                  }}
                >
                  <ReloadOutlined
                    spin={loading}
                    style={{ fontSize: 18, fontWeight: 800, cursor: 'pointer' }}
                  />
                </Button>
              </Tooltip>
            </Space>
          ),
        }}
        onEdit={(targetKey, action) => {
          if (action === 'remove') {
            const tabItem = tabList.find(
              (item) => item.path === (targetKey as string).split(':')[0],
            );
            if (tabItem) closePage(tabItem);
          }
        }}
        onChange={(key: string) => {
          if (!key) return;
          key = key.split(':')[0];
          const tabItem = (
            JSON.parse(sessionStorage.getItem(TABS_LIST) || '[]') as TagsItemType[]
          ).find((o) => o.path === key);
          if (tabItem) {
            const search = (tabItem?.location?.search as Location) || '';
            navigate(`${key}${search}`);
          } else {
            navigate(key);
          }
        }}
        items={tabList.map((item): any => {
          return {
            label: (
              <div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: (
                          <Space align="center">
                            <ReloadOutlined style={{ fontSize: 12 }} />
                            <div>刷新</div>
                            <div
                              className={styles.drop_down_span}
                              onClick={() => refreshPage && refreshPage(item)}
                            />
                          </Space>
                        ),
                        key: '1',
                      },
                      {
                        label: (
                          <Space align="center">
                            <TagOutlined style={{ fontSize: 12 }} />
                            <div>关闭其他</div>
                            <div
                              className={styles.drop_down_span}
                              onClick={() => closeOtherPage && closeOtherPage()}
                            />
                          </Space>
                        ),
                        key: '2',
                      },
                      {
                        label: (
                          <Space align="center">
                            <HomeOutlined style={{ fontSize: 12 }} />
                            <div>关闭所有</div>
                            <div className={styles.drop_down_span} onClick={closeAllPage} />
                          </Space>
                        ),
                        key: '3',
                      },
                      {
                        label: (
                          <Space align="center">
                            <FullscreenOutlined style={{ fontSize: 12 }} />
                            <div>全屏</div>
                            <div
                              className={styles.drop_down_span}
                              onClick={() => setIsFull(true)}
                            />
                          </Space>
                        ),
                        key: '4',
                      },
                    ],
                  }}
                  trigger={['contextMenu']}
                >
                  <div>
                    {initialState?.settings?.tabView &&
                      initialState?.settings?.tabView?.tabIcon && (
                        <div style={{ ...tabIconStyle, width: item.active && item.icon ? 20 : 0 }}>
                          {item.icon && typeof item.icon === 'string' ? (
                            <Icon component={antIcons[item.icon]} />
                          ) : (
                            item.icon || <></>
                          )}
                        </div>
                      )}
                    {item.title}
                    <div className={styles.drop_down_span} />
                  </div>
                </Dropdown>
              </div>
            ),
            children: (
              <div className="keep-alive-layout animate__animated animate__fadeIn">
                {item.path === NOT_PATH ? <NotPage /> : item.children}
              </div>
            ),
            key: `${item.path}:${cacheKeyMap[`${item.path}`] || '_'}`,
          };
        })}
        renderTabBar={(props, DefaultTabBar: any) => (
          <div style={TabBarStyle} className={styles.tabs_hander}>
            <DefaultTabBar {...props} style={{ marginBottom: 0 }} />
          </div>
        )}
        activeKey={`${location.pathname}:${cacheKeyMap[`${location.pathname}`] || '_'}`}
        style={{ height: 'fit-content' }}
        type="editable-card"
        hideAdd
      />
    </div>
  );
};

export default TabsMenu;
