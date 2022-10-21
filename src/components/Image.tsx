import { Suspense, DetailedHTMLProps, ImgHTMLAttributes } from "react";
import Loading from "./Loading";
import imageCache from "../utils/imageCache";

const Image = (
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) => {
  const Img = () => {
    imageCache.read(props.src ?? "");
    return <img {...props} />;
  };
  return (
    <Suspense fallback={<Loading />}>
      <Img />
    </Suspense>
  );
};

export default Image;
