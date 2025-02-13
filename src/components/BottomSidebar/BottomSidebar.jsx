import { Flex, IconButton } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import SidebarItems from "../Sidebar/sidebarItems";
const BottomSidebar = () => {
  const navigate = useNavigate();

  return (
    <Flex
      position="fixed"
      direction="row"
      bottom="0"
      left="0"
      w="100%"
      bg="black"
      borderTop="1px solid #ddd"
      p={3}
      justify="space-around"
      align="center"
      boxShadow="lg"
      zIndex="1000"
    >
        <SidebarItems />
    </Flex>
  );
};

export default BottomSidebar;
