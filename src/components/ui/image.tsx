// import { useState } from "react";

// type Props = {
//   src: string;
//   alt?: string;
//   className?: string;
// };
// export const Image = ({ alt, src, className }: Props) => {
//   const [isLoading, setIsLoading] = useState(true);
//   return (
//     <div
//       className={`bg-neutral-200 size-full ${className} ${
//         isLoading ? "animate-pulse" : ""
//       }`}
//     >
//       <img
//         src={src}
//         alt={alt}
//         onLoad={() => setIsLoading(false)}
//         className={`transition-all ${
//           isLoading ? "opacity-0" : "opacity-100"
//         } w-full h-full object-cover`}
//       />
//     </div>
//   );
// };

import { useState } from "react";

const placeholderUsers: string[] = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/83.jpg",
  "https://randomuser.me/api/portraits/women/19.jpg",
  "https://randomuser.me/api/portraits/men/51.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
  "https://randomuser.me/api/portraits/men/24.jpg",
  "https://randomuser.me/api/portraits/women/57.jpg",
];

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export const Image = ({ alt, src, className }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  // pick random placeholder if src is ""
  const finalSrc =
    src && src.trim() !== ""
      ? src
      : placeholderUsers[Math.floor(Math.random() * placeholderUsers.length)];

  return (
    <div
      className={`size-full bg-neutral-200 ${className} ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <img
        src={finalSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={`transition-all ${
          isLoading ? "opacity-0" : "opacity-100"
        } h-full w-full object-cover`}
      />
    </div>
  );
};
