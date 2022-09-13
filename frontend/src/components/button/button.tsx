export interface ButtonProps {
  className?: string;
  title: string;
  onClick?: (e: any) => void;
}

export function Button({ className, title, onClick }: ButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  );
}
