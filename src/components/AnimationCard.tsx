import { Player } from "@lottiefiles/react-lottie-player";
import { Card, Avatar } from "antd";
import Meta from "antd/es/card/Meta";
import { FC } from "react";
import { PublicAnimation } from "../common/interfaces/PublicAnimation.interface";

type Props = {
  publicAnimation: PublicAnimation;
};

const AnimationCard: FC<Props> = (props) => {
  const { publicAnimation } = props;
  const {
    bgColor,
    jsonUrl,
    downloads,
    createdBy: { firstName, lastName, avatarUrl },
  } = publicAnimation;

  return (
    <Card
      style={{
        width: 240,
        height: 280,
        margin: "0 16px",
        boxShadow:
          "rgba(61, 72, 83, 0.36) 0px 0px 1px, rgba(61, 72, 83, 0.06) 0px 2px 6px, rgba(243, 246, 248, 0.15) 0px 8px 48px",
        backgroundColor: bgColor,
      }}
      bodyStyle={{
        padding: "8px  0px",
        height: 40,
      }}
      cover={
        <Player
          autoplay
          loop
          src={jsonUrl}
          style={{ height: "240px" }}
        ></Player>
      }
    >
      <Meta
        avatar={<Avatar src={avatarUrl} />}
        title={`${firstName} ${lastName ?? ""}`}
        style={{ textAlign: "left" }}
      />
    </Card>
  );
};

export default AnimationCard;
