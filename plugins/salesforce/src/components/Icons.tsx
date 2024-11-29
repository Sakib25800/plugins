import classNames from "classnames"

export const CaretLeftIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        className={classNames("stroke-[#999999] fill-transparent stroke-[1.5] stroke-round", className)}
    >
        <path d="M 5 2 L 1.5 6 L 5 9.5"></path>
    </svg>
)

export const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={classNames("fill-[#888888]", className)}>
        <path d="M 0 4 C 0 1.791 1.791 0 4 0 L 14 0 C 16.209 0 18 1.791 18 4 L 18 14 C 18 16.209 16.209 18 14 18 L 4 18 C 1.791 18 0 16.209 0 14 Z M 14 9.333 L 13.989 9.333 C 13.996 9.223 14 9.112 14 9 C 14 6.239 11.761 4 9 4 C 6.239 4 4 6.239 4 9 C 4 11.761 6.239 14 9 14 C 11.649 14 13.816 11.941 13.989 9.336 C 13.993 9.335 13.996 9.334 14 9.333 Z M 7.631 5.597 C 7.243 6.449 7 7.658 7 9 C 7 9.112 7.002 9.223 7.005 9.333 L 5.348 9.333 C 5.338 9.223 5.333 9.112 5.333 9 C 5.333 7.503 6.243 6.156 7.631 5.597 Z M 7.631 12.403 C 6.348 11.886 5.474 10.696 5.349 9.337 C 5.902 9.464 6.459 9.566 7.019 9.644 C 7.083 10.726 7.306 11.69 7.631 12.403 Z M 10.369 12.403 C 10.68 11.721 10.898 10.809 10.972 9.783 C 11.522 9.745 12.071 9.684 12.617 9.6 C 12.411 10.848 11.569 11.919 10.369 12.403 Z M 11 9 C 11 7.658 10.757 6.449 10.369 5.597 C 11.757 6.156 12.667 7.503 12.667 9 C 12.667 9.112 12.662 9.223 12.652 9.333 L 10.995 9.333 C 10.998 9.223 11 9.112 11 9 Z M 9 5.333 C 9.552 5.333 10 6.975 10 9 C 10 9.112 9.999 9.224 9.996 9.333 L 8.004 9.333 C 8.001 9.224 8 9.112 8 9 C 8 6.975 8.448 5.333 9 5.333 Z M 9 12.667 C 8.519 12.667 8.116 11.419 8.021 9.756 C 8.671 9.812 9.323 9.835 9.975 9.824 C 9.873 11.453 9.475 12.667 9 12.667 Z"></path>
    </svg>
)

export const FormsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={classNames("fill-[#888888]", className)}>
        <path d="M 0 4 C 0 1.791 1.791 0 4 0 L 14 0 C 16.209 0 18 1.791 18 4 L 18 14 C 18 16.209 16.209 18 14 18 L 4 18 C 1.791 18 0 16.209 0 14 Z M 4 9 C 4 9.552 4.448 10 5 10 L 13 10 C 13.552 10 14 9.552 14 9 C 14 8.448 13.552 8 13 8 L 5 8 C 4.448 8 4 8.448 4 9 Z M 6 5 C 6 5.552 6.448 6 7 6 L 11 6 C 11.552 6 12 5.552 12 5 C 12 4.448 11.552 4 11 4 L 7 4 C 6.448 4 6 4.448 6 5 Z M 6 13 C 6 13.552 6.448 14 7 14 L 11 14 C 11.552 14 12 13.552 12 13 C 12 12.448 11.552 12 11 12 L 7 12 C 6.448 12 6 12.448 6 13 Z"></path>
    </svg>
)

export const MessagesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" className={classNames("fill-[#888888]", className)}>
        <path d="M 0 4 C 0 1.791 1.791 0 4 0 L 14 0 C 16.209 0 18 1.791 18 4 L 18 14 C 18 16.209 16.209 18 14 18 L 4 18 C 1.791 18 0 16.209 0 14 Z M 3 9 C 3 9.828 3.672 10.5 4.5 10.5 C 5.328 10.5 6 9.828 6 9 C 6 8.172 5.328 7.5 4.5 7.5 C 3.672 7.5 3 8.172 3 9 Z M 7.5 9 C 7.5 9.828 8.172 10.5 9 10.5 C 9.828 10.5 10.5 9.828 10.5 9 C 10.5 8.172 9.828 7.5 9 7.5 C 8.172 7.5 7.5 8.172 7.5 9 Z M 12 9 C 12 9.828 12.672 10.5 13.5 10.5 C 14.328 10.5 15 9.828 15 9 C 15 8.172 14.328 7.5 13.5 7.5 C 12.672 7.5 12 8.172 12 9 Z"></path>
        <path d="M 4 18 L 14 18 L 12.586 18 C 11.736 18 10.925 18.361 10.356 18.993 L 9.563 19.875 C 9.262 20.209 8.738 20.209 8.438 19.875 L 7.644 18.993 C 7.075 18.361 6.264 18 5.414 18 Z"></path>
    </svg>
)

