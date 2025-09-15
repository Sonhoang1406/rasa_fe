interface GitlabLogoProps {
    className?: string
  }
  
  export function GitlabLogo({ className }: GitlabLogoProps) {
    return (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.6L4.8 13.2L6.3 7.8L12 13.2L17.7 7.8L19.2 13.2L12 21.6Z" fill="#FC6D26" />
        <path d="M12 21.6L4.8 13.2H19.2L12 21.6Z" fill="#E24329" />
        <path d="M17.7 7.8L12 13.2H19.2L17.7 7.8Z" fill="#FCA326" />
        <path d="M6.3 7.8L4.8 13.2H12L6.3 7.8Z" fill="#FCA326" />
        <path d="M6.3 7.8L12 13.2L17.7 7.8L12 2.4L6.3 7.8Z" fill="#E24329" />
      </svg>
    )
  }
  
  