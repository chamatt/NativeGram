import React, { useState, useEffect } from "react";
import { Icon, Button } from "@ui-kitten/components";

// import { Container } from './styles';

function FollowButton({ loading, following, onFollow, onUnfollow }) {
  return following ? (
    <Button
      style={{ width: 120 }}
      status="basic"
      size="small"
      onPress={onUnfollow}
      disabled={loading}
      icon={(styles) => <Icon {...styles} name="checkmark" />}
    >
      Following
    </Button>
  ) : (
    <Button
      style={{ width: 120 }}
      icon={(styles) => <Icon {...styles} name="person-add-outline" />}
      size="small"
      onPress={onFollow}
      disabled={loading}
    >
      Follow
    </Button>
  );
}

export default FollowButton;
