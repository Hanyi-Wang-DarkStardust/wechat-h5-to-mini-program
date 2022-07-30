import React, { useRef } from 'react';
import WeappTag from './weapp-tag';
import type { IWechatH5ToMiniProgram } from './interface';

const WechatH5ToMiniProgram: React.FC<IWechatH5ToMiniProgram> = (props: IWechatH5ToMiniProgram) => {
  const {
    children,
    className = '',
    style = {},
    ...WeappTagProps
  } = props;
  const childrenRef = useRef<HTMLDivElement>(null);

  if (!children) {
    return null;
  }

  return (
    <div className={className} style={{ ...style, position: 'relative' }}>
      <div ref={childrenRef}>{children}</div>
      <WeappTag
        {...WeappTagProps}
        childrenRef={childrenRef}
      />
    </div>
  );
};

export default WechatH5ToMiniProgram;
