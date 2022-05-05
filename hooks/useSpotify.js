import { signIn, useSession } from "next-auth/react"
import {useEffect} from "react";
import spotifyApi from "../lib/spotify";

function useSpotify() {
    const {data: session, status}= useSession();
    useEffect(()=>{
        if(session){
            //if access token attempt fails direct user to login pg
            if(session.error === "RefreshAccessTokenError"){
                signIn();
            }
            spotifyApi.setAccessToken(session.user.accessToken);

        }

    },[session]);
    return spotifyApi;
       
}

export default useSpotify;