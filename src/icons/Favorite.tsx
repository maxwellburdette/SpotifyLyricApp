import * as React from 'react';

function Favorite(props: any) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid" {...props}>
      <path
        d="M117.686 16.288c-4.297-4.297-9.22-7.266-14.924-8.907-11.33-3.36-23.518-.86-32.582 6.72l-.781.546c-.938.703-3.282 1.641-5.392 1.641-2.187 0-4.688-1.172-5.313-1.64-.39-.235-.625-.391-.86-.548-9.063-7.579-21.252-10.08-32.582-6.72C13.922 10.74 4.39 19.96 1.187 32.072c-3.204 12.19.156 25.082 9.142 34.145L54.24 117.63c2.579 2.97 5.782 4.454 9.767 4.454 3.985 0 7.189-1.485 9.767-4.454l43.912-51.413C124.484 59.42 128 50.121 128 41.213c0-8.907-3.516-18.127-10.314-24.925z"
        fill="currentColor"
      />
    </svg>
  );
}

export default Favorite;
