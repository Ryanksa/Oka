import Head from "next/head";

type Props = {
  title: String;
};

const OkaHead = (props: Props) => {
  return (
    <Head>
      <title>{props.title}</title>
    </Head>
  );
};

export default OkaHead;