export const ChartsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={classNames("fill-[#888888]", className)}>
        <path d="M 0 4 C 0 1.791 1.791 0 4 0 L 14 0 C 16.209 0 18 1.791 18 4 L 18 14 C 18 16.209 16.209 18 14 18 L 4 18 C 1.791 18 0 16.209 0 14 Z M 4 13 C 4 13.552 4.448 14 5 14 C 5.552 14 6 13.552 6 13 L 6 11 C 6 10.448 5.552 10 5 10 C 4.448 10 4 10.448 4 11 Z M 8 13 C 8 13.552 8.448 14 9 14 C 9.552 14 10 13.552 10 13 L 10 8 C 10 7.448 9.552 7 9 7 C 8.448 7 8 7.448 8 8 Z M 12 13 C 12 13.552 12.448 14 13 14 C 13.552 14 14 13.552 14 13 L 14 5 C 14 4.448 13.552 4 13 4 C 12.448 4 12 4.448 12 5 Z"></path>
    </svg>
)

export const PersonIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={classNames("fill-[#888888]", className)}>
        <path d="M 0 4 C 0 1.791 1.791 0 4 0 L 14 0 C 16.209 0 18 1.791 18 4 L 18 14 C 18 16.209 16.209 18 14 18 L 4 18 C 1.791 18 0 16.209 0 14 Z M 6.5 6.5 C 6.5 7.881 7.619 9 9 9 C 10.381 9 11.5 7.881 11.5 6.5 C 11.5 5.119 10.381 4 9 4 C 7.619 4 6.5 5.119 6.5 6.5 Z M 5.109 13.125 C 5.051 13.59 5.414 14 5.882 14 L 12.118 14 C 12.586 14 12.949 13.59 12.891 13.125 C 12.667 11.34 11.15 10 9.351 10 L 8.649 10 C 6.85 10 5.333 11.34 5.109 13.125 Z"></path>
    </svg>
)

export const SyncIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={classNames("fill-[#888888]", className)}>
        <path d="M -0.1 4.1 C -0.1 1.891 1.691 0.1 3.9 0.1 L 13.9 0.1 C 16.109 0.1 17.9 1.891 17.9 4.1 L 17.9 14.1 C 17.9 16.309 16.109 18.1 13.9 18.1 L 3.9 18.1 C 1.691 18.1 -0.1 16.309 -0.1 14.1 Z M 12.233 6.881 C 10.984 5.103 8.658 4.447 6.663 5.31 C 4.669 6.173 3.555 8.318 3.996 10.446 C 4.436 12.574 6.31 14.1 8.483 14.1 C 9.662 14.102 10.797 13.647 11.648 12.832 C 12.207 12.121 11.372 11.014 10.427 11.692 C 9.49 12.528 8.123 12.671 7.033 12.047 C 5.943 11.422 5.376 10.169 5.625 8.938 C 5.874 7.707 6.883 6.774 8.13 6.621 C 9.377 6.469 10.581 7.132 11.119 8.267 L 8.9 8.267 C 8.44 8.267 8.067 8.64 8.067 9.1 C 8.067 9.56 8.44 9.933 8.9 9.933 L 13.067 9.933 C 13.527 9.933 13.9 9.56 13.9 9.1 L 13.9 4.933 C 13.9 4.473 13.527 4.1 13.067 4.1 C 12.606 4.1 12.233 4.473 12.233 4.933 Z"></path>
    </svg>
)

