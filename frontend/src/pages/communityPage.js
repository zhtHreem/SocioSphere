import React from 'react';
import CommunityPage from '../Components/Chat/CommunityPage';
import { Navbar } from '../Components/Home/layout';

// no footer here: the chat fills the screen
const Community = () => (
  <>
    <Navbar />
    <CommunityPage />
  </>
);

export default Community;
