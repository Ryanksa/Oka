import styles from "../styles/Loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading} />
    </div>
  );
};

export default Loading;
