import React, { useState, useEffect } from "react";
import { View } from "react-native";

import {
  Container,
  Header,
  Author,
  Body,
  Footer,
  AuthorContainer,
  Right,
} from "./styles";
import { Avatar, Card, Text } from "@ui-kitten/components";
import SizedBox from "../SizedBox";
import { useNavigation } from "@react-navigation/native";
import { defaultAvatar } from "~/constants/";
import {
  formatDistance,
  subDays,
  parseISO,
  differenceInSeconds,
} from "date-fns";
import maxLength from "~/utils/maxLength";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CommentItem({ avatar, author, body, userId, date }) {
  const navigation = useNavigation();
  const [seeMore, setSeeMore] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const formattedDate = formatDistance(parseISO(date), new Date());
  useEffect(() => {
    const postTime = differenceInSeconds(new Date(), parseISO(date));
    if (postTime < 30) setIsNew(true);
    else setIsNew(false);
  }, [date]);

  const toggleSeeMore = () => {
    setSeeMore(!seeMore);
  };

  const renderBody = (body) => {
    const { text, overflow } = maxLength(
      body?.trim().replace(/[\n\r]/gi, " "),
      100
    );

    return seeMore ? (
      <Body>
        {body}
        {overflow ? <Text category="c2"> view less</Text> : ""}
      </Body>
    ) : (
      <Body>
        {text}
        {overflow ? <Text category="c2"> view more</Text> : ""}
      </Body>
    );
  };

  return (
    <Container>
      <Header>
        <AuthorContainer onPress={() => navigation.push("Profile", { userId })}>
          <Avatar
            size="tiny"
            source={avatar ? { uri: avatar } : defaultAvatar}
          />
          <SizedBox width={10} />
          <Author>@{author}</Author>
        </AuthorContainer>
        <Right>
          <Footer new={isNew}>{formattedDate}</Footer>
        </Right>
      </Header>

      <TouchableOpacity onPress={toggleSeeMore}>
        {renderBody(body)}
      </TouchableOpacity>
    </Container>
  );
}
