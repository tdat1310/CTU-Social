import React from "react";
import { Grid } from "@chakra-ui/react";
import RightContent from "./content/rightContent";
import LeftContent from "./content/leftContent";
import MiddleContent from "./content/middleContent";

const ProfileContent = ({setProgress, data, setReload, scrollContainerRef}) => {

  return (
    <Grid templateColumns="2fr 6fr 2fr" gap={3} p={4} w={"100%"}>
      <RightContent data={data}/>
      <MiddleContent setProgress={setProgress} setReload={setReload} scrollContainerRef={scrollContainerRef}/>
      <LeftContent />
    </Grid>
  );
};

export default ProfileContent;
