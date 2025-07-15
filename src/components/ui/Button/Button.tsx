import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ width?: number; height?: number }>;
}

export default function Button({
  children,
  icon: Icon,
  ...other
}: ButtonProps) {
  return (
    <button className={styles.button} {...other}>
      {Icon ? <Icon width={24} height={24} /> : null}
      {children}
    </button>
  );
}
