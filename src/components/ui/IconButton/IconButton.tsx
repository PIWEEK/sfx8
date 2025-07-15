import styles from "./IconButton.module.css";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ width?: number; height?: number }>;
}

export default function IconButton({ icon: Icon, ...other }: IconButtonProps) {
  return (
    <button className={styles.button} {...other}>
      {Icon ? <Icon width={24} height={24} /> : null}
    </button>
  );
}
