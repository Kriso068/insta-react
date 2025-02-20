import { Box, Flex, Spinner, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import Navbar from "../../components/Navbar/Navbar";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";


const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);
  
  // Detect if on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isAuthPage = pathname === "/auth";
  const canRenderSidebar = user && !isAuthPage;
  const canRenderNavbar = !user && !loading && !isAuthPage;

  // Show spinner while authentication is loading
  if (loading) return <PageLayoutSpinner />;

  return (
    <Flex direction="column" h="100vh">
      {/* Show Navbar only when user is not authenticated */}
      {canRenderNavbar && <Navbar />}

      <Flex flex="1" direction={isMobile ? "column" : "row"} w="100%">
        {/* Sidebar for desktop */}
        {canRenderSidebar && !isMobile && (
          <Box w={{ base: "70px", md: "240px" }} h="100vh">
            <Sidebar />
          </Box>
        )}

        {/* Main Content Area */}
        <Box flex="1" w="100%" mx="auto" overflow="auto" pb={canRenderSidebar && isMobile ? "60px" : "0"}>
          {children}
        </Box>
      </Flex>

      {/* Sidebar as Bottom Navigation for Mobile */}
      {canRenderSidebar && isMobile && <BottomSidebar />}
    </Flex>
  );
};

export default PageLayout;

// Spinner while checking authentication
const PageLayoutSpinner = () => {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Spinner size="xl" />
    </Flex>
  );
};
