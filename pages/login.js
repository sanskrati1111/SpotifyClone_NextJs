import {getProviders, signIn} from "next-auth/react";
import { useState } from 'react';
import { useEffect } from 'react';


const Login = () => {
    const [providers, setProviders] = useState(null);
  
    useEffect(() => {
      (async () => {
        const res = await getProviders();
        setProviders(res);
      })();
    }, []);
  
    return (
      <>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button className="bg-[#18D860] text-white p-5 rounded-lg"
                onClick={() => {
                  signIn(provider.id, {callbackUrl:"/"});
                }}
              >
                Sign in with {provider.name}
              </button>
              {/* <h1
          className="text-4xl lg:text-9xl md:text-7xl  uppercase font-bold"
          style={{
            color: '#1ed760',
          }}
        >
          spotify
        </h1> */}
        {/* <small className="absolute top-[6.5rem] right-[24rem] font-extrabold uppercase text-lg text-white hidden lg:block">
          Clone
        </small> */}

            </div>
          ))}
        </div>
      </>
    );
  };

export default Login;

