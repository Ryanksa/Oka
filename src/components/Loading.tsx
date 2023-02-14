import styles from "../styles/Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <div className={styles.mass} />
        <div className={styles.massMask} />
      </div>
    </div>
  );
};

export default Loading;
