import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyAPI,{ LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try{

        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshToken);

        const {body: refreshedToken} = await spotifyAPI.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken );

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    }
    catch(error){
        console.error(error)
        return{
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn: '/login'
  },
  callbacks:{
    async jwt({ token, user, account }) {
        // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          usernamme: account.providerAccountId,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
          console.log("EXISTING ACCESS TOKEN IS VALID");
        return token
      }
      // Access token has expired, try to update it
      console.log("ACCESS TOKEN IS EXPIRED, REFRESHING....");
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
        session.user.refreshToken = token.accessToken;
        session.user.accessToken = token.accessToken;
        session.user.username = token.username;
  
        return session
      },
  },
})