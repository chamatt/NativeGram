import React, { useState } from "react";

import { Container } from "./styles";
import { Input, Icon } from "@ui-kitten/components";
import { gql } from "apollo-boost";
import LoadingIndicator from "../LoadingIndicator";
import { useMutation } from "@apollo/react-hooks";
import { useStoreState } from "easy-peasy";
import { Alert, ToastAndroid } from "react-native";

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $userId: ID!, $text: String!) {
    createComment(
      input: { data: { post: $postId, user: $userId, text: $text } }
    ) {
      comment {
        id
        text
      }
    }
  }
`;

function CommentInput({ postId }) {
  const me = useStoreState((state) => state?.auth?.user?._id);
  const [createComment, { data, loading, error }] = useMutation(
    CREATE_COMMENT,
    {
      onCompleted: () => {
        setComment("");
      },
      refetchQueries: ["fetchPost", "fetchComments"],
    }
  );

  const [comment, setComment] = useState("");
  const doComment = () => {
    if (comment.length > 0)
      createComment({ variables: { postId, userId: me, text: comment } });
    else Alert.alert("Cannot send empty comment", "Type something nice");
  };

  const loadingIcon = (style) =>
    !loading ? (
      <Icon {...style} name="edit" />
    ) : (
      <LoadingIndicator {...style} />
    );

  return (
    <Container>
      <Input
        value={comment}
        multiline
        status={error ? "danger" : "basic"}
        placeholder="Leave a Comment"
        icon={loadingIcon}
        onIconPress={doComment}
        onChangeText={setComment}
      ></Input>
    </Container>
  );
}

export default React.memo(CommentInput);
