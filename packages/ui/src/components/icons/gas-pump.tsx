import type { Component } from 'solid-js';

export const GasPumpIcon: Component<{ class?: string }> = (props) => {
  return (
    <svg
      class={`${props.class} fill-current`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.17902 1.97613C1.17902 0.895434 1.17902 0 1.17902 0H10.0716C10.0716 0 10.0716 0.895434 10.0716 1.97613V7.90452H10.3186C11.8007 7.90452 13.0358 9.1396 13.0358 10.6217V11.6098C13.0358 12.042 13.3446 12.3508 13.7769 12.3508C14.1783 12.3508 14.5179 12.042 14.5179 11.6098V6.8547C13.6533 6.63856 13.0358 5.86664 13.0358 4.94033V2.9642L12.0477 1.97613C11.7698 1.72911 11.7698 1.26596 12.0477 0.988065C12.2948 0.741049 12.7579 0.741049 13.0358 0.988065L15.4133 3.39647C15.7839 3.767 16 4.26103 16 4.78594V5.18734V5.92839V6.91646V11.6098C16 12.8448 14.9811 13.8329 13.7769 13.8329C12.5418 13.8329 11.5537 12.8448 11.5537 11.6098V10.6217C11.5537 9.94241 10.9979 9.38662 10.3186 9.38662H10.0716V13.8329C10.5965 13.8329 11.2573 13.8329 11.2573 13.8329C11.2573 14.3887 11.2573 15.809 11.2573 15.809H8.06838e-06L0 13.8329C0 13.8329 0.623232 13.8329 1.17902 13.8329V1.97613ZM3.15515 2.47016V5.43436C3.15515 5.71225 3.15515 5.92839 3.15515 5.92839H8.09548C8.09548 5.92839 8.09548 5.71225 8.09548 5.43436V2.47016C8.09548 2.22315 8.09548 1.97613 8.09548 1.97613H3.15515C3.15515 1.97613 3.15515 2.22315 3.15515 2.47016Z" />
    </svg>
  );
};