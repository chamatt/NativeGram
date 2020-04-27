import React from "react";
import { Button, ListItem, Avatar, Layout, Icon } from "@ui-kitten/components";
import { defaultAvatar } from "~/constants";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
// import { Container } from './styles';

export default function UserItem({
  id,
  image,
  name,
  slug,
  following,
  onFollow,
}) {
  console.log("rerender");
  const navigation = useNavigation();
  return (
    <ListItem
      onPress={() => {
        console.log("go to profile", id);
        navigation.navigate("Profile", { screen: "Profile", userId: id });
      }}
      title={`${name}`}
      description={`@${slug}`}
      icon={(styles) => {
        delete styles.tintColor;
        return (
          <Avatar {...styles} size="tiny" source={image || defaultAvatar} />
        );
      }}
      //   accessory={() =>
      //     following ? (
      //       <Button
      //         style={{ width: 120 }}
      //         status="basic"
      //         size="tiny"
      //         icon={(styles) => <Icon {...styles} name="checkmark" />}
      //       >
      //         Following
      //       </Button>
      //     ) : (
      //       <Button
      //         style={{ width: 120 }}
      //         icon={(styles) => <Icon {...styles} name="person-add-outline" />}
      //         size="tiny"
      //       >
      //         Follow
      //       </Button>
      //     )
      //   }
    />
  );
}

UserItem.propTypes = {
  image: PropTypes.object,
  name: PropTypes.string,
  slug: PropTypes.string,
  following: PropTypes.bool,
  onFollow: PropTypes.func,
};
UserItem.defaultProps = {
  image: defaultAvatar,
  name: "",
  slug: "",
  following: false,
  onFollow: () => {},
};
