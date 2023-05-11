import { useInterval } from 'ahooks';
import { LNumberRoll } from 'lighting-design';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import styles from './index.less';

export type TimeRollProps = {
  className?: string;
  format?: string;
};

const TimeRoll: React.FC<TimeRollProps> = ({ className, format }) => {
  const [value, setValue] = useState<string>(dayjs(new Date()).format(format));

  useInterval(() => {
    setValue(dayjs(new Date()).format(format));
  }, 1000);

  return (
    <div className={className}>
      <LNumberRoll type="date" className={styles.numberStyle} value={value} />
    </div>
  );
};

export default TimeRoll;
