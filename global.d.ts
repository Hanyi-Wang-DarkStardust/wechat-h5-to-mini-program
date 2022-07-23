import type React from 'react';

interface WxOpenLaunchWeappTag extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  username: string;
  path: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wx-open-launch-weapp': WxOpenLaunchWeappTag,
    }
  }
}