export function Button({ className, title, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  );
}