export const CopyIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        className={classNames("fill-[#333333] dark:fill-white", className)}
    >
        <path d="M 11.25 4 L 2.5 4 C 2.086 4 1.75 4.336 1.75 4.75 L 1.75 13.5 C 1.75 13.914 2.086 14.25 2.5 14.25 L 11.25 14.25 C 11.664 14.25 12 13.914 12 13.5 L 12 4.75 C 12 4.336 11.664 4 11.25 4 Z M 10.5 12.75 L 3.25 12.75 L 3.25 5.5 L 10.5 5.5 Z M 14.25 2.5 L 14.25 11.25 C 14.25 11.664 13.914 12 13.5 12 C 13.086 12 12.75 11.664 12.75 11.25 L 12.75 3.25 L 4.75 3.25 C 4.336 3.25 4 2.914 4 2.5 C 4 2.086 4.336 1.75 4.75 1.75 L 13.5 1.75 C 13.914 1.75 14.25 2.086 14.25 2.5 Z"></path>
    </svg>
)

export const TickIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        className={classNames("fill-[#333333] dark:fill-white", className)}
    >
        <path d="M 11.031 5.969 C 11.172 6.11 11.251 6.301 11.251 6.501 C 11.251 6.7 11.172 6.891 11.031 7.032 L 7.531 10.532 C 7.39 10.673 7.199 10.752 6.999 10.752 C 6.8 10.752 6.609 10.673 6.468 10.532 L 4.968 9.032 C 4.675 8.738 4.675 8.263 4.968 7.969 C 5.262 7.676 5.737 7.676 6.031 7.969 L 7 8.937 L 9.969 5.967 C 10.11 5.827 10.301 5.748 10.5 5.748 C 10.699 5.749 10.89 5.828 11.031 5.969 Z M 14.75 8 C 14.75 11.728 11.728 14.75 8 14.75 C 4.272 14.75 1.25 11.728 1.25 8 C 1.25 4.272 4.272 1.25 8 1.25 C 11.726 1.254 14.746 4.274 14.75 8 Z M 13.25 8 C 13.25 5.101 10.899 2.75 8 2.75 C 5.101 2.75 2.75 5.101 2.75 8 C 2.75 10.899 5.101 13.25 8 13.25 C 10.898 13.247 13.247 10.898 13.25 8 Z"></path>
    </svg>
)

export const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className={classNames("", className)}>
        <path d="M4 .75a.75.75 0 0 1 1.5 0v8a.75.75 0 0 1-1.5 0Z"></path>
        <path d="M0 4.75A.75.75 0 0 1 .75 4h8a.75.75 0 0 1 0 1.5h-8A.75.75 0 0 1 0 4.75Z"></path>
    </svg>
)

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className={classNames("", className)}>
        <path d="M1 6.08a1.5 1.5 0 0 1 .39-1.009l3.5-3.85a1.5 1.5 0 0 1 2.22 0l3.5 3.85A1.5 1.5 0 0 1 11 6.08V9.5A1.5 1.5 0 0 1 9.5 11H8a1 1 0 0 1-1-1V8.25a.75.75 0 0 0-.75-.75h-.5a.75.75 0 0 0-.75.75V10a1 1 0 0 1-1 1H2.5A1.5 1.5 0 0 1 1 9.5Z" />
    </svg>
)

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className={classNames("fill-[#999999]", className)}>
        <path d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 6.046 9.679 7.017 9.13 7.819 L 11.164 9.854 C 11.457 10.146 11.457 10.621 11.164 10.914 C 10.871 11.207 10.396 11.207 10.104 10.914 L 8.107 8.918 C 7.254 9.595 6.174 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z M 1.5 5 C 1.5 6.933 3.067 8.5 5 8.5 C 6.933 8.5 8.5 6.933 8.5 5 C 8.5 3.067 6.933 1.5 5 1.5 C 3.067 1.5 1.5 3.067 1.5 5 Z"></path>
    </svg>
)

export const IconChevron = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="5"
        height="8"
        className={classNames(
            "fill-transparent stroke-[#999] stroke-[1.5] stroke-round stroke-linejoin-round",
            className
        )}
    >
        <path d="M 1 1 L 4 4 L 1 7"></path>
    </svg>
)

export const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className={classNames("fill-[#999999]", className)}>
        <path d="M 6 0 C 9.314 0 12 2.686 12 6 C 12 9.314 9.314 12 6 12 C 2.686 12 0 9.314 0 6 C 0 2.686 2.686 0 6 0 Z M 5 3 C 5 3.552 5.448 4 6 4 C 6.552 4 7 3.552 7 3 C 7 2.448 6.552 2 6 2 C 5.448 2 5 2.448 5 3 Z M 5 9 C 5 9.552 5.448 10 6 10 C 6.552 10 7 9.552 7 9 L 7 6 C 7 5.448 6.552 5 6 5 C 5.448 5 5 5.448 5 6 Z"></path>
    </svg>
)