import React from 'react';

/*
createContext method takes the default value of the context that will be passed through
to all components that need it. Since we need to pass a user object,
use that as the context variable and set default value to an initial state where
the user isn't signed in.
 */
const UserContext = React.createContext({
  signedIn: false,
});

/*
React Context API can be used to pass properties across the component hierarchy
without making intermediate components aware of it. Designed to share data
that is to be considered global.
 */
export default UserContext;
